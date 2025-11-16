import { VercelRequest, VercelResponse } from '@vercel/node';
import { YouTubeService } from './youtube-service';

const youtubeService = YouTubeService.getInstance();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const isAvailable = await youtubeService.checkYtDlpAvailability();
    return res.json({ available: isAvailable });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}