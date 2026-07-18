// Punto di ingresso del backend.
// Qui abbiamo: Express (API REST), il server HTTP,
// Socket.IO (real-time), la connessione al database e Swagger.
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server:SocketIOServer } = require('socket.io');
const swaggerUi = require('swagger-ui-express');

const { connectDB } = require('./config/db.js');
const { swaggerSpec } = require('./swagger.js');
const { registerSocketHandlers } = require('./sockets/index.js');
const authRoutes = require('./routes/auth.routes.js');
const bookRoutes = require('./routes/book.routes.js');
const orderRoutes = require('./routes/order.routes.js');

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// Percorso pubblico ("/" in sviluppo, "/unishelf" in produzione).
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
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/orders', orderRoutes);

// Documentazione Swagger 
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint di "salute" per verificare che il server risponda.
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok' }));

// --- Gestione errori centralizzata ---------------------------------------
// Se un controller (async) lancia un'eccezione, Express la passa qui.
app.use((err, req, res, next) => {
  console.error('[errore]', err.message);
  res.status(500).json({ message: 'Errore interno del server.' });
});

// --- Avvio ----------------------------------------------------------------
async function start() {
  await connectDB(process.env.MONGODB_URI);
  server.listen(PORT, () => {
    console.log(`[server] in ascolto su http://localhost:${PORT}`);
    console.log(`[server] Swagger su http://localhost:${PORT}/api/v1/docs`);
  });
}

start().catch((err) => {
  console.error('Avvio fallito:', err.message);
  process.exit(1);
});
