const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../middlewares/uploadMiddleware');
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', authenticateToken, uploadImage, createItem);
router.put('/:id', authenticateToken, uploadImage, updateItem);
router.delete('/:id', authenticateToken, deleteItem);

module.exports = router;