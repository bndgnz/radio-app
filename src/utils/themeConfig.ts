// Theme configuration with CSS variables
export const themes = {
  'coral-reef': {
    primary: '#ff6b6b',
    secondary: '#ffa726',
    accent: '#a7f3d0',
    text: '#f0fdfa',
    background: 'linear-gradient(rgba(13, 79, 92, 0.7), rgba(45, 138, 143, 0.6)), url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'tropical-sunset': {
    primary: '#ffc107',
    secondary: '#ff7043',
    accent: '#ffecb3',
    text: '#fff5f0',
    background: 'linear-gradient(rgba(45, 27, 105, 0.8), rgba(123, 45, 58, 0.7)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80")'
  },
  'palm-grove': {
    primary: '#84cc16',
    secondary: '#65a30d',
    accent: '#d9f99d',
    text: '#fef3c7',
    background: 'linear-gradient(rgba(45, 80, 22, 0.75), rgba(77, 124, 15, 0.65)), url("https://images.unsplash.com/photo-1520637836862-4d197d17c38a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80")'
  },
  'ocean-breeze': {
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#bae6fd',
    text: '#f8fafc',
    background: 'linear-gradient(rgba(15, 118, 110, 0.7), rgba(14, 165, 233, 0.6)), url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'hibiscus-garden': {
    primary: '#ec4899',
    secondary: '#d946ef',
    accent: '#f9a8d4',
    text: '#fdf2f8',
    background: 'linear-gradient(rgba(124, 45, 18, 0.8), rgba(190, 24, 93, 0.7)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'coconut-beach': {
    primary: '#d2691e',
    secondary: '#6ee7b7',
    accent: '#fef3c7',
    text: '#fffbeb',
    background: 'linear-gradient(rgba(120, 53, 15, 0.75), rgba(161, 98, 7, 0.65)), url("https://images.unsplash.com/photo-1473116763249-2faaef81ccda?ixlib=rb-4.0.3&auto=format&fit=crop&w=2096&q=80")'
  },
  'rainforest-canopy': {
    primary: '#22c55e',
    secondary: '#f59e0b',
    accent: '#bbf7d0',
    text: '#f7fee7',
    background: 'linear-gradient(rgba(26, 46, 5, 0.8), rgba(77, 124, 15, 0.7)), url("https://images.unsplash.com/photo-1544896478-d5c7be6e5e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'island-spice': {
    primary: '#b91c1c',
    secondary: '#fb923c',
    accent: '#fecaca',
    text: '#fef2f2',
    background: 'linear-gradient(rgba(127, 29, 29, 0.8), rgba(220, 38, 38, 0.7)), url("https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'lagoon-dream': {
    primary: '#06b6d4',
    secondary: '#a78bfa',
    accent: '#bae6fd',
    text: '#f0f9ff',
    background: 'linear-gradient(rgba(22, 78, 99, 0.75), rgba(14, 165, 233, 0.65)), url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  },
  'tropical-fruit': {
    primary: '#f97316',
    secondary: '#65a30d',
    accent: '#fed7aa',
    text: '#fff7ed',
    background: 'linear-gradient(rgba(154, 52, 18, 0.8), rgba(234, 88, 12, 0.7)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
  }
};

export function applyTheme(themeSlug: string) {
  const theme = themes[themeSlug as keyof typeof themes];
  if (!theme) return;

  // Apply CSS custom properties to document root
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-background', theme.background);
  
  // Apply body styles
  document.body.style.background = `${theme.background} center/cover fixed`;
  document.body.style.color = theme.text;
}