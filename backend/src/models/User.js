// Modello "User": rappresenta un utente registrato.
// Un utente puo' avere ruolo "customer" (cliente) oppure "admin".
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // due utenti non possono avere la stessa email
      lowercase: true,
      trim: true,
    },
    // Salviamo SEMPRE l'hash della password, mai la password in chiaro.
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    // Indirizzo di spedizione (facoltativo, usato in fase di checkout)
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
  },
  { timestamps: true } // aggiunge createdAt e updatedAt automaticamente
);

// Metodo d'istanza: confronta una password in chiaro con l'hash salvato.
userSchema.methods.checkPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Metodo statico: crea l'hash di una password.
userSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 10); // 10 = "cost factor" del salt
};

// Quando convertiamo il documento in JSON (es. per la risposta HTTP),
// rimuoviamo l'hash della password: non deve mai uscire dal server.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', userSchema);
