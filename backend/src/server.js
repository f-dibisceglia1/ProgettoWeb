// Punto di ingresso del backend.
// Qui mettiamo insieme tutti i pezzi: Express (API REST), il server HTTP,
// Socket.IO (real-time), la connessione al database e Swagger.
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './config/db.js';
import { swaggerSpec } from './swagger.js';
import { registerSocketHandlers } from './sockets/index.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// Percorso pubblico ("/" in sviluppo, "/nexumshop" in produzione).
const PUBLIC_PATH = (process.env.PUBLIC_PATH || '/').replace(/\/$/, ''); // senza slash finale

const app = express();

// --- Middleware globali ---------------------------------------------------
// CORS: in sviluppo frontend (5173) e backend (4000) sono "origini" diverse;
// credentials:true permette l'invio del cookie di sessione.
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json()); // parse del corpo JSON delle richieste
app.use(cookieParser()); // popola req.cookies

// --- Server HTTP + Socket.IO ----------------------------------------------
// Socket.IO ha bisogno del server HTTP "grezzo", non solo dell'app Express.
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: CLIENT_ORIGIN, credentials: true },
  // Sotto una sottocartella il path deve includere il prefisso pubblico.
  path: `${PUBLIC_PATH}/socket.io`,
});
registerSocketHandlers(io);
// Rendiamo io accessibile ai controller tramite req.app.get('io').
app.set('io', io);

// --- Rotte API ------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Documentazione Swagger interattiva.
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint di "salute" per verificare che il server risponda.
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// --- Gestione errori centralizzata ---------------------------------------
// Se un controller (async) lancia un'eccezione, Express la passa qui.
// Nota: con Express 5 le funzioni async sono gestite automaticamente.
app.use((err, req, res, next) => {
  console.error('[errore]', err.message);
  res.status(500).json({ message: 'Errore interno del server.' });
});

// --- Avvio ----------------------------------------------------------------
async function start() {
  await connectDB(process.env.MONGODB_URI);
  server.listen(PORT, () => {
    console.log(`[server] in ascolto su http://localhost:${PORT}`);
    console.log(`[server] Swagger su http://localhost:${PORT}/api/docs`);
  });
}

start().catch((err) => {
  console.error('Avvio fallito:', err.message);
  process.exit(1);
});
