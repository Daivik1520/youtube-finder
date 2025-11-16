import { VercelRequest, VercelResponse } from '@vercel/node';
import { YouTubeAPIService } from './youtube-api-service';

const API_KEY = process.env.YOUTUBE_API_KEY;
const youtubeService = API_KEY ? new YouTubeAPIService(API_KEY) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!youtubeService) {
      return res.status(200).json({ 
        available: false,
        message: 'YouTube API service not configured',
        source: 'youtube-data-api-v3'
      });
    }

    // Test with a simple search to verify API key is working
    const testVideos = await youtubeService.searchVideos('test', 1);
    
    return res.status(200).json({
      available: true,
      message: 'YouTube Data API v3 is working',
      testResults: {
        foundVideos: testVideos.length > 0,
        videoCount: testVideos.length
      },
      source: 'youtube-data-api-v3'
    });

  } catch (error) {
    console.error('[YOUTUBE-API-HEALTH] Error:', error);
    return res.status(200).json({
      available: false,
      message: 'YouTube API service error',
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'youtube-data-api-v3'
    });
  }
}