<div align="center">

# 🎬 TINY MOVIEZ

### 🎯 Premium Movie Discovery Platform with AI-Powered Recommendations

[![Angular](https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)](https://github.com)
[![Version](https://img.shields.io/badge/Version-0.0.0-blue?style=flat-square)](package.json)

---

**A sophisticated movie streaming dashboard built with Angular 19, featuring AI-powered recommendations, RAG (Retrieval-Augmented Generation), and a stunning dark theme UI with glassmorphism effects.**

[🚀 Quick Start](#-quick-start) • [📖 Features](#-features) • [🐳 Docker](#-docker-deployment) • [⚙️ Configuration](#️-configuration) • [📚 Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎨 **Premium UI/UX**
- 🌙 **Dark Theme Design** - Sophisticated dark color palette (#0a0a0a) with teal accents
- 💎 **Glassmorphism Effects** - Modern backdrop blur and transparency effects
- ✨ **Smooth Animations** - Cubic-bezier transitions and hover effects
- 📱 **Fully Responsive** - Optimized for all screen sizes
- 🎯 **Custom Scrollbars** - Elegant, minimal scrollbar styling
- ⭐ **Particles Background** - Interactive starfield animation

### 🎯 **Core Functionality**
- 🔍 **Smart Discovery** - Browse movies, TV shows with advanced search
- 📋 **Watchlist Management** - Save and manage your favorite content
- ⏯️ **Continue Watching** - Track your viewing progress with progress bars
- 🏆 **Top Rated** - Curated recommendations and top picks
- 🎬 **Movie Details** - Comprehensive movie/TV show information
- 🎭 **TV Show Support** - Full TV series discovery and details

### 🤖 **AI-Powered Features**
- 💬 **AI Chat Assistant** - Intelligent movie recommendations using Groq AI
- 🧠 **RAG Integration** - Retrieval-Augmented Generation for context-aware responses
- 🔗 **Vector Store** - Pinecone integration for semantic search
- 📊 **Embedding Service** - Advanced document embedding capabilities
- 🎯 **Smart Recommendations** - AI-driven content suggestions

### 🏗️ **Modern Architecture**
- ⚡ **Standalone Components** - Modern Angular standalone architecture
- 🔄 **Signals** - Reactive state management with Angular Signals
- 🎛️ **Service-Based** - Clean separation of concerns
- 📦 **TypeScript** - Full type safety throughout
- 🎨 **SCSS Styling** - Modular and maintainable stylesheets
- 🧩 **Component Library** - Reusable UI components

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Angular CLI** (v19.2 or higher) - `npm install -g @angular/cli`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AngularProject
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables**
   
   Create `src/environments/environment.secret.ts`:
   ```typescript
   export const SecretEnvironment = {
     tmdbApiKey: 'your-tmdb-api-key-here',
     tmdbApiToken: 'your-tmdb-api-token-here',
     groqApiKey: 'your-groq-api-key-here',
     openaiApiKey: 'your-openai-api-key-here',
     nomicApiKey: 'your-nomic-api-key-here'
   };
   ```
   
   Or set environment variables:
   ```bash
   export TMDB_API_KEY=your_key_here
   export GROQ_API_KEY=your_key_here
   export OPENAI_API_KEY=your_key_here
   export NOMIC_API_KEY=your_key_here
   ```

4. **Get API Keys**
   - **TMDB API**: [Get your API key](https://www.themoviedb.org/settings/api)
   - **Groq API**: [Get your API key](https://console.groq.com/)
   - **OpenAI API**: [Get your API key](https://platform.openai.com/api-keys)
   - **Nomic API**: [Get your API key](https://atlas.nomic.ai/)

5. **Start development server**
   ```bash
   npm start
   ```
   
   Navigate to `http://localhost:4200/`

---

## 🐳 Docker Deployment

### Quick Deploy with Docker

#### Option 1: Using Docker Compose (Recommended)

1. **Create `.env` file** in project root:
   ```env
   TMDB_API_KEY=your_tmdb_api_key
   GROQ_API_KEY=your_groq_api_key
   OPENAI_API_KEY=your_openai_api_key
   NOMIC_API_KEY=your_nomic_api_key
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**:
   ```
   http://localhost:8080
   ```

#### Option 2: Using Docker CLI

1. **Build the image**:
   ```bash
   docker build \
     --build-arg TMDB_API_KEY=your_key \
     --build-arg GROQ_API_KEY=your_key \
     --build-arg OPENAI_API_KEY=your_key \
     --build-arg NOMIC_API_KEY=your_key \
     -t tiny-moviez:latest .
   ```

2. **Run the container**:
   ```bash
   docker run -d -p 8080:80 --name tiny-moviez tiny-moviez:latest
   ```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Remove containers and volumes
docker-compose down -v
```

---

## 📁 Project Structure

```
AngularProject/
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 core/
│   │   │   ├── 📂 config/          # App configuration
│   │   │   ├── 📂 models/          # Data models (Movie, TVShow, RAGDocument)
│   │   │   ├── 📂 prompts/         # AI system prompts
│   │   │   ├── 📂 services/        # Core services
│   │   │   │   ├── ai-chat.service.ts
│   │   │   │   ├── embedding.service.ts
│   │   │   │   ├── movie.service.ts
│   │   │   │   ├── rag.service.ts
│   │   │   │   └── vector-store.service.ts
│   │   │   └── 📂 stores/          # State management (Signals)
│   │   │
│   │   ├── 📂 features/            # Feature modules
│   │   │   ├── discover/           # Movie/TV discovery
│   │   │   ├── home/               # Home page
│   │   │   ├── movie-details/      # Movie detail page
│   │   │   ├── tv-details/         # TV show detail page
│   │   │   ├── top-rated/          # Top rated content
│   │   │   ├── watchlist/          # User watchlist
│   │   │   └── header/             # Navigation header
│   │   │
│   │   ├── 📂 lib/                 # Shared libraries
│   │   │   ├── 📂 components/      # Reusable components
│   │   │   │   ├── ai-float-button/
│   │   │   │   ├── movie-card/
│   │   │   │   ├── filter-chip/
│   │   │   │   └── rating-slider/
│   │   │   ├── 📂 layouts/         # Layout components
│   │   │   ├── 📂 common/          # Common utilities
│   │   │   │   ├── pipes/          # Custom pipes
│   │   │   │   └── utils/          # Utility functions
│   │   │   └── 📂 styles/          # Shared styles
│   │   │
│   │   ├── app.component.ts        # Root component
│   │   ├── app.config.ts           # App configuration
│   │   └── app.routes.ts           # Routing configuration
│   │
│   ├── 📂 environments/            # Environment configs
│   │   ├── environment.ts
│   │   ├── environment.prod.ts
│   │   └── environment.secret.ts   # (gitignored)
│   │
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── theme.scss
│
├── 📂 scripts/                     # Build scripts
│   └── replace-env.js              # Environment variable injection
│
├── 📂 dist/                        # Build output
├── 📄 Dockerfile                   # Docker configuration
├── 📄 docker-compose.yml           # Docker Compose config
├── 📄 nginx.conf                   # Nginx configuration
├── 📄 package.json
├── 📄 angular.json
└── 📄 README.md
```

---

## 🛠️ Technologies

### Core Framework
- **Angular 19.2** - Latest Angular framework with standalone components
- **TypeScript 5.5** - Type-safe development
- **RxJS 7.8** - Reactive programming
- **Zone.js 0.15** - Change detection

### UI Libraries
- **ng-zorro-antd 19.3** - Ant Design for Angular
- **@angular/material 19.2** - Angular Material components
- **@angular/cdk 19.2** - Component Dev Kit
- **@ant-design/icons-angular** - Icon library
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **DaisyUI 5.5** - Tailwind component library

### AI & ML
- **Groq SDK 0.37** - Fast AI inference
- **OpenAI SDK 6.16** - OpenAI API integration
- **@anthropic-ai/sdk 0.71** - Anthropic Claude integration
- **faiss-node 0.5** - Vector similarity search
- **ml-matrix 6.12** - Matrix operations
- **@pinecone-database/pinecone 6.1** - Vector database

### Visual Effects
- **@tsparticles/angular 3.0** - Particle effects
- **@tsparticles/preset-stars 3.2** - Starfield animation

### Build Tools
- **Angular CLI 19.2** - Development and build tooling
- **PostCSS 8.5** - CSS processing
- **Autoprefixer 10.4** - CSS vendor prefixes

---

## ⚙️ Configuration

### Environment Variables

The project uses environment files for configuration:

| Variable | Description | Required |
|----------|-------------|----------|
| `TMDB_API_KEY` | The Movie Database API key | ✅ Yes |
| `TMDB_API_TOKEN` | TMDB API token | ✅ Yes |
| `GROQ_API_KEY` | Groq AI API key | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key | ⚠️ Optional |
| `NOMIC_API_KEY` | Nomic embedding API key | ⚠️ Optional |

### Build Configuration

```json
{
  "scripts": {
    "start": "ng serve --disable-host-check",
    "build": "ng build --configuration production",
    "build:vercel": "node scripts/replace-env.js && ng build --configuration production",
    "watch": "ng build --watch --configuration development"
  }
}
```

### API Configuration

```typescript
{
  tmdbApiKey: 'your-api-key',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/',
  groqApiKey: 'your-groq-key',
  groqBaseUrl: 'https://api.groq.com/openai/v1',
  openaiApiKey: 'your-openai-key',
  nomicApiKey: 'your-nomic-key'
}
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with host check disabled |
| `npm run build` | Build for production (runs prebuild script) |
| `npm run build:vercel` | Build optimized for Vercel deployment |
| `npm run watch` | Build in watch mode for development |
| `npm test` | Run unit tests with Karma |

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Background** | `#0a0a0a` | Main background |
| **Sidebar** | `#181818` | Sidebar background with gradient |
| **Accent** | `#00b9ae` | Primary action color (teal) |
| **Text Primary** | `#f5f5f5` | Main text color |
| **Text Secondary** | `#999999` | Secondary text color |
| **Borders** | `rgba(255, 255, 255, 0.06)` | Subtle borders |

### Typography

- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto')
- **Headings**: 700-800 weight
- **Body**: 500-600 weight
- **Letter Spacing**: Optimized for readability

### Components

- **Border Radius**: 8px - 20px (varies by component)
- **Shadows**: Multi-layer shadows for depth
- **Transitions**: Cubic-bezier easing functions
- **Glassmorphism**: Backdrop blur with transparency

---

## 🎯 Key Features Breakdown

### 🧭 Navigation & Layout
- **Left Sidebar**: Menu, Library, General sections with active state indicators
- **Header**: Search bar, notifications, user menu
- **Main Content**: Flexible content area with category tabs
- **Right Sidebar**: Continue watching, top picks, notifications

### 🎬 Content Discovery
- **Category Tabs**: Movies, TV Shows, Anime
- **Advanced Search**: Real-time search with filters
- **Hero Section**: Featured content carousel with navigation
- **Filter System**: Genre, year, rating filters

### 📋 Watchlist & Progress
- **Watchlist Management**: Add/remove favorites
- **Continue Watching**: Track viewing progress
- **Progress Bars**: Visual progress indicators
- **Local Storage**: Persistent data storage

### 🤖 AI Features
- **AI Chat Assistant**: Interactive movie recommendations
- **RAG System**: Context-aware responses using document retrieval
- **Vector Search**: Semantic search with Pinecone
- **Smart Recommendations**: AI-driven content suggestions

---

## 🚧 Development Roadmap

### ✅ Completed
- [x] Standalone components architecture
- [x] Routing and navigation
- [x] Movie/TV show discovery
- [x] Watchlist functionality
- [x] AI chat integration
- [x] RAG system implementation
- [x] Vector store integration
- [x] Docker deployment setup

### 🔄 In Progress
- [ ] User authentication
- [ ] Social features (reviews, ratings)
- [ ] Video player integration
- [ ] Advanced filtering

### 📋 Planned
- [ ] User profiles
- [ ] Recommendations engine
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Offline support

---

## 📚 Documentation

### API Integration

- **TMDB API**: [Documentation](https://developers.themoviedb.org/3)
- **Groq API**: [Documentation](https://console.groq.com/docs)
- **OpenAI API**: [Documentation](https://platform.openai.com/docs)
- **Pinecone**: [Documentation](https://docs.pinecone.io/)

### Angular Resources

- **Angular 19**: [Documentation](https://angular.io/docs)
- **Angular Signals**: [Guide](https://angular.io/guide/signals)
- **Standalone Components**: [Guide](https://angular.io/guide/standalone-components)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails with peer dependency errors
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

**Issue**: API calls fail with 401/403 errors
```bash
# Solution: Check environment variables are set correctly
# Verify API keys in environment.secret.ts or .env file
```

**Issue**: Docker build fails
```bash
# Solution: Ensure all build args are provided
docker build --build-arg TMDB_API_KEY=... --build-arg GROQ_API_KEY=...
```

**Issue**: Port already in use
```bash
# Solution: Change port or kill process
# Windows: netstat -ano | findstr :4200
# Linux/Mac: lsof -ti:4200 | xargs kill
```

---

## 📄 License

This project is **private and proprietary**. All rights reserved.

---

## 👨‍💻 Development

<div align="center">

**Built with ❤️ using Angular 19, TypeScript, and AI**

[![Angular](https://img.shields.io/badge/Made%20with-Angular-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![AI](https://img.shields.io/badge/AI-Powered-FF6B6B?style=flat-square)](https://groq.com/)

⭐ **Star this repo if you find it helpful!**

---

**Questions or issues?** Please refer to the project documentation or contact the development team.

</div>
