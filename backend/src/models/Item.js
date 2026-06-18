const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  titolo: {
    type: String,
    required: true,
    trim: true
  },
  descrizione: {
    type: String,
    required: true
  },
  prezzo: {
    type: Number,
    required: true,
    min: 0 // Il prezzo non può essere negativo
  },
  categoria: {
    type: String,
    enum: ['libro', 'appunti', 'ripetizioni', 'altro'],
    required: true
  },
  condizione: {
    type: String,
    enum: ['nuovo', 'ottimo', 'buono', 'usurato'],
    default: 'buono'
  },
  venditore: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Collegamento (reference) all'utente che ha pubblicato l'annuncio
    required: true
  },
  immagineUrl: {
    type: String,
    // Non è required perché un utente potrebbe non mettere la foto, o potremmo usare un'immagine di default
    default: 'https://via.placeholder.com/150'
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);