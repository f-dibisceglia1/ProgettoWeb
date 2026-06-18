const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  mittente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Collega il messaggio all'utente che lo ha spedito
    required: true
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Collega il messaggio all'utente che lo deve ricevere
    required: true
  },
  annuncio: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item' // Opzionale: serve a capire per quale libro o appunto si stanno cianciando
  },
  testo: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Questo ci dà gratis il campo "createdAt", ovvero l'orario esatto del messaggio!

module.exports = mongoose.model('Message', messageSchema);