import { VercelRequest, VercelResponse } from '@vercel/node';
import { YouTubeAPIService } from './youtube-api-service';

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('YOUTUBE_API_KEY environment variable is not set');
}

const youtubeService = API_KEY ? new YouTubeAPIService(API_KEY) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!youtubeService) {
      console.error('[YOUTUBE-API-HANDLER] YouTube API service not available');
      return res.status(500).json({ 
        error: 'YouTube API service not configured',
        message: 'Please set YOUTUBE_API_KEY environment variable'
      });
    }

    const { query, limit = '1' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const maxResults = Math.min(parseInt(limit as string) || 1, 10);
    console.log(`[YOUTUBE-API-HANDLER] Searching for: "${query}" with limit: ${maxResults}`);

    const videos = await youtubeService.searchVideos(query, maxResults);
    
    console.log(`[YOUTUBE-API-HANDLER] Found ${videos.length} videos`);
    
    return res.status(200).json({
      success: true,
      videos,
      count: videos.length,
      source: 'youtube-data-api-v3'
    });

  } catch (error) {
    console.error('[YOUTUBE-API-HANDLER] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to search YouTube videos',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}