// Modello "Book": un libro usato in vendita.
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    // Prezzo in euro
    price: { type: Number, required: true, min: 0 },
    // Condizione della copia usata
    condition: {
      type: String,
      enum: ['come nuovo', 'ottimo', 'buono', 'accettabile', 'scadente'],
      required: true,
    },
    available: { type: Boolean, default: true },
    // URL dell'immagine del libro
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

bookSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Book', bookSchema);
