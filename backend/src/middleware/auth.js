// Middleware di autenticazione e autorizzazione.
//
// Un "middleware" in Express e' una funzione (req, res, next) che si frappone
// tra la richiesta in arrivo e il gestore finale della rotta. Puo' leggere o
// modificare req/res, bloccare la richiesta, oppure passare il controllo al
// middleware successivo chiamando next().
const jwt = require('jsonwebtoken'); 
const User = require('../models/User.js');

// Verifica che la richiesta provenga da un utente autenticato.
async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Non autenticato: token mancante.' });
    }

    // jwt.verify lancia un'eccezione se il token e' scaduto o manomesso.
    // se lo è l'errore è catturato dal catch
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Utente non piu esistente.' });
    }

    // Alleghiamo l'utente alla richiesta: i middleware/route successivi lo useranno.
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
}

// Da usare DOPO requireAuth: consente l'accesso solo agli amministratori.
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accesso riservato agli amministratori.' });
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
}