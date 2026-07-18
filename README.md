#UniShelf — Libreria online di libri universitari usati

Progetto realizzato per l'esame di Fondamenti del Web (Politecnico di Bari, A.A. 2025/2026).
UniShelf è SPA (Single Page Application) che permette agli studenti di acquistare libri universitari usati. 
Gli utenti possono sfogliare il catalogo, cercare e filtrare per categoria, aggiungere libri al carrello ed effettuare ordini. 
L'amministratore gestisce il catalogo (aggiunta, modifica, rimozione dei libri) e lo stato degli ordini da una dashboard dedicata.

##Stack Tecnologico 
| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React + React Router | Interfaccia utente (SPA) |
| | Vite | Build tool e dev server |
| **Backend** | Node.js + Express 5 | Server e API REST |
| | Mongoose | ODM per MongoDB |
| | jsonwebtoken | Creazione/verifica dei token JWT |
| | bcryptjs | Password hashing |
| | Socket.IO | Comunicazione in tempo reale |
| | swagger-jsdoc + swagger-ui-express | Documentazione API interattiva |
| **Database** | MongoDB | Persistenza dei dati (NoSQL) |
