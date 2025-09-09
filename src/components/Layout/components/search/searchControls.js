import React, { useState, useEffect, useRef } from "react";
import { connectStats } from "react-instantsearch-dom";

// Stats component to show result count
const Stats = ({ nbHits, processingTimeMS, query }) => {
  if (!query || query.length < 3) return null;
  
  return (
    <div className="search-stats">
      <span>{nbHits} results found in {processingTimeMS}ms</span>
    </div>
  );
};

const ConnectedStats = connectStats(Stats);

function SearchControls({ onSortChange, onFilterChange, availableTypes = [] }) {
  const [currentSort, setCurrentSort] = useState('relevance'); // Track current sort type and direction
  const [selectedTypes, setSelectedTypes] = useState([]); // Track selected content types
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };

    if (showTypeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showTypeDropdown]);


  const handleNameToggle = () => {
    // Toggle between name_asc and name_desc
    let newSort;
    if (currentSort.startsWith('name')) {
      // If already sorting by name, toggle direction
      newSort = currentSort === 'name_asc' ? 'name_desc' : 'name_asc';
    } else {
      // If not sorting by name, start with A-Z
      newSort = 'name_asc';
    }
    console.log('Name toggle: currentSort=', currentSort, 'newSort=', newSort);
    setCurrentSort(newSort);
    if (onSortChange) {
      onSortChange(newSort);
    }
  };

  const handleTypeToggle = (contentType) => {
    let newSelectedTypes;
    if (selectedTypes.includes(contentType)) {
      newSelectedTypes = selectedTypes.filter(type => type !== contentType);
    } else {
      newSelectedTypes = [...selectedTypes, contentType];
    }
    setSelectedTypes(newSelectedTypes);
    if (onFilterChange) {
      onFilterChange(newSelectedTypes);
    }
  };

  const clearAllTypes = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTypes([]);
    if (onFilterChange) {
      onFilterChange([]);
    }
  };

  // Helper function to get content type info
  const getTypeInfo = (type) => {
    switch (type) {
      case 'shows': return { icon: '📺', label: 'Shows' };
      case 'staff': return { icon: '🎧', label: 'DJs' };
      case 'sponsor': return { icon: '🏢', label: 'Sponsors' };
      case 'landingPage': return { icon: '📄', label: 'Pages' };
      case 'amazonPodcast': return { icon: '🎙️', label: 'Podcasts' };
      case 'playlist': return { icon: '🎵', label: 'Playlists' };
      default: return { icon: '📄', label: type };
    }
  };

  return (
    <div className="search-controls">
      <div className="search-controls__stats">
        <ConnectedStats />
      </div>
      
      <div className="search-controls__main">
        {/* Filter and Sort Controls Side by Side */}
        <div className="controls-row">
          {/* Content Type Filter */}
          <div className="content-type-filter">
            <div className="type-filter-dropdown" ref={dropdownRef}>
              <button
                className={`type-filter-button ${selectedTypes.length > 0 ? 'active' : ''}`}
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                🏷️ Types {selectedTypes.length > 0 ? `(${selectedTypes.length})` : ''}
                <span className={`dropdown-arrow ${showTypeDropdown ? 'open' : ''}`}>▼</span>
              </button>
              
              {showTypeDropdown && (
                <div className="type-dropdown-menu">
                  <div className="dropdown-header">
                    <span>Select content types:</span>
                    <button 
                      type="button"
                      className="clear-all-btn" 
                      onClick={clearAllTypes}
                    >
                      Clear All
                    </button>
                  </div>
                  {availableTypes.map(type => {
                    const typeInfo = getTypeInfo(type);
                    return (
                      <label key={type} className="type-option">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span className="type-option-content">
                          <span className="type-icon">{typeInfo.icon}</span>
                          <span className="type-label">{typeInfo.label}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Title Sort Button */}
          <div className="title-sort">
            <button
              className={`sort-toggle-button ${currentSort.startsWith('name') ? 'active' : ''}`}
              onClick={handleNameToggle}
            >
              🔤 Title {currentSort === 'name_asc' ? '↓' : '↑'}
              <span className="sort-state">{currentSort === 'name_asc' ? 'A-Z' : 'Z-A'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchControls;