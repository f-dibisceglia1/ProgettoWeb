const express = require('express'); 
const router = express.Router();
const {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/book.controller.js');
const { requireAuth, requireAdmin } = require('../middleware/auth.js');



/**
 * @openapi
 * tags:
 *   - name: Books
 *     description: Catalogo libri usati (lettura pubblica, scrittura admin)
 */

/**
 * @openapi
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Elenco dei libri del catalogo
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtra per categoria
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Ricerca testuale su titolo o autore
 *     responses:
 *       200: { description: Lista dei libri }
 */
router.get('/', listBooks);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Dettaglio di un singolo libro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Dettaglio libro }
 *       404: { description: Libro non trovato }
 */
router.get('/:id', getBook);

/**
 * @openapi
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Crea un nuovo libro (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               author: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               isbn: { type: string }
 *               price: { type: number }
 *               condition:
 *                 type: string
 *                 enum: [come nuovo, buono, accettabile, rovinato]
 *               image: { type: string }
 *     responses:
 *       201: { description: Libro creato }
 *       400: { description: Campi obbligatori mancanti }
 *       403: { description: Riservato agli admin }
 */
router.post('/', requireAuth, requireAdmin, createBook);

/**
 * @openapi
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Modifica un libro (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Libro aggiornato }
 *       403: { description: Riservato agli admin }
 *       404: { description: Libro non trovato }
 */
router.put('/:id', requireAuth, requireAdmin, updateBook);

/**
 * @openapi
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Elimina un libro (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Libro eliminato }
 *       403: { description: Riservato agli admin }
 *       404: { description: Libro non trovato }
 */
router.delete('/:id', requireAuth, requireAdmin, deleteBook);

module.exports = router;