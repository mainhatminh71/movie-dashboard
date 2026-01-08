# 🎬 TINY MOVIEZ - Movie Streaming Dashboard

<div align="center">

![Angular](https://img.shields.io/badge/Angular-19.2-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)
![TMDB API](https://img.shields.io/badge/TMDB-API-orange?style=for-the-badge)

A premium, elegant movie streaming dashboard built with Angular 19, featuring a modern dark theme UI with glassmorphism effects and smooth animations.

</div>

---

## ✨ Features

### 🎨 **Premium UI/UX**
- **Dark Theme Design** - Sophisticated dark color palette (#0a0a0a) with teal accents
- **Glassmorphism Effects** - Modern backdrop blur and transparency effects
- **Smooth Animations** - Cubic-bezier transitions and hover effects
- **Responsive Layout** - Three-column layout with fixed sidebars
- **Custom Scrollbars** - Elegant, minimal scrollbar styling

### 🎯 **Core Functionality**
- **Movie Discovery** - Browse movies, TV shows, and anime
- **Watchlist Management** - Save and manage your favorite content
- **Continue Watching** - Track your viewing progress with progress bars
- **Top Picks** - Curated recommendations
- **Search & Filter** - Advanced search capabilities
- **Category Tabs** - Easy navigation between Movies, TV Shows, and Anime

### 🏗️ **Architecture**
- **Standalone Components** - Modern Angular standalone architecture
- **Service-Based** - Clean separation of concerns
- **TypeScript** - Full type safety
- **SCSS Styling** - Modular and maintainable stylesheets

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Angular CLI** (v19.2 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AngularProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create `src/environments/environment.secret.ts`:
   ```typescript
   export const SecretEnvironment = {
     tmdbApiKey: 'your-tmdb-api-key-here'
   };
   ```
   
   Get your API key from [TMDB](https://www.themoviedb.org/settings/api)

4. **Start development server**
   ```bash
   npm start
   ```
   
   Navigate to `http://localhost:4200/`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Data models
│   │   │   ├── movie.model.ts
│   │   │   └── watchlistitem.model.ts
│   │   └── services/        # Core services
│   │       ├── movie.service.ts
│   │       ├── tvshow.service.ts
│   │       └── storage.service.ts
│   │
│   ├── export-result/        # UI Components
│   │   ├── header/          # Top navigation bar
│   │   ├── left-side/       # Left sidebar navigation
│   │   ├── main-content/    # Main content area
│   │   ├── right-sidebar/   # Right sidebar (notifications, continue watching)
│   │   ├── discover/       # Discovery component
│   │   ├── watchlist/       # Watchlist component
│   │   └── ...              # Other feature components
│   │
│   ├── app.component.ts     # Root component
│   ├── app.config.ts        # App configuration
│   ├── app.routes.ts        # Routing configuration
│   └── tokens.scss          # Design tokens (colors, variables)
│
├── environments/             # Environment configuration
│   ├── environment.ts
│   └── environment.secret.ts
│
└── styles.css               # Global styles
```

---

## 🎨 Design System

### Color Palette

- **Background**: `#0a0a0a` - Deep black
- **Sidebar**: `#181818` - Dark gray with gradient
- **Accent**: `#00b9ae` - Teal (primary action color)
- **Text Primary**: `#f5f5f5` - Off-white
- **Text Secondary**: `#999999` - Medium gray
- **Borders**: `rgba(255, 255, 255, 0.06)` - Subtle borders

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

## 🛠️ Technologies

### Core
- **Angular 19.2** - Latest Angular framework
- **TypeScript 5.5** - Type-safe development
- **RxJS 7.8** - Reactive programming

### Styling
- **SCSS** - Advanced CSS preprocessing
- **CSS Custom Properties** - Design tokens
- **Backdrop Filter** - Glassmorphism effects

### API Integration
- **TMDB API** - The Movie Database API
- **HTTP Interceptors** - API key management

---

## 📜 Available Scripts

```bash
# Development
npm start              # Start dev server (with --disable-host-check)
npm run ng serve        # Standard Angular serve

# Build
npm run build          # Production build
npm run watch          # Watch mode for development

# Testing
npm test               # Run unit tests
```

---

## 🎯 Key Features Breakdown

### Navigation Sidebar (Left)
- **Menu Section**: Home, Discover, Awards, Celebrities
- **Library Section**: Recent, Top Rated, Downloaded, Playlists, Watchlist, Completed
- **General Section**: Settings, Log Out
- Active state indicators with teal accent bar
- Smooth hover animations

### Main Content Area
- **Category Tabs**: Movies, TV Shows, Anime
- **Search Bar**: Real-time search with filter icon
- **Hero Section**: Featured content carousel
  - Large hero card with gradient background
  - Navigation arrows
  - Pagination indicators
  - Action buttons (Watchlist, Watch Now)

### Right Sidebar
- **Notifications**: Bell icon with notification dot
- **Continue Watching**: 
  - Thumbnail preview
  - Progress bar
  - Action buttons (Drop, Continue)
- **Top Picks**: 
  - Icon-based items
  - Episode counts
  - Navigation arrows

---

## 🔧 Configuration

### Environment Variables

The project uses environment files for configuration:

- `environment.ts` - Public configuration
- `environment.secret.ts` - API keys (not committed to git)

### API Configuration

```typescript
{
  tmdbApiKey: 'your-api-key',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/'
}
```

---

## 🎨 UI Highlights

### Premium Effects
- ✨ Glassmorphism with backdrop blur
- 🌈 Gradient buttons and backgrounds
- 💫 Smooth cubic-bezier animations
- 🎯 Multi-layer shadows for depth
- 🔄 Transform animations on hover
- 📊 Progress indicators with glow effects

### Responsive Design
- Fixed left sidebar (240px)
- Flexible main content area
- Fixed right sidebar (280px)
- Scrollable sidebars with custom scrollbars

---

## 📝 Development Notes

### Component Architecture
- All components are **standalone**
- Services handle data fetching and state management
- Models provide type safety
- Interceptors manage API authentication

### Styling Approach
- SCSS modules per component
- Shared design tokens in `tokens.scss`
- Global styles in `styles.css`
- Component-scoped stylesheets

---

## 🚧 Roadmap

- [ ] Implement routing for navigation
- [ ] Add movie/TV show detail pages
- [ ] Implement watchlist functionality
- [ ] Add user authentication
- [ ] Enhance search with filters
- [ ] Add video player integration
- [ ] Implement user profiles
- [ ] Add social features (reviews, ratings)

---

## 📄 License

This project is private and proprietary.

---

## 👨‍💻 Development

Built with ❤️ using Angular 19

For questions or issues, please refer to the project documentation or contact the development team.

---

<div align="center">

**Made with Angular 19 & TypeScript**

⭐ Star this repo if you find it helpful!

</div>
