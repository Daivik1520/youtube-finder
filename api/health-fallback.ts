import { VercelRequest, VercelResponse } from '@vercel/node';

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
    // In serverless environment, yt-dlp is not available
    return res.json({ available: false });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}