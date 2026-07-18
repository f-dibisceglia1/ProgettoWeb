#UniShelf — Libreria online di libri universitari usati

Progetto realizzato per l'esame di Fondamenti del Web (Politecnico di Bari, A.A. 2025/2026).
UniShelf è SPA (Single Page Application) che permette agli studenti di acquistare libri universitari usati. 
Gli utenti possono sfogliare il catalogo, cercare e filtrare per categoria, aggiungere libri al carrello ed effettuare ordini. 
L'amministratore gestisce il catalogo (aggiunta, modifica, rimozione dei libri) e lo stato degli ordini da una dashboard dedicata.

##1. Stack Tecnologico 
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

##2. Struttura del progetto
```
unishelf/
├── backend/                     # API REST (Node.js + Express)
│   ├── src/
│   │   ├── server.js            # Entry point: middleware, rotte, avvio server
│   │   ├── swagger.js           # Specifica OpenAPI per Swagger UI
│   │   ├── seed.js              # Popola il database con dati di prova
│   │   ├── config/
│   │   │   └── db.js            # Connessione a MongoDB
│   │   ├── sockets/
│   │   │   └── index.js         # Gestione eventi Socket.IO
│   │   ├── models/              # Schemi Mongoose
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   └── Order.js
│   │   ├── controllers/         # Controller
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   └── order.controller.js
│   │   ├── routes/               # Definizione degli endpoint delle api
│   │   │   ├── auth.routes.js
│   │   │   ├── book.routes.js
│   │   │   └── order.routes.js
│   │   └── middleware/
│   │       └── auth.js          # Verifica del token JWT
│   ├── test/
│   │   └── integration.mjs      # Test end-to-end automatici
│   ├── package.json
│
└── frontend/                    # SPA (React + Vite)
    ├── src/
    │   ├── App.jsx               # Routing e layout principale
    │   ├── index.jsx             # Entry point React 
    │   ├── App.css
    │   ├── context/
    │   │   └── AuthContext.jsx   # Stato globale di autenticazione
    │   ├── services/
    │   │   └── api.js            # Richieste HTTP verso il backend
    │   ├── utils/
    │   │   └── cart.js           # Gestione carrello in localStorage
    │   ├── pages/                # Pagine (HomePage, LoginPage, BookDetailPage, CartPage, ProfilePage, DashboardPage)
    │   └── components/           # Componenti riusabili (Header, Menu, BookCard, FilterBar)
    └── package.json
```
##3. Variabili d'ambiente

Nella cartella backend/, creare un file .env

| Variabile | Descrizione | Esempio |
|---|---|---|
| PORT | Porta su cui ascolta il backend | 4000 |
| MONGODB_URI | Stringa di connessione a MongoDB Atlas | mongodb+srv://utente:password@cluster.mongodb.net/unishelf |
| JWT_SECRET | Chiave segreta per firmare i token JWT | una stringa lunga e casuale |
| JWT_EXPIRES_IN | Durata del token di sessione | 1h |
| CLIENT_ORIGIN | Origine consentita per il frontend (CORS) | [4000](http://localhost:5173) |
| PUBLIC_PATH | Percorso pubblico dell'app (per deploy sotto sottocartella) | / |
| NODE_ENV | Ambiente di esecuzione | development |
| ADMIN_EMAIL | Email dell'amministratore creato dal seed | admin@unishelf.it |
| ADMIN_PASSWORD | Password dell'amministratore creato dal seed | una password sicura |

