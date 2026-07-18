// Configurazione di Swagger (OpenAPI 3).
const swaggerJsdoc = require('swagger-jsdoc');

const PUBLIC_PATH = (process.env.PUBLIC_PATH || '/').replace(/\/$/, '');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniShelf API',
      version: '1.0.0',
      description:
        'API REST dell\'e-commerce UniShelf. Progetto per il corso ' +
        '"Fondamenti del Web" (Ingegneria Informatica e dell\'Automazione, Politecnico di Bari).',
    },
    servers: [
      { url: `${PUBLIC_PATH}/api/v1`, description: 'Base URL delle API' },
    ],
    tags: [
      { name: 'Auth', description: 'Registrazione, login e gestione della sessione' },
      { name: 'Books', description: 'Catalogo libri usati (lettura pubblica, scrittura admin)' },
      { name: 'Orders', description: 'Creazione e gestione degli ordini' },
    ],
    components: {
      securitySchemes: {
        // L'autenticazione avviene tramite cookie httpOnly "token".
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
            name: { type: 'string', example: 'Mario Rossi' },
            email: { type: 'string', format: 'email', example: 'mario@unishelf.it' },
            role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Via Roma 1' },
                city: { type: 'string', example: 'Bari' },
                zip: { type: 'string', example: '70100' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Mario Rossi' },
            email: { type: 'string', format: 'email', example: 'mario@unishelf.it' },
            password: { type: 'string', minLength: 8, example: 'segreta123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@unishelf.it' },
            password: { type: 'string', example: 'Admin#2026!' },
          },
        },
        UpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Mario Rossi' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Via Roma 1' },
                city: { type: 'string', example: 'Bari' },
                zip: { type: 'string', example: '70100' },
              },
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
            title: { type: 'string', example: 'Analisi Matematica 1' },
            author: { type: 'string', example: 'Marco Bramanti, Carlo Pagani, Sandro Salsa' },
            description: { type: 'string', example: 'Manuale di analisi 1, con esercizi svolti.' },
            category: { type: 'string', example: 'Ingegneria' },
            price: { type: 'number', example: 22 },
            condition: {
              type: 'string',
              enum: ['come nuovo', 'ottimo', 'buono', 'accettabile', 'scadente'],
              example: 'buono',
            },
            available: { type: 'boolean', example: true },
            image: { type: 'string', example: 'books/analisi-matematica-1.webp' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        BookRequest: {
          type: 'object',
          required: ['title', 'category', 'price'],
          properties: {
            title: { type: 'string', example: 'Analisi Matematica 1' },
            author: { type: 'string', example: 'Marco Bramanti, Carlo Pagani, Sandro Salsa' },
            description: { type: 'string', example: 'Manuale di analisi 1, con esercizi svolti.' },
            category: { type: 'string', example: 'Ingegneria' },
            price: { type: 'number', example: 22 },
            condition: {
              type: 'string',
              enum: ['come nuovo', 'ottimo', 'buono', 'accettabile', 'scadente'],
              example: 'buono',
            },
            available: { type: 'boolean', example: true },
            image: { type: 'string', example: 'books/analisi-matematica-1.webp' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            book: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
            title: { type: 'string', example: 'Analisi Matematica 1' },
            author: { type: 'string', example: 'Marco Bramanti' },
            price: { type: 'number', example: 22 },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
            user: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            total: { type: 'number', example: 22 },
            status: {
              type: 'string',
              enum: ['in elaborazione', 'spedito', 'consegnato', 'annullato'],
              example: 'in elaborazione',
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Via Roma 1' },
                city: { type: 'string', example: 'Bari' },
                zip: { type: 'string', example: '70100' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOrderRequest: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  bookId: { type: 'string', example: '665a1b2c3d4e5f6789012345' },
                },
              },
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: { type: 'string', example: 'Via Roma 1' },
                city: { type: 'string', example: 'Bari' },
                zip: { type: 'string', example: '70100' },
              },
            },
          },
        },
        UpdateOrderStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['in elaborazione', 'spedito', 'consegnato', 'annullato'],
              example: 'spedito',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Errore del server' },
          },
        },
      },
    },
    paths: {
      // ---------------------------------------------------------------- AUTH
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registra un nuovo utente (ruolo cliente)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Utente creato e sessione avviata',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            400: {
              description: 'Campi mancanti o password troppo corta',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            409: {
              description: 'Email gia registrata',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Effettua il login e imposta il cookie di sessione',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login riuscito',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            401: {
              description: 'Credenziali non valide',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Effettua il logout (cancella il cookie di sessione)',
          responses: {
            200: {
              description: 'Logout effettuato',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { message: { type: 'string', example: 'Logout effettuato.' } },
                  },
                },
              },
            },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: "Restituisce l'utente attualmente autenticato",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: "Dati dell'utente loggato",
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            401: {
              description: 'Non autenticato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/auth/profile': {
        put: {
          tags: ['Auth'],
          summary: "Aggiorna nome e indirizzo dell'utente loggato",
          security: [{ cookieAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Profilo aggiornato',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            401: {
              description: 'Non autenticato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      // --------------------------------------------------------------- BOOKS
      '/books': {
        get: {
          tags: ['Books'],
          summary: 'Elenco dei libri del catalogo',
          parameters: [
            {
              name: 'category',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filtra per categoria',
            },
            {
              name: 'q',
              in: 'query',
              schema: { type: 'string' },
              description: 'Ricerca testuale su titolo o autore',
            },
          ],
          responses: {
            200: {
              description: 'Lista dei libri',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } },
                },
              },
            },
          },
        },
        post: {
          tags: ['Books'],
          summary: 'Crea un nuovo libro (solo admin)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/BookRequest' } },
            },
          },
          responses: {
            201: {
              description: 'Libro creato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
            },
            400: {
              description: 'Campi obbligatori mancanti',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            403: {
              description: 'Riservato agli admin',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/books/{id}': {
        get: {
          tags: ['Books'],
          summary: 'Dettaglio di un singolo libro',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Dettaglio libro',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
            },
            404: {
              description: 'Libro non trovato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
        put: {
          tags: ['Books'],
          summary: 'Modifica un libro (solo admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/BookRequest' } },
            },
          },
          responses: {
            200: {
              description: 'Libro aggiornato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } },
            },
            403: {
              description: 'Riservato agli admin',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            404: {
              description: 'Libro non trovato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
        delete: {
          tags: ['Books'],
          summary: 'Elimina un libro (solo admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Libro eliminato',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { message: { type: 'string', example: 'Libro eliminato.' } },
                  },
                },
              },
            },
            403: {
              description: 'Riservato agli admin',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            404: {
              description: 'Libro non trovato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      // -------------------------------------------------------------- ORDERS
      '/orders': {
        post: {
          tags: ['Orders'],
          summary: 'Crea un ordine dal carrello (cliente autenticato)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/CreateOrderRequest' } },
            },
          },
          responses: {
            201: {
              description: 'Ordine creato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
            },
            400: {
              description: 'Carrello vuoto',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            404: {
              description: 'Libro non trovato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            409: {
              description: 'Libro non piu disponibile',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
        get: {
          tags: ['Orders'],
          summary: 'Elenco di tutti gli ordini (solo admin)',
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: 'Lista di tutti gli ordini',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                },
              },
            },
            403: {
              description: 'Riservato agli admin',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
      '/orders/mine': {
        get: {
          tags: ['Orders'],
          summary: "Elenco degli ordini dell'utente loggato",
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: 'Lista ordini del cliente',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                },
              },
            },
          },
        },
      },
      '/orders/{id}/status': {
        put: {
          tags: ['Orders'],
          summary: 'Aggiorna lo stato di un ordine (solo admin)',
          security: [{ cookieAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateOrderStatusRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Stato aggiornato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
            },
            403: {
              description: 'Riservato agli admin',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            404: {
              description: 'Ordine non trovato',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
          },
        },
      },
    },
  },
  // Vuoto: nessun file viene scansionato, la specifica e' tutta sopra.
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };