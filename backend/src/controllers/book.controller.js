// Controller dei libri.
// - Le rotte di lettura (lista, dettaglio) sono pubbliche.
// - Le rotte di scrittura (crea, modifica, elimina) sono riservate all'admin.
//
// Quando lo stock cambia, emettiamo un evento Socket.IO "stock:update" cosi'
// che TUTTI i client connessi vedano la disponibilita' aggiornata in tempo
// reale, senza ricaricare la pagina.
const Book = require('../models/Book.js');

// GET /api/v1/books  -> lista catalogo (con filtro opzionale per categoria/ricerca)
async function listBooks(req, res) {
  const { category, q } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ]; // ricerca case-insensitive

  const books = await Book.find(filter).sort({ createdAt: -1 });
  res.json(books);
}

// GET /api/v1/book/:id -> dettaglio di un singolo prodotto
async function getBook(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Libro non trovato.' });
  }
  res.json(book);
}

// POST /api/v1/books  (admin) -> crea un nuovo prodotto
async function createBook(req, res) {
  const { title, author, description, category, price, condition, available, image } = req.body;
  if (!title || !category || price == null) {
    return res.status(400).json({ message: 'Titolo, categoria e prezzo sono obbligatori.' });
  }
  const book = await Book.create({
    title,
    author,
    description,
    category,
    price,
    condition,
    available,
    image,
  });
  const io = req.app.get('io');
  io.emit('book:created', book);

  res.status(201).json(book);
}

// PUT /api/v1/books/:id  (admin) -> modifica un libro esistente
async function updateBook(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Prodotto non trovato.' });
  }

  const fields = ['title', 'author', 'description', 'category', 'price', 'condition', 'available', 'image'];
  for (const f of fields) {
    if (req.body[f] !== undefined) book[f] = req.body[f];
  }
  await book.save();

  // Notifica in tempo reale: la disponibilità potrebbe cambiare quindi available passa a false.
  const io = req.app.get('io');
  io.emit('book:update', book);

  res.json(book);
}

// DELETE /api/v1/books/:id  (admin) -> elimina un libro
async function deleteBook(req, res) {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Libro non trovato.' });
  }
  res.json({ message: 'Libro eliminato.' });
}

module.exports = 
{ 
  listBooks, 
  getBook, 
  createBook, 
  updateBook, 
  deleteBook 
};
