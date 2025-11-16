import React, { useEffect } from 'react';
import { useAppStore } from '../store/app-store';
import { SearchBar } from '../components/SearchBar';
import { VideoCard } from '../components/VideoCard';
import { StatusIndicator } from '../components/StatusIndicator';
import { Toggle } from '../components/Toggle';
import { AlertCircle, ExternalLink, Youtube } from 'lucide-react';

export default function Home() {
  const {
    searchQuery,
    searchResults,
    isLoading,
    error,
    isYtDlpAvailable,
    autoOpenBrowser,
    setSearchQuery,
    setAutoOpenBrowser,
    searchVideos,
    checkYtDlp,
  } = useAppStore();

  useEffect(() => {
    checkYtDlp();
  }, [checkYtDlp]);

  const handleSearch = () => {
    searchVideos(searchQuery, 1);
  };

  const handlePlayVideo = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-600/20 animate-pulse" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              YouTube Finder
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Search and discover YouTube videos with our powerful search tool
          </p>
        </header>

        {/* Status and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <StatusIndicator isAvailable={isYtDlpAvailable} />
          <Toggle
            label="Auto-open in browser"
            checked={autoOpenBrowser}
            onChange={setAutoOpenBrowser}
          />
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            loading={isLoading}
            placeholder="Enter a topic to search..."
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searchResults.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
              Search Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={handlePlayVideo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searchResults.length === 0 && !error && (
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Youtube className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Start Searching
              </h3>
              <p className="text-gray-400">
                Enter a topic above to find YouTube videos. Try searching for music, tutorials, or anything you're interested in!
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Powered by yt-dlp • Built with React & Express
            <ExternalLink className="w-4 h-4" />
          </p>
        </footer>
      </div>
    </div>
  );
}