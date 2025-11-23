<p align="center">
  <img src="logoPNG.png" alt="Logo" />
</p>

**WUSIK** is a gamified Single Page Application (SPA) that tracks your music listening habits, creates personalized visual collages of your top artists and albums and let's you catch crowns of the artists you love the most! Built with Vue 3, it integrates Last.fm and Spotify APIs to provide rich music statistics.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5.24-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0.4-FFD859?style=for-the-badge&logo=pinia&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Integration](#-api-integration)
- [Testing](#-testing)
- [Future Enhancements](#-future-enhancements)

---

## ✨ Features

### Core Functionality
- 🎧 **Music Tracking**: View your recently listened tracks from Last.fm
- 🌟 **Top Artists**: Discover your top artists across different time periods (week, month, quarter, year, all-time)
- 🖼️ **Crown Run**: Compete against other users to get crowns accordingly to how much you listen to the artists
- 📊 **Personalized Dashboard**: Real-time statistics and listening patterns
- 🎨 **Collage Creation**: Generate custom collages of your top artists (coming soon)
- 📸 **Export Feature**: Download your statistics as JPEG

### Gamification (Planning)
- 🏆 **Badges**: Unlock achievements for music discovery
- 🎯 **Goals**: Set and track personal listening objectives


---

## 🛠️ APIs

- **Last.fm API** - Music metadata and user listening history
- **Spotify Web API** - Artist images and music data

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Last.fm API Key** - [Get it here](https://www.last.fm/api/account/create)
- **Spotify API Credentials** - [Register here](https://developer.spotify.com/dashboard)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SpotifyTracker.git
   cd SpotifyTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_LASTFM_API_KEY=your_lastfm_api_key
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Start the mock API server**
   ```bash
   npm run mock-server
   ```
   The server will run on `http://localhost:3000`

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`


---

## 🔌 API Integration

### Last.fm API
Under construction 

### Spotify Web API
Under construction 

### Mock API (json-server)
Under construction 

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
Under construction 

**Minimum requirement**: 6 unit tests covering core functionality

---

## 🎯 Future Enhancements

### Gamification System
- [ ] XP points for listening milestones
- [ ] Achievement badges system
- [ ] User levels and progression
- [ ] Weekly/monthly challenges

### Enhanced Features
- [ ] Album collage generation
- [ ] Custom time range filtering
- [ ] Social sharing capabilities
- [ ] Music recommendations
- [ ] Listening trends analysis

### Virtual Assistant/Bot (Bonus)
- [ ] Interactive music discovery assistant
- [ ] Personalized listening tips
- [ ] Genre exploration guidance
- [ ] Motivational messages

---

## 👥 Contributors

- **Mário Dias** - FullStack Developer
- **Diana Teles** - FullStack Developer

---

**Made with 🎵 and Vue.js**