import express from 'express';
const router = express.Router();
import { addStockItem, getStockItems, updateStockItem, deleteStockItem } from '../Controllers/stockItemController.js';

// POST /api/stock-items
router.post('/add', addStockItem);

// GET /api/stock-items
router.get('/get', getStockItems);

// GET /api/stock-items/:id

// PUT /api/stock-items/:id
router.put('/:id', updateStockItem);

// DELETE /api/stock-items/:id
router.delete('/:id', deleteStockItem);

export default router;