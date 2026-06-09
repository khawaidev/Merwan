import { Router } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import qs from 'qs';

export const verifyRouter = Router();

verifyRouter.post('/', async (req, res) => {
  const { userId, serverId } = req.body;

  if (!userId || !serverId) {
    return res.status(400).json({ success: false, error: 'Missing userId or serverId' });
  }

  try {
    const response = await axios.post(
      'https://gamegems.store/pages/mlbb.php',
      qs.stringify({
        userid: userId,
        zoneid: serverId,
        getRole: ''
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    );

    const $ = cheerio.load(response.data);
    
    // Find the h5 containing "UserName:"
    let username = null;
    $('h5').each((_, el) => {
      const text = $(el).text();
      if (text.includes('UserName:')) {
        username = text.replace('UserName:', '').trim();
      }
    });

    if (username) {
      res.json({ success: true, username });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (err: any) {
    console.error('Verification failed:', err.message);
    res.status(500).json({ success: false, error: 'Verification failed' });
  }
});
