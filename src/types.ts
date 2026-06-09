export interface DiamondPack {
  id: string;
  title: string;
  price: number; // In INR
  imageUrl: string;
  promoTag: string | null;
  gamegemsId: string; // The ID used on gamegems store to select this item
}

export interface UserVerification {
  userId: string;
  serverId: string;
  username: string;
  verified: boolean;
}

export interface Order {
  orderId: string;
  pack: DiamondPack;
  user: UserVerification;
  paymentStatus: 'pending' | 'paid' | 'failed';
  rechargeStatus: 'pending' | 'processing' | 'complete' | 'failed';
}

export interface PaymentInfo {
  razorpayOrderId: string;
  amount: number;
  qrUrl?: string;
  upiLink: string;
}
