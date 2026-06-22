// Modello "Product": un capo di abbigliamento in vendita.
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    // Categoria merceologica (es. "Magliette", "Pantaloni", "Scarpe")
    category: { type: String, required: true, trim: true },
    // Prezzo in euro
    price: { type: Number, required: true, min: 0 },
    // Taglie disponibili (es. ["S", "M", "L"])
    sizes: { type: [String], default: [] },
    // Disponibilita' totale di magazzino. Quando un ordine viene confermato,
    // questo valore viene decrementato e l'aggiornamento e' notificato in
    // tempo reale a tutti i client tramite Socket.IO.
    stock: { type: Number, required: true, min: 0, default: 0 },
    // URL dell'immagine del prodotto
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model('Product', productSchema);
