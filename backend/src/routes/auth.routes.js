import { Router } from 'express';
import {
  register,
  login,
  logout,
  me,
  updateProfile,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Registrazione, login e gestione della sessione
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra un nuovo utente (ruolo cliente)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Mario Rossi }
 *               email: { type: string, example: mario@example.com }
 *               password: { type: string, example: segreta123 }
 *     responses:
 *       201: { description: Utente creato e sessione avviata }
 *       409: { description: Email gia registrata }
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Effettua il login e imposta il cookie di sessione
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: admin@nexumshop.it }
 *               password: { type: string, example: Admin#2026! }
 *     responses:
 *       200: { description: Login riuscito }
 *       401: { description: Credenziali non valide }
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Effettua il logout (cancella il cookie di sessione)
 *     responses:
 *       200: { description: Logout effettuato }
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Restituisce l'utente attualmente autenticato
 *     responses:
 *       200: { description: Dati dell'utente loggato }
 *       401: { description: Non autenticato }
 */
router.get('/me', requireAuth, me);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     tags: [Auth]
 *     summary: Aggiorna nome e indirizzo dell'utente loggato
 *     responses:
 *       200: { description: Profilo aggiornato }
 *       401: { description: Non autenticato }
 */
router.put('/profile', requireAuth, updateProfile);

export default router;
