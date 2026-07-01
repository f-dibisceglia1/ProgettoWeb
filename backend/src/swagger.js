// Configurazione di Swagger (OpenAPI 3).
// swagger-jsdoc legge i commenti @openapi sparsi nei file delle rotte e
// costruisce la specifica; swagger-ui-express la espone come pagina web
// interattiva su /api/docs, dove e' possibile provare le API dal browser.
const swaggerJsdoc = require('swagger-jsdoc');

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
    servers: [{ url: '/api/v1', description: 'Base URL delle API' }],
    components: {
      securitySchemes: {
        // L'autenticazione avviene tramite cookie httpOnly "token".
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  // Dove cercare i commenti @openapi.
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
