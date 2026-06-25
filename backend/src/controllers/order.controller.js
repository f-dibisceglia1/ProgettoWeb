// Controller degli ordini.
// - Il cliente crea un ordine (checkout del carrello) e vede i propri ordini.
// - L'admin vede tutti gli ordini e ne aggiorna lo stato.
//
// Alla creazione di un ordine:
//  1. verifichiamo la disponibilita' di magazzino di ogni prodotto;
//  2. scaliamo lo stock;
//  3. emettiamo "stock:update" (catalogo aggiornato per tutti)
//     e "order:new" (notifica all'admin) via Socket.IO.
const Product = require('../models/Product.js');
const Order = require('../models/Order.js');

// POST /api/orders  (cliente) -> crea un ordine a partire dal carrello.
// Il corpo atteso e': { items: [{ productId, size, quantity }], shippingAddress }
async function createOrder(req, res) {
  const { items, shippingAddress } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Il carrello e vuoto.' });
  }

  // Costruiamo le righe d'ordine leggendo i prodotti REALI dal database:
  // non ci fidiamo dei prezzi inviati dal client.
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Prodotto ${item.productId} non trovato.` });
    }
    const quantity = Number(item.quantity) || 0;
    if (quantity < 1) {
      return res.status(400).json({ message: `Quantita non valida per ${product.name}.` });
    }
    if (product.stock < quantity) {
      return res.status(409).json({
        message: `Disponibilita insufficiente per ${product.name} (rimasti ${product.stock}).`,
      });
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      size: item.size || '',
      quantity,
    });
    total += product.price * quantity;
  }

  // Scaliamo lo stock di ogni prodotto e raccogliamo gli aggiornamenti.
  const stockUpdates = [];
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.stock -= item.quantity;
    await product.save();
    stockUpdates.push({ productId: product._id.toString(), stock: product.stock });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    total,
    shippingAddress: shippingAddress || req.user.address,
  });

  // Eventi real-time.
  const io = req.app.get('io');
  stockUpdates.forEach((u) => io.emit('stock:update', u));
  // Notifica ai soli amministratori connessi (stanza "admin").
  io.to('admin').emit('order:new', {
    orderId: order._id.toString(),
    total: order.total,
    customer: req.user.name,
  });

  res.status(201).json(order);
}

// GET /api/orders/mine  (cliente) -> gli ordini dell'utente loggato
async function myOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}

// GET /api/orders  (admin) -> tutti gli ordini
async function listOrders(req, res) {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
}

// PUT /api/orders/:id/status  (admin) -> aggiorna lo stato di un ordine
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