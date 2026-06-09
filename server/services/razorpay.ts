import Razorpay from 'razorpay';
import crypto from 'crypto';
import { config } from '../config';

export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
  }

  async createOrder(amountInPaise: number, receiptId: string) {
    try {
      const order = await this.razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
      });
      return order;
    } catch (error) {
      console.error('Razorpay order creation failed', error);
      throw error;
    }
  }

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');
    
    return generatedSignature === signature;
  }
}

export const razorpayService = new RazorpayService();
