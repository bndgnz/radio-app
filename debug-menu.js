// Simple debug script to test menu loading directly from browser
console.log('Starting menu debug...');

// Test the ContentService directly
import('@/src/utils/content-service').then(async (module) => {
  console.log('ContentService module loaded');
  const ContentService = module.default;
  const contentService = ContentService.instance;
  
  try {
    console.log('Calling getMenuData...');
    const menuData = await contentService.getMenuData();
    console.log('Menu data received:', menuData);
  } catch (error) {
    console.error('Error getting menu data:', error);
  }
}).catch(error => {
  console.error('Error importing ContentService:', error);
});