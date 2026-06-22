import { Router } from 'express';
import {
  createOrder,
  myOrders,
  listOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Orders
 *     description: Creazione e gestione degli ordini
 */

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crea un ordine dal carrello (cliente autenticato)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     size: { type: string }
 *                     quantity: { type: integer }
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street: { type: string }
 *                   city: { type: string }
 *                   zip: { type: string }
 *     responses:
 *       201: { description: Ordine creato }
 *       409: { description: Disponibilita insufficiente }
 */
router.post('/', requireAuth, createOrder);

/**
 * @openapi
 * /orders/mine:
 *   get:
 *     tags: [Orders]
 *     summary: Elenco degli ordini dell'utente loggato
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Lista ordini del cliente }
 */
router.get('/mine', requireAuth, myOrders);

/**
 * @openapi
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Elenco di tutti gli ordini (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Lista di tutti gli ordini }
 *       403: { description: Riservato agli admin }
 */
router.get('/', requireAuth, requireAdmin, listOrders);

/**
 * @openapi
 * /orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Aggiorna lo stato di un ordine (solo admin)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in elaborazione, spedito, consegnato, annullato]
 *     responses:
 *       200: { description: Stato aggiornato }
 *       403: { description: Riservato agli admin }
 */
router.put('/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
