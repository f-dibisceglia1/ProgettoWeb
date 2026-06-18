require('dotenv').config(); // Legge la password nel file .env
const express = require('express');
const mongoose = require('mongoose');

// 1. Nuove importazioni per far funzionare Socket.io
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 5000;

// 2. Creiamo il server HTTP avvolgendo l'app Express
const server = http.createServer(app);

// 3. Inizializziamo Socket.io su questo server (aggiungiamo i CORS per Federica)
const io = new Server(server, {
  cors: {
    origin: "*", // Per ora accettiamo connessioni da ovunque
    methods: ["GET", "POST"]
  }
});

// 4. La logica della tua Chat Real-time!
io.on('connection', (socket) => {
  console.log(`⚡ Un utente si è connesso ai WebSockets. ID: ${socket.id}`);

  // Qui poi aggiungeremo gli eventi per i messaggi
// Quando il server riceve un messaggio da un utente (frontend)
  socket.on('invia_messaggio', (datiMessaggio) => {
    console.log("📨 Nuovo messaggio in transito:", datiMessaggio);
    
    // Il server fa da postino e inoltra il messaggio a tutti gli altri utenti
    socket.broadcast.emit('ricevi_messaggio', datiMessaggio);
  });


  socket.on('disconnect', () => {
    console.log(`❌ Utente disconnesso. ID: ${socket.id}`);
  });
});

// Test di Connessione al Database
console.log("Tentativo di connessione al Cloud in corso...");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 FANTASTICO! Connesso con successo al database MongoDB Atlas (Univinted)!");
    
    // Rotta API di test (che poi toccherà a Roberto gestire)
    app.get('/', (req, res) => {
      res.send("🚀 Benvenuto nel Backend di Univinted! Il motore è acceso e funzionante.");
    });

    // 5. IMPORTANTE: Accendiamo il 'server' (che contiene sia Express che Socket.io)
    server.listen(PORT, () => {
      console.log(`🚀 Server Node.js (con Socket.io abilitato) in ascolto sulla porta ${PORT}`);
    });
  })
  .catch((errore) => {
    console.error("❌ Errore critico di connessione al database:", errore);
  });