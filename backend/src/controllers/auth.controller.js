// Controller dell'autenticazione: registrazione, login, logout, profilo.
//
// Strategia di sessione (come richiesto dalla traccia: "token" + "cookie"):
//  1. Alla registrazione/login firmiamo un token JWT che contiene id e ruolo.
//  2. Inviamo il token al browser dentro un cookie httpOnly: il JavaScript del
//     frontend NON puo' leggerlo (protezione contro attacchi XSS).
//  3. Ad ogni richiesta successiva il browser invia automaticamente il cookie;
//     il middleware requireAuth lo verifica.
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Crea il token JWT a partire dall'utente.
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Imposta il cookie httpOnly con il token.
function setTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true, // non accessibile da document.cookie -> anti-XSS
    sameSite: 'lax', // mitigazione CSRF per richieste cross-site
    secure: isProd, // in produzione il cookie viaggia solo su HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni in millisecondi
  });
}

// POST /api/auth/register
export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e password sono obbligatori.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La password deve avere almeno 6 caratteri.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'Esiste gia un account con questa email.' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, passwordHash });

  const token = signToken(user);
  setTokenCookie(res, token);

  // Restituiamo anche il token nel corpo: utile per client che non usano cookie.
  res.status(201).json({ user, token });
}

// POST /api/auth/login
export async function login(req, res) {
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
  res.json({ user, token });
}

// POST /api/auth/logout
export async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout effettuato.' });
}

// GET /api/auth/me  (rotta protetta)
// Restituisce l'utente attualmente autenticato: il frontend la usa all'avvio
// per capire se esiste gia' una sessione valida.
export async function me(req, res) {
  res.json({ user: req.user });
}

// PUT /api/auth/profile  (rotta protetta)
// Aggiorna nome e indirizzo dell'utente loggato.
export async function updateProfile(req, res) {
  const { name, address } = req.body;
  if (name) req.user.name = name;
  if (address) req.user.address = address;
  await req.user.save();
  res.json({ user: req.user });
}
