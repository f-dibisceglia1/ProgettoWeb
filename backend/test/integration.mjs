// Test di integrazione end-to-end con MongoDB in memoria.
// Avvia un vero mongod temporaneo in RAM, esegue il seed, avvia il server
// Express e verifica l'intero flusso: catalogo, login, ordine, real-time.
//
// Esecuzione:  node test/integration.mjs
import { MongoMemoryServer } from 'mongodb-memory-server';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { io } from 'socket.io-client';

const PORT = 4055;
const BASE = `http://localhost:${PORT}`;
const API = `${BASE}/api/v1`;
let pass = 0;
let fail = 0;

function check(name, cond) {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}`);
  }
}

// Estrae il cookie di sessione da una risposta fetch.
function getCookie(res) {
  const cookies = res.headers.getSetCookie();
  const token = cookies.find((c) => c.startsWith('token='));
  return token ? token.split(';')[0] : '';
}

async function waitServer() {
  for (let i = 0; i < 50; i++) {
    try {
      const r = await fetch(`${API}/health`);
      if (r.ok) return true;
    } catch {
      // server non ancora pronto
    }
    await sleep(200);
  }
  throw new Error('Il server non si e avviato in tempo.');
}

let mongod;
let server;

try {
  console.log('\n[1] Avvio MongoDB in memoria...');
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri('nexumshop');
  const env = { ...process.env, MONGODB_URI: uri, JWT_SECRET: 'test-secret', PORT: String(PORT), NODE_ENV: 'development' };
  console.log('    MongoDB pronto.');

  console.log('[2] Seed del database...');
  await new Promise((resolve, reject) => {
    const s = spawn('node', ['src/seed.js'], { env, stdio: 'inherit' });
    s.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('seed fallito'))));
  });

  console.log('[3] Avvio del server Express...');
  server = spawn('node', ['src/server.js'], { env, stdio: 'pipe' });
  server.stderr.on('data', (d) => process.stderr.write(`    [server] ${d}`));
  await waitServer();
  console.log('    Server pronto.');

  console.log('\n[4] Test API REST:');
  // Catalogo pubblico
  let res = await fetch(`${API}/books`);
  const books = await res.json();
  check('GET /books restituisce il catalogo (8 libri)', res.status === 200 && books.length === 8);

  const book = books[0];
  check('Il libro iniziale e disponibile', book.available === true);

  // Login admin
  res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@nexumshop.it', password: 'Admin#2026!' }),
  });
  const adminData = await res.json();
  const adminCookie = getCookie(res);
  check('Login admin riuscito', res.status === 200 && adminData.user.role === 'admin');
  check('Login admin imposta il cookie di sessione', adminCookie.length > 0);

  // /auth/me con cookie
  res = await fetch(`${API}/auth/me`, { headers: { Cookie: adminCookie } });
  const meData = await res.json();
  check('GET /auth/me riconosce la sessione', res.status === 200 && meData.user.email === 'admin@nexumshop.it');

  // /auth/me senza cookie -> 401
  res = await fetch(`${API}/auth/me`);
  check('GET /auth/me senza sessione -> 401', res.status === 401);

  // Login cliente
  res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'cliente@nexumshop.it', password: 'Cliente#2026!' }),
  });
  const customerCookie = getCookie(res);
  check('Login cliente riuscito', res.status === 200);

  // Un cliente NON puo' creare libri -> 403
  res = await fetch(`${API}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: customerCookie },
    body: JSON.stringify({ title: 'X', author: 'Y', category: 'Z', price: 1, condition: 'buono' }),
  });
  check('Cliente non puo creare libri -> 403', res.status === 403);

  console.log('\n[5] Test real-time (Socket.IO):');
  // Socket admin (riceve order:new) e socket cliente (riceve book:update)
  const adminSocket = io(BASE, { path: '/socket.io', extraHeaders: { Cookie: adminCookie } });
  const guestSocket = io(BASE, { path: '/socket.io' });

  let gotBookUpdate = null;
  let gotOrderNew = null;
  guestSocket.on('book:update', (d) => (gotBookUpdate = d));
  adminSocket.on('order:new', (d) => (gotOrderNew = d));

  await Promise.all([
    new Promise((r) => adminSocket.on('connect', r)),
    new Promise((r) => guestSocket.on('connect', r)),
  ]);
  await sleep(300); // tempo per l'ingresso nella room admin
  check('Socket admin e ospite connessi', adminSocket.connected && guestSocket.connected);

  console.log('\n[6] Test creazione ordine + effetti real-time:');
  res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: customerCookie },
    body: JSON.stringify({
      items: [{ bookId: book._id }],
      shippingAddress: { street: 'Via Roma 1', city: 'Bari', zip: '70100' },
    }),
  });
  const order = await res.json();
  check('POST /orders crea l ordine (201)', res.status === 201);
  check('Totale ordine corretto', Math.abs(order.total - book.price) < 0.001);

  // Verifica che il libro non sia piu disponibile
  res = await fetch(`${API}/books/${book._id}`);
  const updated = await res.json();
  check('Libro segnato come non disponibile dopo l acquisto', updated.available === false);

  await sleep(400); // tempo di propagazione degli eventi
  check('Evento book:update ricevuto dal client', gotBookUpdate && gotBookUpdate.bookId === book._id && gotBookUpdate.available === false);
  check('Evento order:new ricevuto dall admin', gotOrderNew && gotOrderNew.total === order.total);

  // Libro gia venduto -> 409
  res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: customerCookie },
    body: JSON.stringify({ items: [{ bookId: book._id }] }),
  });
  check('Ordine su libro gia venduto -> 409', res.status === 409);

  console.log('\n[7] Test ordini lato cliente e admin:');
  res = await fetch(`${API}/orders/mine`, { headers: { Cookie: customerCookie } });
  const mine = await res.json();
  check('GET /orders/mine -> 1 ordine del cliente', res.status === 200 && mine.length === 1);

  res = await fetch(`${API}/orders`, { headers: { Cookie: adminCookie } });
  const all = await res.json();
  check('GET /orders (admin) -> 1 ordine totale', res.status === 200 && all.length === 1);

  // Aggiornamento stato ordine
  res = await fetch(`${API}/orders/${order._id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ status: 'spedito' }),
  });
  const updatedOrder = await res.json();
  check('Admin aggiorna stato ordine -> spedito', res.status === 200 && updatedOrder.status === 'spedito');

  adminSocket.close();
  guestSocket.close();
} catch (err) {
  console.error('\nERRORE nel test:', err);
  fail++;
} finally {
  if (server) server.kill();
  if (mongod) await mongod.stop();
  console.log(`\n========================================`);
  console.log(`  Risultato: ${pass} superati, ${fail} falliti`);
  console.log(`========================================\n`);
  process.exit(fail === 0 ? 0 : 1);
}