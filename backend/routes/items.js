const express = require('express');
const router = express.Router();
const { createItem, getItemsNearby, getItemById, updateItem, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getItemsNearby) // Note: this expects query params
    .post(protect, createItem);

router.route('/:id')
    .get(getItemById)
    .put(protect, updateItem)
    .delete(protect, deleteItem);

module.exports = router;
