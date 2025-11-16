import { create } from 'zustand';
import { YouTubeVideo } from '../types/youtube';
import { youtubeApi } from '../services/youtube-api';

interface AppState {
  searchQuery: string;
  searchResults: YouTubeVideo[];
  isLoading: boolean;
  error: string | null;
  isYtDlpAvailable: boolean | null;
  autoOpenBrowser: boolean;
  
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: YouTubeVideo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setYtDlpAvailable: (available: boolean) => void;
  setAutoOpenBrowser: (autoOpen: boolean) => void;
  
  searchVideos: (query: string, limit?: number) => Promise<void>;
  checkYtDlp: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  searchQuery: '',
  searchResults: [],
  isLoading: false,
  error: null,
  isYtDlpAvailable: null,
  autoOpenBrowser: true,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setYtDlpAvailable: (available) => set({ isYtDlpAvailable: available }),
  setAutoOpenBrowser: (autoOpen) => set({ autoOpenBrowser: autoOpen }),

  searchVideos: async (query: string, limit: number = 1) => {
    const { setLoading, setError, setSearchResults, autoOpenBrowser } = get();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const videos = await youtubeApi.searchVideos(query, limit);
      setSearchResults(videos);
      
      if (videos.length > 0 && autoOpenBrowser && limit === 1) {
        window.open(videos[0].url, '_blank');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  },

  checkYtDlp: async () => {
    const { setYtDlpAvailable } = get();
    try {
      const available = await youtubeApi.checkYtDlpAvailability();
      setYtDlpAvailable(available);
    } catch (error) {
      setYtDlpAvailable(false);
    }
  },
}));