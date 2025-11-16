export interface YouTubeVideo {
  title: string;
  url: string;
  id: string;
}

export interface SearchResponse {
  videos: YouTubeVideo[];
}

export interface ApiError {
  error: string;
  message?: string;
  details?: string;
}