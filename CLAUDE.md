# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run go` - Start development server with debugging enabled
- `npm run build` - Build production application
- `npm start` - Run production server
- `npm run lint` - Run ESLint
- `npm run generate:types` - Generate TypeScript types from Contentful schema

Note: No test commands available - testing infrastructure not yet implemented.

## Architecture Overview

This is a Next.js 12 radio station website that uses Contentful as a headless CMS for content management. The application serves Waiheke Radio's web presence including shows, podcasts, schedules, and live streaming.

### Core Architecture

**Content Flow:**
1. Content editors create/modify content in Contentful CMS
2. Application fetches content via Apollo Client using Contentful's GraphQL API
3. Pages are statically generated at build time using `getStaticProps`
4. RSS feeds are generated during build for podcast distribution

**Component Layout System:**
The application uses a dynamic layout resolver (`src/utils/layoutResolver.tsx`) that maps Contentful content types to React components. Layouts are configured in Contentful and can include multiple columns with various content blocks.

**Key Services:**
- `src/utils/content-service.ts` - Centralized Contentful API interactions
- `src/utils/generateRSSFeed.js` - Individual show RSS feed generation
- `src/utils/generateAllRSSFeed.js` - Combined RSS feed for all podcasts

### Directory Structure

```
pages/
├── [slug].tsx              # Dynamic show pages
├── podcast/[slug].tsx      # Individual podcast pages
├── schedule.tsx            # Radio schedule
└── index.tsx              # Homepage

src/
├── components/Layout/      # All UI components organized by type
│   ├── Column/            # Layout columns
│   ├── ContentBlocks/     # Various content display blocks
│   └── Header/Footer/     # Site structure
├── utils/                 # Services and utilities
└── @types/               # Contentful TypeScript definitions
```

### Environment Variables

Required environment variables (set in `.env`):
- `CONTENTFUL_SPACE_ID` - Contentful space identifier
- `CONTENTFUL_ACCESS_TOKEN` - Content Delivery API token
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API token
- `CONTENTFUL_ENVIRONMENT` - Environment name (default: 'master')
- `CONTENTFUL_PREVIEW_SECRET` - Preview mode secret
- `ALGOLIA_APP_ID` - Algolia search app ID
- `ALGOLIA_API_KEY` - Algolia search API key
- `GOOGLE_CLIENT_ID` - Google Drive integration
- `GOOGLE_CLIENT_SECRET` - Google Drive secret
- `GOOGLE_REFRESH_TOKEN` - Google API refresh token

### Content Types

Primary Contentful content types:
- `show` - Radio show information
- `podcast` - Individual podcast episodes
- `landingPage` - Dynamic landing pages with configurable layouts
- `staff` - Team member profiles
- `playlist` - Music playlists
- `schedule` - Radio schedule entries

### RSS Feed Generation

RSS feeds are generated at build time and stored in `public/`:
- Individual show feeds: `public/[showSlug].xml`
- Combined feed: `public/all.xml`

To regenerate RSS feeds after content changes:
1. Trigger a new build (feeds generate automatically)
2. Or manually run the build process

### Common Development Tasks

**Adding a new component:**
1. Create component in appropriate `src/components/Layout/` subdirectory
2. Add Contentful mapping in `src/utils/layoutResolver.tsx` if it's a content block
3. Generate types if new Contentful fields: `npm run generate:types`

**Modifying RSS feed structure:**
- Edit `src/utils/generateRSSFeed.js` for individual show feeds
- Edit `src/utils/generateAllRSSFeed.js` for the combined feed
- iTunes namespace modifications in the `namespaces` object

**Working with Contentful Live Preview:**
- Preview mode is enabled via API route `/api/preview`
- Exit preview via `/api/exit-preview`
- Preview components handle draft content automatically

### Important Considerations

- The application uses Next.js 12 (not the latest version) - be aware of version-specific APIs
- Apollo Client is configured for Contentful's GraphQL endpoint
- Static generation means content updates require rebuilds
- RSS feeds must maintain iTunes compatibility for podcast distribution
- Security headers are configured in `next.config.js`
- No testing infrastructure currently exists - manual testing required