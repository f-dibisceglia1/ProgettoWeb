// Connessione a MongoDB Atlas tramite Mongoose.
// Mongoose e' un ODM (Object Data Modeling): ci permette di lavorare con i
// documenti MongoDB come se fossero oggetti JavaScript, definendo degli schemi.
import mongoose from 'mongoose';

export async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      'MONGODB_URI non impostata. Compila il file .env con la connection string di Atlas.'
    );
  }

  // Con strictQuery a true, Mongoose ignora i campi non dichiarati nello schema
  // durante le query: comportamento prevedibile e "scolastico".
  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log('[DB] Connesso a MongoDB');
}
