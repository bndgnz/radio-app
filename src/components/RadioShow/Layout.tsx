import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { ShowInfo } from '../../types/radioShow';

interface LayoutProps {
  showInfo: ShowInfo;
}

const Layout: React.FC<LayoutProps> = ({ showInfo }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="radio-page">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (FaTimes as any)({}) : (FaBars as any)({})}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <Sidebar showInfo={showInfo} />
      </div>

      {/* Main Content */}
      <MainContent showInfo={showInfo} />

      <style jsx>{`
        .radio-page {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        .mobile-menu-button {
          display: none;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1002;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #c53030;
          border: none;
          color: white;
          font-size: 20px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .mobile-menu-button:hover {
          background: #b91c1c;
          transform: scale(1.05);
        }

        .mobile-menu-button:active {
          transform: scale(0.95);
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .sidebar-wrapper {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .radio-page {
            flex-direction: column;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-overlay {
            display: block;
          }

          .sidebar-wrapper {
            position: fixed;
            top: 0;
            left: -100%;
            width: 280px;
            height: 100vh;
            z-index: 1000;
            transition: left 0.3s ease;
          }

          .sidebar-wrapper.open {
            left: 0;
          }

          .sidebar-wrapper :global(.sidebar) {
            width: 100%;
            height: 100vh;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .sidebar-wrapper :global(.sidebar) {
            width: 250px;
          }
        }
      `}</style>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Accessibility */
        *:focus {
          outline: 2px solid #c53030;
          outline-offset: 2px;
        }

        button:focus {
          outline-offset: 0;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent body scroll when mobile menu is open */
        @media (max-width: 768px) {
          body.menu-open {
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;