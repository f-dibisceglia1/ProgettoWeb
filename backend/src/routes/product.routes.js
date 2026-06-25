const express = require('express'); 
const router = express.Router();
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');



/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Catalogo prodotti (lettura pubblica, scrittura admin)
 */

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Elenco dei prodotti del catalogo
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtra per categoria
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Ricerca testuale sul nome
 *     responses:
 *       200: { description: Lista dei prodotti }
 */
router.get('/', listProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Dettaglio di un singolo prodotto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Dettaglio prodotto }
 *       404: { description: Prodotto non trovato }
 */
router.get('/:id', getProduct);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Crea un nuovo prodotto (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       201: { description: Prodotto creato }
 *       403: { description: Riservato agli admin }
 */
router.post('/', requireAuth, requireAdmin, createProduct);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Modifica un prodotto (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Prodotto aggiornato }
 *       403: { description: Riservato agli admin }
 */
router.put('/:id', requireAuth, requireAdmin, updateProduct);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Elimina un prodotto (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Prodotto eliminato }
 *       403: { description: Riservato agli admin }
 */
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

module.exports = router;
