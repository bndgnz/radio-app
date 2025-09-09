import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import styles from './menu.module.scss';
import { sanitizeText } from '@/src/utils/textSanitizer';

interface NavigationLink {
  _key?: string;
  _id?: string;
  linkText: string;
  linkType?: string;
  internalLink?: {
    slug?: {
      current: string;
    };
    _type?: string;
    title?: string;
  };
  externalUrl?: string;
  sublinks?: NavigationLink[];
}

interface MenuData {
  title?: string;
  logo?: any;
  links?: NavigationLink[];
  featuredButton?: any;
}


interface MenuProps {
  props?: any;
  item?: any;
  id?: any;
}

const Menu: React.FC<MenuProps> = ({ props, item, id }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isOverDropdown, setIsOverDropdown] = useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Get menu data from props or item - handle menuConfiguration structure
  const componentData = props || item || id;
  
  if (!componentData) {
    return <div>No menu data provided</div>;
  }

  // Extract menu data - work directly with menu content type
  let menuData: MenuData | null = null;
  let navigationLinks: NavigationLink[] = [];



  // Handle different data structures - expect direct menu data or resolved menu
  if (componentData.resolvedMenu && componentData.resolvedMenu.links) {
    // This is a resolved menu reference from content service
    menuData = componentData.resolvedMenu;
    navigationLinks = componentData.resolvedMenu.links || [];
  } else if (componentData.itemRef && componentData.itemRef.links) {
    // This is a resolved menu reference from content service (legacy)
    menuData = componentData.itemRef;
    navigationLinks = componentData.itemRef.links || [];
  } else if (componentData.links && Array.isArray(componentData.links)) {
    // This is direct menu data
    menuData = componentData as MenuData;
    navigationLinks = componentData.links;
  } else if (componentData.menuItems && Array.isArray(componentData.menuItems)) {
    // Alternative menuItems structure
    navigationLinks = componentData.menuItems;
  } else if (componentData.items && Array.isArray(componentData.items)) {
    // Alternative items structure
    navigationLinks = componentData.items;
  } else if (Array.isArray(componentData)) {
    // This is an array of navigation links
    navigationLinks = componentData;
  } else {
    // Check if itemRef is just a reference that wasn't resolved
    if (componentData.itemRef && componentData.itemRef._ref && !componentData.itemRef.links) {
      return (
        <div style={{ color: 'orange', padding: '10px', border: '1px solid orange' }}>
          Menu reference not resolved in query
          <br />
          <small>itemRef._ref: {componentData.itemRef._ref}</small>
          <br />
          <small>Check content-service.ts query resolution</small>
        </div>
      );
    }
    
    // Try to extract any array property that might contain links
    const possibleArrayKeys = Object.keys(componentData).filter(key => 
      Array.isArray(componentData[key])
    );
    
    if (possibleArrayKeys.length > 0) {
      // Try the first array we find
      navigationLinks = componentData[possibleArrayKeys[0]] || [];
    }
  }


  if (!navigationLinks || navigationLinks.length === 0) {
    return (
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        No navigation links available
        <br />
        <small>Debug: Check console for menu data structure</small>
      </div>
    );
  }


  // Helper function to get the URL for a navigation link
  const getNavigationLinkUrl = (item: NavigationLink): string => {
    // Handle external URLs
    if (item.linkType === 'external' && item.externalUrl) {
      return item.externalUrl;
    }
    
    // Handle internal links
    if (item.linkType === 'internal' && item.internalLink?.slug?.current) {
      const linkType = item.internalLink._type;
      if (linkType === 'shows' || linkType === 'show') {
        return `/shows/${item.internalLink.slug.current}`;
      } else if (linkType === 'landingPage') {
        return `/${item.internalLink.slug.current}`;
      }
      return `/${item.internalLink.slug.current}`;
    }
    
    // Fallback for legacy structure (no linkType)
    if (!item.linkType && item.internalLink?.slug?.current) {
      const linkType = item.internalLink._type;
      if (linkType === 'shows' || linkType === 'show') {
        return `/shows/${item.internalLink.slug.current}`;
      } else if (linkType === 'landingPage') {
        return `/${item.internalLink.slug.current}`;
      }
      return `/${item.internalLink.slug.current}`;
    }
    
    // For parent menu items or no link
    return '#';
  };

  // Toggle submenu visibility (for mobile)
  const toggleSubmenu = (key: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle menu item hover
  const handleMenuHover = (itemKey: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredItem(itemKey);
  };

  // Handle menu item leave
  const handleMenuLeave = () => {
    if (!isOverDropdown) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredItem(null);
      }, 200);
    }
  };

  // Handle dropdown hover
  const handleDropdownEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsOverDropdown(true);
  };

  // Handle dropdown leave
  const handleDropdownLeave = () => {
    setIsOverDropdown(false);
    setHoveredItem(null);
  };

  // Render navigation links recursively
  const renderNavigationLinks = (items: NavigationLink[], isSubmenu = false) => {
    return items.map((item, index) => {
      const itemKey = item._key || item._id || `nav-item-${index}`;
      const hasSublinks = item.sublinks && item.sublinks.length > 0;
      const isOpen = openSubmenus[itemKey]; // for mobile

      return (
        <li 
          key={itemKey} 
          className={`${styles.menuItem} ${hasSublinks ? styles.hasSubmenu : ''} ${isSubmenu ? styles.submenuItem : ''}`}
          onMouseEnter={() => hasSublinks && handleMenuHover(itemKey)}
          onMouseLeave={() => hasSublinks && handleMenuLeave()}
        >
          {hasSublinks ? (
            <>
              <button
                className={styles.menuLink}
                onClick={() => toggleSubmenu(itemKey)}
                aria-expanded={isOpen}
              >
                <span>{sanitizeText(item.linkText)}</span>
                <span className={`${styles.submenuIcon} ${isOpen ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              
            </>
          ) : (
            // Handle different link types
            item.linkType === 'external' && item.externalUrl ? (
              <a 
                href={item.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.menuLink}
              >
                {sanitizeText(item.linkText)}
              </a>
            ) : item.linkType === 'none' ? (
              <span className={`${styles.menuLink} ${styles.menuParent}`}>{sanitizeText(item.linkText)}</span>
            ) : (
              <Link href={getNavigationLinkUrl(item)}>
                <span className={styles.menuLink}>{sanitizeText(item.linkText)}</span>
              </Link>
            )
          )}
        </li>
      );
    });
  };


  // Get menu container classes
  const getMenuContainerClasses = () => {
    return styles.menuContainer;
  };

  return (
    <>
      <nav className={getMenuContainerClasses()}>
        <div className={styles.menuContent}>

          {/* Mobile menu toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>

          {/* Desktop and mobile menu */}
          <ul className={`${styles.menuList} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
            {renderNavigationLinks(navigationLinks)}
          </ul>

        </div>
      </nav>

      {/* Portal mega menu that doesn't affect layout */}
      {typeof window !== 'undefined' && hoveredItem && createPortal(
        <div 
          className={styles.megaMenuDropdown}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className={styles.megaMenuContainer}>
            {navigationLinks
              .find(item => (item._key || item._id || `nav-item-${navigationLinks.indexOf(item)}`) === hoveredItem)
              ?.sublinks?.map((sublink, subIndex) => (
                <a 
                  key={subIndex} 
                  href={getNavigationLinkUrl(sublink)}
                  className={styles.megaMenuLink}
                >
                  {sanitizeText(sublink.linkText)}
                </a>
              ))}
          </div>
        </div>,
        document.body
      )}

    </>
  );
};

export default Menu;