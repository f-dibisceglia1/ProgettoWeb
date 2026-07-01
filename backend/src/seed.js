// Script di "seed": popola il database con un utente amministratore e un
// catalogo di libri usati d'esempio. Si esegue con:  npm run seed
//
// E' utile per avere subito dati con cui provare l'applicazione (e per la
// commissione d'esame che testera' le funzionalita').
require('dotenv').config();
const mongoose = require ('mongoose');
const { connectDB } = require ('./config/db.js');
const User = require ('./models/User.js');
const Book = require ('./models/Book.js');
const Order = require ('./models/Order.js');

// Le immagini sono file reali serviti dal frontend (cartella public/books).
// Il percorso e' relativo: il frontend gli antepone il base path corretto.
const sampleBooks = [
  {
    title: 'Analisi Matematica 1',
    author: 'Marco Bramanti, Carlo Pagani, Sandro Salsa',
    description: 'Manuale di analisi 1, con esercizi svolti. Alcune sottolineature a matita.',
    category: 'Ingegneria',
    isbn: '9788808066361',
    price: 22,
    condition: 'buono',
    available: true,
    image: 'books/analisi-matematica-1.webp',
  },
  {
    title: 'Fisica Generale I - Meccanica e Termodinamica',
    author: 'Paolo Mazzoldi, Massimo Nigro, Cesare Voci',
    description: 'Manuale universitario, copertina un po\' rovinata ma pagine integre.',
    category: 'Ingegneria',
    isbn: '9788808187738',
    price: 25,
    condition: 'accettabile',
    available: true,
    image: 'books/fisica-generale-1.webp',
  },
  {
    title: 'Diritto Privato',
    author: 'Andrea Torrente, Piero Schlesinger',
    description: 'Edizione aggiornata, come nuovo, mai scritto sopra.',
    category: 'Giurisprudenza',
    isbn: '9788814232987',
    price: 32,
    condition: 'come nuovo',
    available: true,
    image: 'books/diritto-privato.webp',
  },
  {
    title: 'Principi di Economia',
    author: 'N. Gregory Mankiw',
    description: 'Testo base del corso di Economia Politica, con evidenziazioni.',
    category: 'Economia',
    isbn: '9788808920659',
    price: 28,
    condition: 'buono',
    available: true,
    image: 'books/principi-economia.webp',
  },
  {
    title: 'Basi di Dati',
    author: 'Paolo Atzeni, Stefano Ceri, Piero Fraternali',
    description: 'Manuale per il corso di Basi di Dati, ottime condizioni.',
    category: 'Informatica',
    isbn: '9788838665667',
    price: 24,
    condition: 'come nuovo',
    available: true,
    image: 'books/basi-di-dati.webp',
  },
  {
    title: 'Chimica Generale e Inorganica',
    author: 'Michael Silberberg',
    description: 'Testo di chimica per corsi STEM, copertina rovinata sugli angoli.',
    category: 'Scienze',
    isbn: '9788838669238',
    price: 20,
    condition: 'accettabile',
    available: true,
    image: 'books/chimica-generale.webp',
  },
  {
    title: 'Anatomia Umana',
    author: 'Frederic Martini',
    description: 'Manuale per il corso di Anatomia, con atlante illustrato incluso.',
    category: 'Medicina',
    isbn: '9788829926879',
    price: 45,
    condition: 'buono',
    available: true,
    image: 'books/anatomia-umana.webp',
  },
  {
    title: 'Psicologia Generale',
    author: 'David G. Myers',
    description: 'Manuale introduttivo, alcune pagine con appunti a margine.',
    category: 'Psicologia',
    isbn: '9788808920123',
    price: 18,
    condition: 'accettabile',
    available: true,
    image: 'books/psicologia-generale.webp',
  },
];

async function run() {
  await connectDB(process.env.MONGODB_URI);

  // Puliamo le collezioni per ripartire da uno stato noto.
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Order.deleteMany({})]);
  console.log('[seed] collezioni svuotate');

  // Creiamo l'utente amministratore.
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@nexumshop.it';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#2026!';
  const passwordHash = await User.hashPassword(adminPassword);
  await User.create({
    name: 'Amministratore',
    email: adminEmail,
    passwordHash,
    role: 'admin',
  });
  console.log(`[seed] admin creato: ${adminEmail} / ${adminPassword}`);

  // Creiamo un cliente di prova.
  const customerHash = await User.hashPassword('Cliente#2026!');
  await User.create({
    name: 'Cliente Demo',
    email: 'cliente@nexumshop.it',
    passwordHash: customerHash,
    role: 'customer',
  });
  console.log('[seed] cliente di prova creato: cliente@nexumshop.it / Cliente#2026!');

  // Inseriamo i libri.
  await Book.insertMany(sampleBooks);
  console.log(`[seed] ${sampleBooks.length} libri inseriti`);

  await mongoose.disconnect();
  console.log('[seed] completato.');
}

run().catch((err) => {
  console.error('[seed] errore:', err.message);
  process.exit(1);
});