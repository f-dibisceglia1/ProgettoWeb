// Logica Socket.IO (comunicazione real-time bidirezionale tra server e client).
//
// Socket.IO usa i WebSocket (con fallback automatico) per inviare messaggi in
// tempo reale. Qui gestiamo:
//  - l'autenticazione del socket leggendo il cookie di sessione presente
//    nell'handshake (lo stesso cookie JWT httpOnly usato dalle API);
//  - l'ingresso degli amministratori nella "stanza" (room) "admin", cosi' da
//    inviare loro le notifiche dei nuovi ordini in modo mirato.
//
// Nota: il token e' in un cookie httpOnly, quindi il JavaScript del browser
// NON puo' leggerlo per inviarlo. Lo recuperiamo lato server dall'handshake.
const jwt = require('jsonwebtoken');
const { parse:parseCookie } = require('cookie');

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log('[socket] client connesso:', socket.id);

    // Proviamo a identificare l'utente dal cookie inviato durante l'handshake.
    try {
      const rawCookie = socket.handshake.headers.cookie || '';
      const { token } = parseCookie(rawCookie);
      if (token) {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Gli admin entrano nella room "admin": riceveranno gli eventi
        // "order:new" emessi alla creazione di ogni ordine.
        if (payload.role === 'admin') {
          socket.join('admin');
          console.log('[socket] admin nella room:', socket.id);
        }
      }
    } catch {
      // Nessun token valido: il socket resta un semplice client anonimo,
      // che comunque ricevera' gli eventi pubblici come "stock:update".
    }

    socket.on('disconnect', () => {
      console.log('[socket] client disconnesso:', socket.id);
    });
  });
}

module.exports = { registerSocketHandlers };
