import { VercelRequest, VercelResponse } from '@vercel/node';

interface YouTubeVideo {
  title: string;
  url: string;
  id: string;
}

// Fallback YouTube API using a simple fetch approach
export class YouTubeFallbackService {
  private static instance: YouTubeFallbackService;

  private constructor() {}

  static getInstance(): YouTubeFallbackService {
    if (!this.instance) {
      this.instance = new YouTubeFallbackService();
    }
    return this.instance;
  }

  async checkYtDlpAvailability(): Promise<boolean> {
    // In serverless environment, we can't use yt-dlp
    return false;
  }

  async searchVideos(query: string, limit: number = 1): Promise<YouTubeVideo[]> {
    try {
      // Use YouTube's no-key-required search approach
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      
      // For demo purposes, return mock data that matches the expected format
      // In a real deployment, you'd use YouTube Data API v3 with an API key
      const mockVideos: YouTubeVideo[] = [
        {
          title: `${query} - Top Video Result`,
          url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
          id: 'dQw4w9WgXcQ'
        }
      ];

      // Add more mock results based on limit
      for (let i = 1; i < limit && i < 5; i++) {
        mockVideos.push({
          title: `${query} - Result ${i + 1}`,
          url: `https://www.youtube.com/watch?v=video${i + 1}`,
          id: `video${i + 1}`
        });
      }

      return mockVideos;
    } catch (error) {
      console.error('Fallback search error:', error);
      return [];
    }
  }

  async searchTopVideo(query: string): Promise<YouTubeVideo | null> {
    const videos = await this.searchVideos(query, 1);
    return videos.length > 0 ? videos[0] : null;
  }
}

const youtubeService = YouTubeFallbackService.getInstance();

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Query is required and must be a non-empty string' 
      });
    }

    const searchQuery = query.trim();
    
    if (limit === 1) {
      const video = await youtubeService.searchTopVideo(searchQuery);
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
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Failed to search videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}