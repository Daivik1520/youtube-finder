import { google } from 'googleapis';

export interface YouTubeVideo {
  title: string;
  url: string;
  id: string;
  description?: string;
  thumbnail?: string;
  channelTitle?: string;
  publishedAt?: string;
}

export class YouTubeAPIService {
  private youtube;

  constructor(apiKey: string) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
  }

  async searchVideos(query: string, maxResults: number = 1): Promise<YouTubeVideo[]> {
    try {
      console.log(`[YOUTUBE-API] Searching videos for: "${query}"`);
      
      const response = await this.youtube.search.list({
        part: ['snippet'],
        q: query,
        maxResults,
        type: ['video'],
        order: 'relevance'
      });

      const videos: YouTubeVideo[] = [];
      
      if (response.data.items) {
        for (const item of response.data.items) {
          if (item.id?.videoId) {
            videos.push({
              id: item.id.videoId,
              title: item.snippet?.title || 'Unknown Title',
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              description: item.snippet?.description,
              thumbnail: item.snippet?.thumbnails?.medium?.url,
              channelTitle: item.snippet?.channelTitle,
              publishedAt: item.snippet?.publishedAt
            });
          }
        }
      }

      console.log(`[YOUTUBE-API] Found ${videos.length} videos`);
      return videos;
    } catch (error) {
      console.error('[YOUTUBE-API] Error searching videos:', error);
      throw new Error('Failed to search YouTube videos');
    }
  }

  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
      console.log(`[YOUTUBE-API] Getting details for video: ${videoId}`);
      
      const response = await this.youtube.videos.list({
        part: ['snippet', 'statistics'],
        id: [videoId]
      });

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          id: video.id!,
          title: video.snippet?.title || 'Unknown Title',
          url: `https://www.youtube.com/watch?v=${video.id}`,
          description: video.snippet?.description,
          thumbnail: video.snippet?.thumbnails?.medium?.url,
          channelTitle: video.snippet?.channelTitle,
          publishedAt: video.snippet?.publishedAt
        };
      }

      return null;
    } catch (error) {
      console.error('[YOUTUBE-API] Error getting video details:', error);
      return null;
    }
  }

  async getTopVideo(query: string): Promise<YouTubeVideo | null> {
    try {
      const videos = await this.searchVideos(query, 1);
      return videos.length > 0 ? videos[0] : null;
    } catch (error) {
      console.error('[YOUTUBE-API] Error getting top video:', error);
      return null;
    }
  }
}