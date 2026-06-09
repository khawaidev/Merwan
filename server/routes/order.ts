import { Router } from 'express';
import { razorpayService } from '../services/razorpay';
import { config } from '../config';
const { v4: uuidv4 } = require('uuid');

export const orderRouter = Router();

// Store for simple mock DB
export const ordersDb = new Map<string, any>();

orderRouter.post('/create-order', async (req, res) => {
  const { userId, serverId, packId, amount } = req.body;

  try {
    const internalOrderId = uuidv4();
    
    // Convert to paise
    const razorpayOrder = await razorpayService.createOrder(amount * 100, internalOrderId);
    
    ordersDb.set(internalOrderId, {
      id: internalOrderId,
      userId,
      serverId,
      packId,
      amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId: internalOrderId,
      razorpayOrderId: razorpayOrder.id,
      amount,
      keyId: config.razorpay.keyId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});
