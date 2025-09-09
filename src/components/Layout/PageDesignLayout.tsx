import React, { useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import SecondaryHero from './components/secondary';
import Components from './components/index';
import TopMenu from './header/topmenu';
import { applyTheme } from '../../utils/themeConfig';
import { sanitizeTextAlign, sanitizeColumnSize } from '../../utils/security';

interface PageDesignLayoutProps {
  pageDesign?: any;
  theme?: any;
  title?: string;
  image?: string;
  teReoTitle?: string;
  components?: any[];
  introduction?: string;
  content?: any;
  showBanner?: boolean;
  showIntroduction?: boolean;
  showContent?: boolean;
  menuData?: any;
  pageLayout?: any;
  allProps?: any;
}

const PageDesignLayout: React.FC<PageDesignLayoutProps> = ({
  pageDesign,
  theme,
  title,
  image,
  teReoTitle,
  components,
  introduction,
  content,
  showBanner,
  showIntroduction,
  showContent,
  menuData,
  pageLayout,
  allProps
}) => {
  // Debug logging for pageLayout (Bootstrap Layout Designer) - only if data exists
  if (pageLayout) {
    console.log('PageDesignLayout - pageLayout data:', pageLayout);
    if (pageLayout.rows) {
      console.log('PageDesignLayout - pageLayout rows:', pageLayout.rows);
      pageLayout.rows.forEach((row: any, rowIndex: number) => {
        console.log(`PageDesignLayout - Row ${rowIndex}:`, row);
        if (row.columns) {
          row.columns.forEach((col: any, colIndex: number) => {
            console.log(`PageDesignLayout - Row ${rowIndex} Column ${colIndex}:`, {
              id: col.id,
              size: col.size,
              componentPlaceholder: col.componentPlaceholder,
              components: col.components
            });
          });
        }
      });
    }
  }
  // Apply theme class and CSS variables if theme is selected
  const themeClass = theme?.slug?.current ? `${theme.slug.current}-theme` : '';
  
  useEffect(() => {
    // Apply theme CSS variables when theme changes
    if (theme?.slug?.current) {
      applyTheme(theme.slug.current);
    }
    
    // Apply background image from landing page or theme
    const backgroundImageUrl = image || theme?.cloudinaryImage?.secure_url;
    
    if (backgroundImageUrl) {
      // Get the gradient colors from the theme configuration
      const themeSlug = theme?.slug?.current;
      let gradientOverlay = 'linear-gradient(rgba(13, 79, 92, 0.7), rgba(45, 138, 143, 0.6))'; // fallback
      
      // Define theme-specific gradients
      const themeGradients = {
        'island-spice': 'linear-gradient(rgba(127, 29, 29, 0.8), rgba(220, 38, 38, 0.7))',
        'coral-reef': 'linear-gradient(rgba(13, 79, 92, 0.7), rgba(45, 138, 143, 0.6))',
        'tropical-sunset': 'linear-gradient(rgba(45, 27, 105, 0.8), rgba(123, 45, 58, 0.7))',
        'palm-grove': 'linear-gradient(rgba(45, 80, 22, 0.75), rgba(77, 124, 15, 0.65))',
        'ocean-breeze': 'linear-gradient(rgba(15, 118, 110, 0.7), rgba(14, 165, 233, 0.6))',
        'hibiscus-garden': 'linear-gradient(rgba(124, 45, 18, 0.8), rgba(190, 24, 93, 0.7))',
        'coconut-beach': 'linear-gradient(rgba(120, 53, 15, 0.75), rgba(161, 98, 7, 0.65))',
        'rainforest-canopy': 'linear-gradient(rgba(26, 46, 5, 0.8), rgba(77, 124, 15, 0.7))',
        'lagoon-dream': 'linear-gradient(rgba(22, 78, 99, 0.75), rgba(14, 165, 233, 0.65))',
        'tropical-fruit': 'linear-gradient(rgba(154, 52, 18, 0.8), rgba(234, 88, 12, 0.7))'
      };
      
      if (themeSlug && themeGradients[themeSlug as keyof typeof themeGradients]) {
        gradientOverlay = themeGradients[themeSlug as keyof typeof themeGradients];
      }
      
      console.log('PageDesignLayout - Setting background image:', {
        imageSource: image ? 'landing page' : 'theme',
        backgroundImageUrl,
        themeSlug,
        gradientOverlay
      });
      
      const backgroundValue = `${gradientOverlay}, url('${backgroundImageUrl}')`;
      document.documentElement.style.setProperty(
        '--theme-background-image', 
        backgroundValue
      );
    }
  }, [theme, image]);
  

  // Helper function to render layout rows
  const renderLayoutRows = (layoutData: any, sectionId: string) => {
    if (!layoutData?.rows || layoutData.rows.length === 0) {
      return null;
    }

    return layoutData.rows.map((row: any, rowIndex: number) => (
      <div 
        key={row.id || row._key || rowIndex} 
        className="row"
      >
        {row.columns?.map((column: any, colIndex: number) => {
          // SECURITY: Use centralized sanitization functions
          const desktopCols = column.size ? sanitizeColumnSize(column.size) : Math.floor(12 / row.columns.length);
          const textAlignClass = column.textAlign ? `text-align-${sanitizeTextAlign(column.textAlign)}` : '';
          
          return (
            <div 
              key={column.id || column._key || colIndex}
              className={`col-12 col-md-${desktopCols} theme-column-${colIndex} ${textAlignClass}`}
            >
              {/* Render components if they exist */}
              {column.components && column.components.length > 0 ? (
                column.components.map((component: any, compIndex: number) => {
                  const componentType = component._type || component.contentType || component.type;
                  
                  console.log('PageDesignLayout - Component debug:', {
                    component,
                    componentType,
                    _type: component._type,
                    contentType: component.contentType,
                    type: component.type
                  });
                  
                  return (
                    <div key={component._id || component._key || compIndex} className={`column-component component-${componentType || 'unknown'}`}>
                      <Components
                        id={componentType}
                        item={component}
                      />
                    </div>
                  );
                })
              ) : (
                /* Empty column when no components */
                <div className="empty-column">
                  <p>{column.componentPlaceholder || `Empty ${sectionId} Column ${colIndex + 1}`}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    ));
  };

  
  return (
    <div className={`theme-page-layout ${themeClass}`}>
      {/* Dynamic Header from Page Design */}
      {pageDesign?.header && pageDesign.header.rows && pageDesign.header.rows.length > 0 ? (
        <div className="container-fluid" id="header-row">
          {renderLayoutRows(pageDesign.header, 'Header')}
        </div>
      ) : null}

      {/* Main Content - Use pageLayout rows and columns from Bootstrap Layout Designer */}
      <div className="container-fluid" id="main-content-row">
        {pageLayout?.rows && pageLayout.rows.length > 0 ? (
          // Render rows and columns from Bootstrap Layout Designer
          pageLayout.rows.map((row: any, rowIndex: number) => (
            <div 
              key={row.id || rowIndex} 
              className="row"
            >
              {row.columns?.map((column: any, colIndex: number) => {
                // SECURITY: Use centralized sanitization functions
                const desktopCols = column.size ? sanitizeColumnSize(column.size) : 4;
                console.log(`PageDesignLayout - Row ${rowIndex} Column ${colIndex}:`, {
                  id: column.id,
                  size: column.size,
                  componentPlaceholder: column.componentPlaceholder,
                  components: column.components
                });
                
                return (
                  <div 
                    key={column.id || colIndex}
                    className={`col-12 col-lg-${desktopCols} theme-column-${colIndex}`}
                  >
                    {/* Render components if they exist */}
                    {column.components && column.components.length > 0 ? (
                      column.components.map((component: any, compIndex: number) => {
                        const componentType = component._type || component.contentType || component.type;
                        console.log('PageDesignLayout - Rendering component:', { 
                          componentType, 
                          component,
                          hasItemRef: !!component.itemRef,
                          itemRefType: component.itemRef?._type
                        });
                        
                        if (componentType === 'menu' || component.contentType === 'menu') {
                          console.log('PageDesignLayout - Found menu component, data:', component);
                        }
                        
                        return (
                          <div key={component._id || component._key || component.id || compIndex} className={`column-component component-${componentType || 'unknown'}`}>
                            <Components
                              id={componentType}
                              item={component}
                            />
                          </div>
                        );
                      })
                    ) : (
                      /* Show placeholder if no components */
                      <div className="empty-column">
                        <p>{column.componentPlaceholder || `Column ${colIndex + 1}`}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : null}
      </div>

      {/* Dynamic Footer from Page Design */}
      {pageDesign?.footer && (
        <div className="container-fluid" id="footer-row">
          {renderLayoutRows(pageDesign.footer, 'Footer')}
        </div>
      )}
    </div>
  );
};

export default PageDesignLayout;