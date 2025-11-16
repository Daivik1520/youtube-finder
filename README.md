# YouTube Finder Web App

A modern web interface for searching YouTube videos using yt-dlp. Built with React, TypeScript, Express, and Tailwind CSS.

## Features

- 🔍 Search YouTube videos with real-time results
- 🎨 Modern gradient UI with glassmorphism effects
- 📱 Responsive design for all devices
- ⚡ Fast and modular architecture
- 🔄 Auto-open videos in browser option
- 📊 yt-dlp availability checking

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **State Management**: Zustand
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ 
- yt-dlp installed on your system

### Installing yt-dlp

```bash
# macOS
brew install yt-dlp

# Windows
winget install yt-dlp

# Linux
sudo apt install yt-dlp
# or
sudo pip install yt-dlp
```

## Development

```bash
# Install dependencies
npm install

# Start development server (both frontend and backend)
npm run dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Production Build

```bash
# Build the application
npm run build

# Start production server
npm run preview
```

## Deployment

### Vercel

1. Connect your repository to Vercel
2. The `vercel.json` configuration will handle the deployment automatically

### Netlify

1. Connect your repository to Netlify
2. The `netlify.toml` configuration will handle the deployment automatically

### Build (Alternative)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/youtube/check-yt-dlp` - Check if yt-dlp is available
- `POST /api/youtube/search` - Search for videos

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services
├── store/              # Zustand stores
├── types/              # TypeScript types
└── utils/              # Utility functions

api/
├── server.ts           # Express server
└── youtube-service.ts  # YouTube service logic
```

## License

MIT License
