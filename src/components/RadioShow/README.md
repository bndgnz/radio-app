# Radio Show Page Components

A modern, responsive radio show page implementation with sidebar layout for displaying show information, audio player, and presenter details.

## 🎯 Access the Demo

Visit: http://localhost:3002/radio-show-demo

## 📦 Components

### Layout
Main container component that orchestrates the sidebar and main content layout.

### Sidebar
- Red gradient background
- Show title and schedule
- Integrated audio player
- Presenter mini-cards
- Sticky positioning on desktop
- Mobile responsive with hamburger menu

### MainContent
- About the show section
- Detailed presenter cards
- Sponsor information
- Responsive grid layout

### AudioPlayer
- Play/pause functionality
- Progress bar with seek control
- Time display
- Glassmorphism effect
- Fully accessible controls

### PresenterCard
- Two variants: "mini" and "detailed"
- Avatar display with fallback
- Hover effects
- Responsive design

## 🎨 Design Features

- **Color Palette**: Red gradient (#c53030 to #b91c1c) with gray accents
- **Typography**: Inter font family for modern look
- **Responsive**: Mobile-first approach with breakpoints at 768px and 1024px
- **Accessibility**: ARIA labels, keyboard navigation, focus states
- **Animations**: Smooth transitions (0.2s ease) on all interactive elements

## 📱 Responsive Behavior

### Mobile (< 768px)
- Sidebar becomes slide-out menu
- Hamburger menu button
- Stacked content layout
- Touch-friendly controls (44px minimum)

### Tablet (768px - 1024px)
- Narrower sidebar (250px)
- Side-by-side layout

### Desktop (> 1024px)
- Full sidebar (300px)
- Optimal spacing and sizing

## 🚀 Usage

```tsx
import { Layout } from '../src/components/RadioShow';
import { islandLifeShow } from '../src/data/showData';

function RadioShowPage() {
  return <Layout showInfo={islandLifeShow} />;
}
```

## 📝 Data Structure

```typescript
interface ShowInfo {
  title: string;
  schedule: string;
  duration: string;
  about: string;
  sponsor: string;
  presenters: Presenter[];
  audioUrl?: string;
}
```

## 🎯 Key Features

1. **Functional Audio Player** - Can be connected to real audio streams
2. **Dynamic Content** - Easy to update with different show data
3. **Modular Components** - Reusable across different pages
4. **Performance Optimized** - Efficient re-renders and smooth animations
5. **Production Ready** - Clean code, proper TypeScript types, accessibility compliant

## 🔧 Customization

To customize for different shows:
1. Update data in `src/data/showData.ts`
2. Modify color scheme in component style sections
3. Adjust responsive breakpoints as needed

## 📚 File Structure

```
src/components/RadioShow/
├── Layout.tsx        # Main layout container
├── Sidebar.tsx       # Sidebar with player
├── MainContent.tsx   # Main content area
├── AudioPlayer.tsx   # Audio player controls
├── PresenterCard.tsx # Presenter display
└── index.ts         # Component exports
```