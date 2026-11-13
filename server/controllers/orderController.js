const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { clientId, items, shippingAddress } = req.body;
    if (!clientId || !items?.length) {
      return res.status(400).json({ message: 'clientId and items are required' });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({
      clientId,
      items,
      total: Math.round(total * 100) / 100,
      shippingAddress,
      syncedAt: new Date(),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Bulk sync endpoint — accepts array of queued orders from offline client
exports.syncOrders = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || !orders.length) {
      return res.status(400).json({ message: 'orders array required' });
    }

    const results = await Promise.allSettled(
      orders.map(async (o) => {
        const total = o.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return Order.create({
          clientId: o.clientId,
          items: o.items,
          total: Math.round(total * 100) / 100,
          shippingAddress: o.shippingAddress,
          syncedAt: new Date(),
        });
      })
    );

    const synced = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected').length;

    res.json({ synced: synced.length, failed, orders: synced });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { clientId } = req.query;
    const filter = clientId ? { clientId } : {};
    const orders = await Order.find(filter).sort('-createdAt').limit(50);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
