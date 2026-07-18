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




router.get('/', listBooks);


router.get('/:id', getBook);


router.post('/', requireAuth, requireAdmin, createBook);


router.put('/:id', requireAuth, requireAdmin, updateBook);


router.delete('/:id', requireAuth, requireAdmin, deleteBook);

module.exports = router;