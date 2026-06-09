import { Router } from 'express';
import { telegramService } from '../services/telegram';
import { ordersDb } from './order';

export const rechargeRouter = Router();

// Store recharge statuses
export const rechargeStatusDb = new Map<string, any>();

rechargeRouter.post('/', async (req, res) => {
  const { orderId, paymentId, userId, serverId, packId, supabaseOrderId } = req.body;

  // In a real app, verify the Razorpay signature here before proceeding
  
  rechargeStatusDb.set(orderId, { status: 'processing', step: 'Making purchase order...' });
  res.json({ success: true, message: 'Recharge initiated' });

  // Background process
  (async () => {
    try {
      rechargeStatusDb.set(orderId, { status: 'processing', step: 'Verifying payment...' });
      
      const order = ordersDb.get(orderId);
      const amount = order ? (order.amount / 100) : 0; // Convert paise to rupees
      
      rechargeStatusDb.set(orderId, { status: 'processing', step: 'Sending to Admin for fulfillment...' });

      // Send to Telegram — use supabaseOrderId so it matches the user's profile
      await telegramService.sendFulfillmentTask(supabaseOrderId || orderId, amount, packId, userId, serverId);

      // We complete the flow for the user instantly now, because Admin manually fulfills it.
      rechargeStatusDb.set(orderId, { status: 'complete', step: 'Order sent to Admin for manual processing' });

    } catch (err: any) {
      console.error('Recharge processing failed:', err);
      rechargeStatusDb.set(orderId, { status: 'failed', step: 'Error', error: err.message });
    }
  })();
});

rechargeRouter.get('/status/:orderId', (req, res) => {
  const status = rechargeStatusDb.get(req.params.orderId);
  if (status) {
    res.json(status);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});
