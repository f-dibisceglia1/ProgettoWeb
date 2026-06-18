const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true // Rimuove gli spazi vuoti all'inizio e alla fine
  },
  cognome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Fondamentale: non possono esistere due utenti con la stessa email
    lowercase: true
  },
  password: {
    type: String,
    required: true
    // Nota per l'esame: la password qui è una stringa, criptarla (hash) prima di salvarla!
  },
  ruolo: {
    type: String,
    enum: ['studente', 'admin'], // Solo questi due valori sono permessi
    default: 'studente'
  },
  saldoWallet: {
    type: Number,
    default: 0.0 // Tutti iniziano con 0 euro nel portafoglio virtuale
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);