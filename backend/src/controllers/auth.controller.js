// Controller dell'autenticazione: registrazione, login, logout, profilo.
//
// Strategia di sessione (come richiesto dalla traccia: "token" + "cookie"):
//  1. Alla registrazione/login firmiamo un token JWT che contiene id e ruolo.
//  2. Inviamo il token al browser dentro un cookie httpOnly: il JavaScript del
//     frontend NON puo' leggerlo (protezione contro attacchi XSS).
//  3. Ad ogni richiesta successiva il browser invia automaticamente il cookie;
//     il middleware requireAuth lo verifica.
const jwt = require('jsonwebtoken'); 
const User = require('../models/User.js');


// Crea il token JWT a partire dall'utente.
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Imposta il cookie httpOnly con il token.
function setTokenCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true, // non accessibile da document.cookie -> anti-XSS
    sameSite: 'strict', // mitigazione CSRF per richieste cross-site
    secure: true,
    path: '/', 
    maxAge: 60 * 60 * 1000, // 1 ora in millisecondi
  });
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password sono obbligatori.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'La password deve avere almeno 8 caratteri.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Esiste già un account con questa email.' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user);
  setTokenCookie(res, token);

  res.status(201).json({ user});
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatorie.' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Credenziali non valide.' });
  }

  const ok = await user.checkPassword(password);
  if (!ok) {
    return res.status(401).json({ message: 'Credenziali non valide.' });
  }

  const token = signToken(user);
  setTokenCookie(res, token);
  res.json({ user });
}

// POST /api/auth/logout
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout effettuato.' });
}

// GET /api/auth/me  (rotta protetta)
// Restituisce l'utente attualmente autenticato: il frontend la usa all'avvio
// per capire se esiste gia' una sessione valida.
async function me(req, res) {
  res.json({ user: req.user });
}

// PUT /api/auth/profile  (rotta protetta)
// Aggiorna nome e indirizzo dell'utente loggato.
async function updateProfile(req, res) {
  const { name, address } = req.body;
  if (name) req.user.name = name;
  if (address) req.user.address = address;
  await req.user.save();
  res.json({ user: req.user });
}

module.exports = {
  register, 
  login, 
  logout,
  me, 
  updateProfile
}