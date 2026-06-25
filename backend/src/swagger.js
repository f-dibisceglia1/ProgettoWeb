// Configurazione di Swagger (OpenAPI 3).
// swagger-jsdoc legge i commenti @openapi sparsi nei file delle rotte e
// costruisce la specifica; swagger-ui-express la espone come pagina web
// interattiva su /api/docs, dove e' possibile provare le API dal browser.
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Nexum Shop API',
      version: '1.0.0',
      description:
        'API REST dell\'e-commerce Nexum Shop. Progetto per il corso ' +
        '"Fondamenti del Web" (Ingegneria Informatica e dell\'Automazione, UNIBA).',
    },
    servers: [{ url: '/api', description: 'Base URL delle API' }],
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
