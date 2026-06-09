import express from 'express';
import cors from 'cors';
import { config } from './config';
import { verifyRouter } from './routes/verify';
import { orderRouter } from './routes/order';
import { rechargeRouter } from './routes/recharge';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/verify', verifyRouter);
app.use('/api', orderRouter);
app.use('/api/recharge', rechargeRouter);
app.use('/api/recharge-status', rechargeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});
