# Waiheke Radio - As-Built Documentation

**Project**: Waiheke Radio Website  
**Technology Stack**: Next.js 14.2.32, Sanity CMS, TypeScript  
**Last Updated**: 2025-09-09  
**Environment**: Windows Development

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Content Management System](#content-management-system)
4. [Component System](#component-system)
5. [Data Flow](#data-flow)
6. [External Integrations](#external-integrations)
7. [Environment Configuration](#environment-configuration)
8. [Development Setup](#development-setup)
9. [Key Files and Structure](#key-files-and-structure)
10. [Known Issues and Solutions](#known-issues-and-solutions)

---

## Project Overview

Waiheke Radio is a Next.js-based website for a community radio station on Waiheke Island, New Zealand. The site features:

- Dynamic page layouts using Sanity CMS
- Live streaming integration
- Podcast management and RSS feeds
- Radio show scheduling
- Staff profiles and show information
- Search functionality via Algolia
- Image management via Cloudinary
- Dual layout system with Theme CSS support

---

## Architecture

### Technology Stack
- **Frontend**: Next.js 14.2.32 with TypeScript
- **CMS**: Sanity v3 (migrated from Contentful)
- **Styling**: CSS Modules, SCSS, Bootstrap classes
- **Search**: Algolia Search
- **Images**: Cloudinary integration
- **Deployment**: Static generation with ISR support

### Project Structure
```
radio-sanity/
├── pages/                    # Next.js pages
│   ├── [slug].tsx           # Dynamic show pages
│   ├── podcast/[slug].tsx   # Podcast pages
│   ├── index.tsx            # Homepage
│   └── api/                 # API routes
├── src/
│   ├── components/Layout/   # All UI components
│   ├── lib/                 # Sanity client and utilities
│   ├── utils/               # Content service and helpers
│   └── @types/              # TypeScript definitions
├── sanity/                  # Sanity schema and config
├── styles/                  # CSS and SCSS files
└── public/                  # Static assets and RSS feeds
```

---

## Content Management System

### Sanity CMS Integration

The website uses Sanity v3 as its headless CMS, migrated from Contentful. Key aspects:

#### Content Types
- `landingPage` - Dynamic pages with configurable layouts
- `shows` - Radio show information and metadata
- `staff` - DJ and staff profiles
- `schedule` - Weekly radio schedules with `showTodayOnly` flag
- `amazonPodcast` - Podcast episodes
- `banner` - Hero banners for pages
- `menu` - Navigation menus
- `stream` - Live stream configurations
- `video` - Video content
- `message` - Text content blocks

#### Page Design System
The site uses a sophisticated page design system:
- `pageDesign` documents define layout structure
- `pageLayout` provides component arrangements
- Both systems work together for flexible page building

#### Content Service
Located in `src/utils/content-service.ts`, this service:
- Handles all Sanity queries using GROQ
- Resolves component references
- Provides type-safe content retrieval
- Supports preview mode for draft content

---

## Component System

### Dynamic Component Resolution

The system uses `src/components/Layout/components/index.tsx` as the main component router:

#### Component Mapping
Components are dynamically rendered based on `contentType` or `_type`:
- `schedule` → `Schedule` or `ShowsOnTodaySanity` (based on `showTodayOnly`)
- `stream` → `Stream`
- `menu` → `Menu`
- `latestpodcasts` → `LatestAmazonPodcasts`
- `amazonplaylist` → `AmazonPlaylist`
- `carousel` → `BannerCarousel`
- `search` → `SearchIcon`

#### Dual Layout System
The schedule component supports two rendering modes:

1. **Standard Layout**: Regular schedule display
2. **Theme Layout**: Uses `@/styles/Theme.module.css` classes
   - Triggered when `showTodayOnly: true`
   - Renders with specific HTML structure matching Theme CSS
   - Uses `showsOnTodaySanity.tsx` component

#### Component Resolution Flow
1. Page data fetched via `getStaticProps`
2. Components array processed by `renderComponents`
3. Each component routed through `Sorter` function
4. Content references resolved via content service
5. Appropriate React component rendered

---

## Data Flow

### Static Generation Process
1. **Build Time**: Pages pre-generated using `getStaticProps`
2. **Content Fetching**: Sanity content fetched via content service
3. **Component Resolution**: References resolved to full content
4. **RSS Generation**: Podcast feeds generated automatically
5. **ISR Support**: Pages can be revalidated on-demand

### Content Service Architecture
```typescript
// Main service class
ContentService.instance.getLandingPageBySlug(slug, preview)
  ├── Executes GROQ query
  ├── Resolves component references
  ├── Returns structured page data
  └── Supports preview mode
```

### Component Data Flow
```
Sanity CMS → Content Service → Page Props → Component Router → React Components
```

---

## External Integrations

### Cloudinary (Image Management)
- **Purpose**: Image optimization and management
- **Configuration**: Custom Sanity plugin for asset selection
- **Features**: Automatic optimization, responsive images
- **Plugin**: `phr` plugin in Sanity config

### Algolia Search
- **Purpose**: Site-wide search functionality
- **Components**: `SearchIcon`, search overlay
- **Configuration**: Via environment variables
- **Features**: Real-time search, faceted results

### RSS Feed Generation
- **Individual Shows**: `src/utils/generateRSSFeed.js`
- **Combined Feed**: `src/utils/generateAllRSSFeed.js`
- **Output**: Static XML files in `public/`
- **iTunes Compatible**: Full iTunes namespace support

### Live Streaming
- **Stream Components**: Configured via Sanity
- **Multiple Streams**: Support for different stream URLs
- **Audio Players**: Integrated HTML5 audio players

---

## Environment Configuration

### Required Environment Variables (.env.local)

```bash
# Sanity Configuration
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
SANITY_PREVIEW_SECRET=your_preview_secret

# Algolia Search
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key
ALGOLIA_SEARCH_ONLY_API_KEY=your_search_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=development
```

### TypeScript Configuration
- **Import Aliases**: Configured in `tsconfig.json`
  - `@/*` → Root directory
  - `@/styles/*` → `styles/*`
  - `@/components/*` → `src/components/*`
  - `@/lib/*` → `src/lib/*`

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Sanity CLI (optional)

### Installation
```bash
npm install
npm run dev  # Starts on port 3000 (or next available)
```

### Build Process
```bash
npm run build  # Production build
npm start      # Production server
npm run lint   # ESLint checking
```

### Sanity Studio
Located in `sanity/` directory, accessible via Sanity CLI or hosted studio.

---

## Key Files and Structure

### Core Application Files
- `pages/index.tsx` - Homepage with dynamic layout
- `src/components/Layout/index.tsx` - Main layout wrapper
- `src/components/Layout/components/index.tsx` - Component router
- `src/utils/content-service.ts` - Content fetching service
- `src/lib/sanity.client.ts` - Sanity client configuration

### Styling System
- `styles/globals.css` - Global styles
- `styles/Theme.module.css` - Theme-specific component styles
- `styles/Home.module.css` - Homepage styles
- CSS Modules used throughout components

### Configuration Files
- `sanity.config.ts` - Sanity studio configuration
- `next.config.js` - Next.js configuration with security headers
- `tsconfig.json` - TypeScript configuration with path aliases

---

## Known Issues and Solutions

### Recently Resolved
1. **Schedule Component Theme Rendering**
   - **Issue**: Schedule not rendering with Theme CSS
   - **Solution**: Added schedule resolution to content service
   - **Status**: ✅ Fixed

2. **Import Path Cleanup**  
   - **Issue**: Long relative import paths
   - **Solution**: Added TypeScript path aliases
   - **Status**: ✅ Fixed

3. **Podcast Image Thumbnails in Latest Podcasts**
   - **Issue**: Recent podcasts list missing visual thumbnails
   - **Solution**: Added rounded 48px avatar images to `latestAmazonPodcasts.tsx` component
   - **Files Modified**: 
     - `src/components/Layout/components/latestAmazonPodcasts.tsx` (lines 220-235)
     - `src/components/Layout/components/latestPodcasts.module.css` (lines 162-170)
   - **Implementation**: Added `podcastAvatar` div with Cloudinary image URLs and CSS for rounded thumbnails
   - **Status**: ✅ Fixed (2025-09-09)

### Current Issues
1. **Next.js Link Legacy Behavior**
   - **Issue**: `Invalid <Link> with <a> child` errors
   - **Status**: 🔄 In Progress

### Performance Notes
- Large page data (2.28MB) on homepage - consider optimization
- RSS feeds regenerated on each build
- Static generation provides good performance baseline

---

## Development Reminders

### For Future Development Sessions
1. **Always check environment variables** in `.env.local`
2. **Update this documentation** when adding new features
3. **Test both layout modes** for schedule components
4. **Verify RSS feed generation** after content changes
5. **Check Sanity preview mode** for draft content
6. **Monitor component resolution** via debug logs

### Content Management Notes
- Schedule `showTodayOnly` field controls layout rendering
- Component references must be resolved in content service
- Preview mode requires proper secret configuration
- Image optimization handled automatically by Cloudinary

---

**Note**: This documentation should be updated whenever significant changes are made to the architecture, integrations, or development workflow. The information reflects the current state as of the last update date.