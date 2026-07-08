// Controller degli ordini.
// - Il cliente crea un ordine (checkout del carrello) e vede i propri ordini.
// - L'admin vede tutti gli ordini e ne aggiorna lo stato.
//
// Alla creazione di un ordine:
//  1. verifichiamo la disponibilita' di ogni libro;
//  2. lo marchiamo come venduto (available: false);
//  3. emettiamo "book:update" (catalogo aggiornato per tutti)
//     e "order:new" (notifica all'admin) via Socket.IO.
const Book = require('../models/Book.js');
const Order = require('../models/Order.js');

// POST /api/v1/orders  (cliente) -> crea un ordine a partire dal carrello.
// Il corpo atteso e': { items: [{ booksId }], shippingAddress }
async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Il carrello è vuoto.' });
  }

  // Costruiamo le righe d'ordine leggendo i libri REALI dal database:
  // non ci fidiamo dei prezzi inviati dal client.
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const book = await Book.findById(item.bookId);
    if (!book) {
      return res.status(404).json({ message: `Libro ${item.bookId} non trovato.` });
    }
    if (!book.available) {
      return res.status(409).json({
        message: `"${book.title}" non è più disponibile.`,
      });
    }

    orderItems.push({
      book: book._id,
      title: book.title,
      author: book.author,
      price: book.price,
    });
    total += book.price;
  }

 // Marchiamo ogni libro come venduto e raccogliamo gli aggiornamenti.
  const availabilityUpdates = [];
  for (const item of orderItems) {
    const book = await Book.findById(item.book);
    book.available = false;
    await book.save();
    availabilityUpdates.push({ bookId: book._id.toString(), available: book.available });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total,
    shippingAddress: shippingAddress || req.user.address,
  });

  // Eventi real-time.
  const io = req.app.get('io');
  availabilityUpdates.forEach((u) => io.emit('book:update', u));
  // Notifica ai soli amministratori connessi (stanza "admin").
  io.to('admin').emit('order:new', {
    orderId: order._id.toString(),
    total: order.total,
    customer: req.user.name,
  });

  res.status(201).json(order);
}

// GET /api/v1/orders/mine  (cliente) -> gli ordini dell'utente loggato
async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}

// GET /api/v1/orders  (admin) -> tutti gli ordini
async function listOrders(req, res) {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
}

// PUT /api/v1/orders/:id/status  (admin) -> aggiorna lo stato di un ordine
async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Ordine non trovato.' });
  }
  order.status = status;
  await order.save();
  res.json(order);
}

module.exports = 
{ 
  createOrder, 
  myOrders, 
  listOrders, 
  updateOrderStatus 
};