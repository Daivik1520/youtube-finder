import { VercelRequest, VercelResponse } from '@vercel/node';
import { YouTubeService } from './youtube-service';

const youtubeService = YouTubeService.getInstance();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, limit = 1 } = req.body;
    
    console.log(`[SEARCH] Received search request: query="${query}", limit=${limit}`);
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Query is required and must be a non-empty string' 
      });
    }

    const isAvailable = await youtubeService.checkYtDlpAvailability();
    console.log(`[SEARCH] yt-dlp available: ${isAvailable}`);
    
    if (!isAvailable) {
      return res.status(503).json({ 
        error: 'yt-dlp is not available on the server',
        message: 'Please install yt-dlp: https://github.com/yt-dlp/yt-dlp'
      });
    }

    const searchQuery = query.trim();
    console.log(`[SEARCH] Searching for: "${searchQuery}"`);

    if (limit === 1) {
      const video = await youtubeService.searchTopVideo(searchQuery);
      console.log(`[SEARCH] Single video search result:`, video);
      
      if (video) {
        return res.json({ videos: [video] });
      } else {
        return res.status(404).json({ 
          error: 'No videos found',
          message: 'No videos found for the given query'
        });
      }
    } else {
      const videos = await youtubeService.searchVideos(searchQuery, Math.min(limit, 10));
      console.log(`[SEARCH] Multiple videos search result: ${videos.length} videos found`);
      
      if (videos.length > 0) {
        return res.json({ videos });
      } else {
        return res.status(404).json({ 
          error: 'No videos found',
          message: 'No videos found for the given query'
        });
      }
    }
  } catch (error) {
    console.error('[SEARCH] Error occurred:', error);
    return res.status(500).json({ 
      error: 'Failed to search videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}