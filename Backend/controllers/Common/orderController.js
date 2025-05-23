// orderController.js
const orderService = require("../../Services/Common/orderService");

// ===========================
// CREATE AN ORDER
// ===========================
exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    const statusCode = error.message.includes("logged in")
      ? 401
      : error.message.includes("No tickets")
      ? 400
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// ===========================
// UPDATE AN ORDER
// ===========================
exports.updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    const statusCode = error.message.includes("logged in")
      ? 401
      : error.message.includes("not found")
      ? 404
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// ===========================
// GET ALL ORDERS (For Logged-in User)
// ===========================
exports.getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user);
    res.status(200).json(orders);
  } catch (error) {
    const statusCode = error.message.includes("logged in") ? 401 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// ===========================
// GET A SINGLE ORDER (By ID)
// ===========================
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res.status(200).json(order);
  } catch (error) {
    const statusCode = error.message.includes("logged in")
      ? 401
      : error.message.includes("not found")
      ? 404
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// ===========================
// CANCEL AN ORDER
// ===========================
exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user);

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    const statusCode = error.message.includes("logged in")
      ? 401
      : error.message.includes("not found")
      ? 404
      : error.message.includes("cannot be cancelled")
      ? 400
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// ===========================
// DELETE AN ORDER
// ===========================
exports.deleteOrder = async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id, req.user);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    const statusCode = error.message.includes("logged in")
      ? 401
      : error.message.includes("not found")
      ? 404
      : error.message.includes("cannot be deleted")
      ? 400
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = exports;
