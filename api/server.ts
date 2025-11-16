import express from 'express';
import cors from 'cors';
import { YouTubeService, YouTubeVideo } from './youtube-service';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const youtubeService = YouTubeService.getInstance();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/youtube/check-yt-dlp', async (req, res) => {
  try {
    const isAvailable = await youtubeService.checkYtDlpAvailability();
    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to check yt-dlp availability',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/youtube/search', async (req, res) => {
  try {
    const { query, limit = 1 } = req.body;
    
    console.log(`[SEARCH] Received search request: query="${query}", limit=${limit}`);
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.log('[SEARCH] Invalid query provided');
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
        res.json({ videos: [video] });
      } else {
        res.status(404).json({ 
          error: 'No videos found',
          message: 'No videos found for the given query'
        });
      }
    } else {
      const videos = await youtubeService.searchVideos(searchQuery, Math.min(limit, 10));
      console.log(`[SEARCH] Multiple videos search result: ${videos.length} videos found`);
      
      if (videos.length > 0) {
        res.json({ videos });
      } else {
        res.status(404).json({ 
          error: 'No videos found',
          message: 'No videos found for the given query'
        });
      }
    }
  } catch (error) {
    console.error('[SEARCH] Error occurred:', error);
    res.status(500).json({ 
      error: 'Failed to search videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 YouTube Finder API server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;