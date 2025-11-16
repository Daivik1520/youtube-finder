import React from 'react';
import { YouTubeVideo } from '../types/youtube';
import { ExternalLink, Play } from 'lucide-react';

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (url: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105">
      <div className="relative aspect-video bg-gray-900">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={() => onPlay(video.url)}
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">YouTube Video</span>
          <button
            onClick={() => onPlay(video.url)}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-200 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Watch
          </button>
        </div>
      </div>
    </div>
  );
};