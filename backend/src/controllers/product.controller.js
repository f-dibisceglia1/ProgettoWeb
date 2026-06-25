// Controller dei prodotti.
// - Le rotte di lettura (lista, dettaglio) sono pubbliche.
// - Le rotte di scrittura (crea, modifica, elimina) sono riservate all'admin.
//
// Quando lo stock cambia, emettiamo un evento Socket.IO "stock:update" cosi'
// che TUTTI i client connessi vedano la disponibilita' aggiornata in tempo
// reale, senza ricaricare la pagina.
const Product = require('../models/Product.js');

// GET /api/products  -> lista catalogo (con filtro opzionale per categoria/ricerca)
async function listProducts(req, res) {
  const { category, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: 'i' }; // ricerca case-insensitive

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/:id -> dettaglio di un singolo prodotto
async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Prodotto non trovato.' });
  }
  res.json(product);
}

// POST /api/products  (admin) -> crea un nuovo prodotto
async function createProduct(req, res) {
  const { name, description, category, price, sizes, stock, image } = req.body;
  if (!name || !category || price == null) {
    return res.status(400).json({ message: 'Nome, categoria e prezzo sono obbligatori.' });
  }
  const product = await Product.create({
    name,
    description,
    category,
    price,
    sizes,
    stock,
    image,
  });
  res.status(201).json(product);
}

// PUT /api/products/:id  (admin) -> modifica un prodotto esistente
async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Prodotto non trovato.' });
  }

  const fields = ['name', 'description', 'category', 'price', 'sizes', 'stock', 'image'];
  for (const f of fields) {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  }
  await product.save();

  // Notifica in tempo reale: lo stock potrebbe essere cambiato.
  const io = req.app.get('io');
  io.emit('stock:update', { productId: product._id.toString(), stock: product.stock });

  res.json(product);
}

// DELETE /api/products/:id  (admin) -> elimina un prodotto
async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Prodotto non trovato.' });
  }
  res.json({ message: 'Prodotto eliminato.' });
}

module.exports = 
{ 
  listProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
