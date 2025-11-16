import { YouTubeVideo, SearchResponse, ApiError } from '../types/youtube';

const API_BASE_URL = import.meta.env.VITE_API_URL || window.location.origin + '/api';

class YouTubeApiService {
  private static instance: YouTubeApiService;

  private constructor() {}

  static getInstance(): YouTubeApiService {
    if (!this.instance) {
      this.instance = new YouTubeApiService();
    }
    return this.instance;
  }

  private async fetchWithErrorHandling<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as ApiError).error || 'API request failed');
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async checkYtDlpAvailability(): Promise<boolean> {
    try {
      const response = await this.fetchWithErrorHandling<{ available: boolean }>(
        `${API_BASE_URL}/youtube/check-yt-dlp`
      );
      return response.available;
    } catch (error) {
      console.log('yt-dlp not available, using fallback mode');
      return false; // Always return false for serverless deployment
    }
  }

  async searchVideos(query: string, limit: number = 1): Promise<YouTubeVideo[]> {
    const response = await this.fetchWithErrorHandling<SearchResponse>(
      `${API_BASE_URL}/youtube/search`,
      {
        method: 'POST',
        body: JSON.stringify({ query, limit }),
      }
    );
    return response.videos;
  }

  async searchTopVideo(query: string): Promise<YouTubeVideo | null> {
    const videos = await this.searchVideos(query, 1);
    return videos.length > 0 ? videos[0] : null;
  }
}

export const youtubeApi = YouTubeApiService.getInstance();