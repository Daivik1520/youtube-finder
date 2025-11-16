import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface YouTubeVideo {
  title: string;
  url: string;
  id: string;
}

export class YouTubeService {
  private static instance: YouTubeService;

  private constructor() {}

  static getInstance(): YouTubeService {
    if (!this.instance) {
      this.instance = new YouTubeService();
    }
    return this.instance;
  }

  async checkYtDlpAvailability(): Promise<boolean> {
    try {
      await execAsync('yt-dlp --version');
      return true;
    } catch (error) {
      return false;
    }
  }

  async searchTopVideo(query: string): Promise<YouTubeVideo | null> {
    try {
      console.log(`[YOUTUBE-SERVICE] Searching top video for: "${query}"`);
      const { stdout, stderr } = await execAsync(
        `yt-dlp -j --flat-playlist "ytsearch1:${query}"`
      );

      console.log(`[YOUTUBE-SERVICE] Command stdout:`, stdout);
      console.log(`[YOUTUBE-SERVICE] Command stderr:`, stderr);

      if (stdout) {
        const lines = stdout.trim().split('\n').filter(line => line.length > 0);
        console.log(`[YOUTUBE-SERVICE] Found ${lines.length} lines of output`);
        
        if (lines.length > 0) {
          try {
            const video = JSON.parse(lines[0]);
            console.log(`[YOUTUBE-SERVICE] Parsed video:`, video);
            return {
              title: video.title,
              url: `https://www.youtube.com/watch?v=${video.id}`,
              id: video.id
            };
          } catch (parseError) {
            console.error(`[YOUTUBE-SERVICE] JSON parse error:`, parseError);
            console.error(`[YOUTUBE-SERVICE] Failed line:`, lines[0]);
            return null;
          }
        }
      }
      console.log(`[YOUTUBE-SERVICE] No output received from yt-dlp`);
      return null;
    } catch (error) {
      console.error('[YOUTUBE-SERVICE] Error searching video:', error);
      if (error instanceof Error) {
        console.error('[YOUTUBE-SERVICE] Error details:', error.message);
      }
      return null;
    }
  }

  async searchVideos(query: string, limit: number = 5): Promise<YouTubeVideo[]> {
    try {
      const { stdout } = await execAsync(
        `yt-dlp -j --flat-playlist "ytsearch${limit}:${query}"`
      );

      if (stdout) {
        const lines = stdout.trim().split('\n').filter(line => line.length > 0);
        return lines.map(line => {
          const video = JSON.parse(line);
          return {
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            id: video.id
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }
}