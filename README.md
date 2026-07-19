# **UniShelf — Libreria online di libri universitari usati**

Progetto realizzato per l'esame di **Fondamenti del Web** del Corso di Laurea in Ingegneria Informatica e dell'Automazione presso il Politecnico di Bari, A.A. 2025/2026.

**UniShelf** è una SPA (*Single Page Application*) che permette agli studenti di acquistare libri universitari usati.

Gli utenti possono:

- consultare il catalogo;
- cercare libri per titolo o autore;
- filtrare i libri per categoria;
- visualizzare i dettagli di un libro;
- aggiungere libri al carrello;
- effettuare ordini;
- consultare lo storico dei propri ordini.

L'amministratore dispone di una dashboard dedicata attraverso la quale può:

- aggiungere nuovi libri;
- modificare i libri presenti nel catalogo;
- eliminare libri;
- visualizzare gli ordini effettuati dagli utenti;
- aggiornare lo stato degli ordini.

---

## **1. Applicazione online**

L'applicazione è stata pubblicata sulla piattaforma **Render** ed è accessibile tramite i seguenti indirizzi.

| Servizio | URL | Descrizione |
|---|---|---|
| **Applicazione web** | [https://unishelf-fronted.onrender.com/](https://unishelf-fronted.onrender.com/) | Interfaccia React utilizzata dagli utenti e dagli amministratori |
| **Backend** | [https://unishelf-backend.onrender.com/](https://unishelf-backend.onrender.com/) | Server Node.js ed Express che espone le API REST |
| **Swagger UI** | [https://unishelf-backend.onrender.com/api/v1/docs/](https://unishelf-backend.onrender.com/api/v1/docs/) | Documentazione interattiva delle API |
| **Health check** | [https://unishelf-backend.onrender.com/api/v1/health](https://unishelf-backend.onrender.com/api/v1/health) | Endpoint utilizzato per verificare che il backend sia attivo |

### **Come accedere al sito**

Per utilizzare l'applicazione è necessario aprire il seguente indirizzo:

[https://unishelf-fronted.onrender.com/](https://unishelf-fronted.onrender.com/)

Dalla pagina principale è possibile consultare il catalogo dei libri anche senza autenticazione.

Per aggiungere prodotti al carrello, effettuare ordini e visualizzare il proprio profilo è possibile registrare un nuovo account oppure utilizzare le credenziali di prova riportate nella sezione dedicata.

Per accedere alle funzionalità di gestione del catalogo e degli ordini è necessario effettuare il login con l'account amministratore.

> Il link del backend è un indirizzo tecnico utilizzato dal frontend per comunicare con le API e non rappresenta l'interfaccia grafica dell'applicazione.

---

## **2. Stack tecnologico**

| Layer | Tecnologia | Ruolo |
|---|---|---|
| **Frontend** | React | Realizzazione dell'interfaccia utente |
| | React Router | Navigazione client-side tra le pagine |
| | Vite | Build tool e server di sviluppo |
| **Backend** | Node.js | Ambiente di esecuzione JavaScript lato server |
| | Express 5 | Server HTTP e API REST |
| | Mongoose | ODM per l'interazione con MongoDB |
| | jsonwebtoken | Creazione e verifica dei token JWT |
| | bcryptjs | Hashing sicuro delle password |
| | Socket.IO | Comunicazione e aggiornamenti in tempo reale |
| | swagger-jsdoc | Generazione della specifica OpenAPI |
| | swagger-ui-express | Interfaccia grafica della documentazione API |
| **Database** | MongoDB Atlas | Persistenza cloud dei dati NoSQL |
| **Deployment** | Render | Pubblicazione separata di frontend e backend |

---

## **3. Struttura del progetto**

```text
ProgettoWeb/
├── .gitignore                   # File e cartelle esclusi dal repository
├── README.md                    # Documentazione principale del progetto
│
├── backend/                     # API REST realizzate con Node.js ed Express
│   ├── src/
│   │   ├── server.js            # Entry point, middleware, rotte e avvio server
│   │   ├── swagger.js           # Configurazione OpenAPI e Swagger
│   │   ├── seed.js              # Popolamento del database con dati di prova
│   │   │
│   │   ├── config/
│   │   │   └── db.js            # Connessione a MongoDB Atlas
│   │   │
│   │   ├── sockets/
│   │   │   └── index.js         # Gestione degli eventi Socket.IO
│   │   │
│   │   ├── models/              # Schemi Mongoose
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   └── Order.js
│   │   │
│   │   ├── controllers/         # Logica applicativa
│   │   │   ├── auth.controller.js
│   │   │   ├── book.controller.js
│   │   │   └── order.controller.js
│   │   │
│   │   ├── routes/              # Definizione degli endpoint API
│   │   │   ├── auth.routes.js
│   │   │   ├── book.routes.js
│   │   │   └── order.routes.js
│   │   │
│   │   └── middleware/
│   │       └── auth.js          # Autenticazione e autorizzazione
│   │
│   ├── test/
│   │   └── integration.mjs      # Test di integrazione end-to-end
│   │
│   └── package.json
│
└── frontend/                    # SPA realizzata con React e Vite
    ├── public/                   # Risorse statiche
    │
    ├── src/
    │   ├── App.jsx              # Routing e layout principale
    │   ├── index.jsx            # Entry point React
    │   ├── App.css              # Stili principali
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx  # Stato globale di autenticazione
    │   │
    │   ├── services/
    │   │   └── api.js           # Comunicazione HTTP con il backend
    │   │
    │   ├── utils/
    │   │   └── cart.js          # Gestione del carrello in localStorage
    │   │
    │   ├── pages/               # Pagine principali dell'applicazione
    │   └── components/          # Componenti React riutilizzabili
    │
    └── package.json
```

---

## **4. Variabili d'ambiente**

Le variabili d'ambiente non vengono salvate nel repository perché il file `.env` è escluso tramite `.gitignore`.

### **Backend**

Nella cartella `backend/` creare un file denominato `.env`:

```env
PORT=4000
MONGODB_URI=mongodb+srv://utente:password@cluster.mongodb.net/unishelf
JWT_SECRET=una_chiave_segreta_lunga_e_casuale
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
PUBLIC_PATH=/
NODE_ENV=development
ADMIN_EMAIL=admin@unishelf.it
ADMIN_PASSWORD=una_password_sicura
```

| Variabile | Descrizione | Esempio |
|---|---|---|
| `PORT` | Porta sulla quale viene avviato il backend | `4000` |
| `MONGODB_URI` | Stringa di connessione a MongoDB Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Chiave utilizzata per firmare i token JWT | Stringa lunga e casuale |
| `JWT_EXPIRES_IN` | Durata del token di autenticazione | `1h` |
| `CLIENT_ORIGIN` | Origine frontend autorizzata tramite CORS | `http://localhost:5173` |
| `PUBLIC_PATH` | Prefisso pubblico dell'applicazione | `/` |
| `NODE_ENV` | Ambiente di esecuzione | `development` |
| `ADMIN_EMAIL` | Email dell'amministratore creato dal seed | `admin@unishelf.it` |
| `ADMIN_PASSWORD` | Password dell'amministratore creato dal seed | Password sicura |

### **Frontend**

Nella cartella `frontend/` è possibile creare un file `.env`:

```env
VITE_API_URL=http://localhost:4000/api/v1
```

La variabile `VITE_API_URL` indica l'indirizzo base utilizzato dal frontend per effettuare le richieste alle API.

Nell'ambiente di produzione il valore utilizzato è:

```env
VITE_API_URL=https://unishelf-backend.onrender.com/api/v1
```

---

## **5. Avvio del backend in locale**

Aprire il terminale nella cartella principale del progetto ed eseguire:

```bash
cd backend
npm install
```

Successivamente, assicurarsi di aver configurato il file `.env` e avviare il server:

```bash
npm run dev
```

Il backend sarà disponibile all'indirizzo:

```text
http://localhost:4000
```

### **Script disponibili**

| Comando | Descrizione |
|---|---|
| `npm start` | Avvia il server con `node src/server.js` |
| `npm run dev` | Avvia il server in modalità sviluppo con riavvio automatico |
| `npm run seed` | Svuota e ripopola il database con utenti e libri di prova |
| `npm test` | Esegue i test di integrazione end-to-end |

> Attenzione: il comando `npm run seed` elimina i dati presenti nelle collezioni interessate e inserisce nuovamente i dati di prova.

---

## **6. Avvio del frontend in locale**

Aprire un secondo terminale ed eseguire:

```bash
cd frontend
npm install
npm run dev
```

Il frontend sarà disponibile all'indirizzo:

```text
http://localhost:5173
```

### **Script disponibili**

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo Vite |
| `npm start` | Avvia il server di sviluppo come `npm run dev` |
| `npm run build` | Compila la SPA per la produzione nella cartella `dist/` |
| `npm run preview` | Mostra in locale un'anteprima della build di produzione |

Per utilizzare correttamente l'applicazione in locale è necessario mantenere contemporaneamente attivi sia il backend sia il frontend.

---

## **7. Credenziali per l'accesso**

Sono disponibili due account di prova.

### **Utente cliente**

```text
Email: cliente@unishelf.it
Password: Cliente#2026
```

L'utente cliente può:

- consultare il catalogo;
- utilizzare il carrello;
- effettuare ordini;
- modificare il proprio profilo;
- visualizzare lo storico degli ordini.

### **Utente amministratore**

```text
Email: admin@unishelf.it
Password: Admin#2026
```

L'amministratore può:

- accedere alla dashboard;
- aggiungere nuovi libri;
- modificare i libri;
- eliminare libri;
- visualizzare tutti gli ordini;
- aggiornare lo stato degli ordini.

---

## **8. Documentazione API con Swagger**

La documentazione delle API è stata realizzata tramite **Swagger UI** e specifica **OpenAPI**.

### **Ambiente locale**

Con il backend avviato, la documentazione è disponibile all'indirizzo:

[http://localhost:4000/api/v1/docs](http://localhost:4000/api/v1/docs)

### **Ambiente di produzione**

La documentazione online è disponibile all'indirizzo:

[https://unishelf-backend.onrender.com/api/v1/docs/](https://unishelf-backend.onrender.com/api/v1/docs/)

Swagger UI permette di:

- consultare tutti gli endpoint disponibili;
- visualizzare i metodi HTTP utilizzati;
- conoscere i parametri richiesti;
- consultare la struttura dei body JSON;
- visualizzare i possibili codici di risposta;
- eseguire richieste di prova direttamente dal browser.

Le API sono organizzate nelle seguenti categorie:

- autenticazione e gestione del profilo;
- gestione dei libri;
- gestione degli ordini.

---

## **9. Deployment su Render**

Il deployment dell'applicazione è stato realizzato tramite **Render**, separando il frontend dal backend.

### **Frontend**

Il frontend React è pubblicato come servizio web separato:

[https://unishelf-fronted.onrender.com/](https://unishelf-fronted.onrender.com/)

Durante il deployment, Render esegue la build di produzione dell'applicazione React tramite Vite.

Il frontend utilizza la variabile:

```env
VITE_API_URL=https://unishelf-backend.onrender.com/api/v1
```

per comunicare con il backend.

### **Backend**

Il backend Node.js ed Express è pubblicato al seguente indirizzo:

[https://unishelf-backend.onrender.com/](https://unishelf-backend.onrender.com/)

Il server espone le API utilizzando il prefisso:

```text
/api/v1
```

Esempio di endpoint:

```text
https://unishelf-backend.onrender.com/api/v1/books
```

Il backend utilizza MongoDB Atlas per la persistenza dei dati e accetta richieste provenienti dal frontend pubblicato su Render.

Tra le principali variabili d'ambiente configurate sul servizio backend sono presenti:

```env
CLIENT_ORIGIN=https://unishelf-fronted.onrender.com
PUBLIC_PATH=/
NODE_ENV=production
```

Le variabili sensibili, come `MONGODB_URI`, `JWT_SECRET` e `ADMIN_PASSWORD`, sono configurate direttamente nell'ambiente Render e non vengono pubblicate nel repository.

### **Verifica dello stato del backend**

Per controllare che il server sia online è disponibile il seguente endpoint:

[https://unishelf-backend.onrender.com/api/v1/health](https://unishelf-backend.onrender.com/api/v1/health)

Una risposta corretta restituisce un oggetto JSON simile al seguente:

```json
{
  "status": "ok"
}
```

---

## **10. Architettura dell'applicazione**

UniShelf utilizza un'architettura client-server composta da tre livelli principali:

1. Il **frontend React** gestisce l'interfaccia grafica e l'interazione con l'utente.
2. Il **backend Node.js ed Express** espone le API REST, gestisce l'autenticazione e applica la logica di business.
3. **MongoDB Atlas** memorizza utenti, libri e ordini.

Il frontend comunica con il backend attraverso richieste HTTP in formato JSON.

L'autenticazione viene gestita mediante token JWT salvati in cookie e inviati automaticamente nelle richieste tramite l'opzione:

```js
credentials: "include"
```

Le password degli utenti non vengono memorizzate in chiaro, ma vengono sottoposte ad hashing tramite `bcryptjs`.

Socket.IO viene utilizzato per gli aggiornamenti in tempo reale tra server e client.

---

## **11. Autori**

Progetto realizzato per l'esame di **Fondamenti del Web**, A.A. 2025/2026.
