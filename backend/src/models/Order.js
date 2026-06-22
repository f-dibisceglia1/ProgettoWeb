// Modello "Order": un ordine effettuato da un cliente.
// Ogni ordine contiene una "fotografia" dei prodotti acquistati (nome, prezzo,
// taglia, quantita') cosi' che resti coerente anche se il prodotto cambia in
// futuro.
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['in elaborazione', 'spedito', 'consegnato', 'annullato'],
      default: 'in elaborazione',
    },
    shippingAddress: {
      street: String,
      city: String,
      zip: String,
    },
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Order', orderSchema);
