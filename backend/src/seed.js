// Script di "seed": popola il database con un utente amministratore e un
// catalogo di prodotti d'esempio. Si esegue con:  npm run seed
//
// E' utile per avere subito dati con cui provare l'applicazione (e per la
// commissione d'esame che testera' le funzionalita').
require('dotenv').config();
const mongoose = require ('mongoose');
const { connectDB } = require ('./config/db.js');
const User = require ('./models/User.js');
const Product = require ('./models/Product.js');
const Order = require ('./models/Order.js');

// Le immagini sono file reali serviti dal frontend (cartella public/products).
// Il percorso e' relativo: il frontend gli antepone il base path corretto.
const sampleProducts = [
  {
    name: 'Camicia a quadri uomo',
    description: 'Camicia in flanella a quadri rosso e nero, vestibilita regular.',
    category: 'Camicie',
    price: 29.9,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 18,
    image: 'products/camicia-quadri.webp',
  },
  {
    name: 'Camicia a maniche corte',
    description: 'Camicia leggera a maniche corte, ideale per la mezza stagione.',
    category: 'Camicie',
    price: 24.9,
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 22,
    image: 'products/camicia-maniche-corte.webp',
  },
  {
    name: 'Sneakers Puma Future Rider',
    description: 'Scarpe da ginnastica retro running, suola ammortizzata.',
    category: 'Scarpe',
    price: 79.9,
    sizes: ['40', '41', '42', '43', '44'],
    stock: 10,
    image: 'products/sneakers-puma.webp',
  },
  {
    name: 'Sneakers sportive bianco/rosso',
    description: 'Sneakers sportive in tessuto traspirante, look dinamico.',
    category: 'Scarpe',
    price: 64.9,
    sizes: ['40', '41', '42', '43', '44'],
    stock: 12,
    image: 'products/sneakers-sport.webp',
  },
  {
    name: 'Decollete con tacco',
    description: 'Scarpe eleganti con tacco, perfette per le occasioni speciali.',
    category: 'Scarpe',
    price: 89.9,
    sizes: ['36', '37', '38', '39', '40'],
    stock: 7,
    image: 'products/scarpe-tacco.webp',
  },
  {
    name: 'Abito grigio elegante',
    description: 'Abito grigio dal taglio sartoriale, tessuto morbido.',
    category: 'Abiti',
    price: 49.9,
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 9,
    image: 'products/abito-grigio.webp',
  },
  {
    name: 'Abito estivo',
    description: 'Abito leggero estivo, fresco e versatile.',
    category: 'Abiti',
    price: 39.9,
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 14,
    image: 'products/abito-estivo.webp',
  },
  {
    name: 'Occhiali da sole classici',
    description: 'Occhiali da sole con montatura classica e lenti UV400.',
    category: 'Accessori',
    price: 19.9,
    sizes: ['Unica'],
    stock: 30,
    image: 'products/occhiali-sole.webp',
  },
];

async function run() {
  await connectDB(process.env.MONGODB_URI);

  // Puliamo le collezioni per ripartire da uno stato noto.
  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
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

  // Inseriamo i prodotti.
  await Product.insertMany(sampleProducts);
  console.log(`[seed] ${sampleProducts.length} prodotti inseriti`);

  await mongoose.disconnect();
  console.log('[seed] completato.');
}

run().catch((err) => {
  console.error('[seed] errore:', err.message);
  process.exit(1);
});
