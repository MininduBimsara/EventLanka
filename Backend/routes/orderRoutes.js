const express = require('express');
const orderController = require("../controllers/Common/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add authentication middleware
router.use(protect);

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get all orders
router.get("/", orderController.getOrders);

// Route to get a specific order by ID
router.get('/:id', orderController.getOrderById);

// Route to update an order by ID
router.put('/:id', orderController.updateOrder);

// Route to delete an order by ID
router.delete("/:id", orderController.deleteOrder);

// Route to cancel an order
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;