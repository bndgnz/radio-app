import React, { useState } from 'react';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram, 
  FaDiscord,
  FaGlobe
} from 'react-icons/fa';
import { SiTiktok, SiX } from 'react-icons/si';

interface SocialMediaIconsProps {
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
  website?: string;
  instagram?: string;
  discord?: string;
  showName?: string;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({
  facebook,
  twitter,
  tiktok,
  linkedin,
  website,
  instagram,
  discord,
  showName = "us",
}) => {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const socialLinks = [
    { url: facebook, Icon: FaFacebookF, name: 'Facebook', color: '#1877F2' },
    { url: twitter, Icon: SiX, name: 'X', color: '#000000' },
    { url: tiktok, Icon: SiTiktok, name: 'TikTok', color: '#000000' },
    { url: linkedin, Icon: FaLinkedinIn, name: 'LinkedIn', color: '#0A66C2' },
    { url: website, Icon: FaGlobe, name: 'Website', color: '#6C757D' },
    { url: instagram, Icon: FaInstagram, name: 'Instagram', color: '#E4405F' },
    { url: discord, Icon: FaDiscord, name: 'Discord', color: '#5865F2' },
  ];

  const hasAnySocial = socialLinks.some(link => link.url);

  if (!hasAnySocial) {
    return null;
  }

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: '20px',
    marginTop: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'visible',
  };

  const iconStyles = (color: string): React.CSSProperties => ({
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: `2px solid ${color}`,
    fontSize: '21px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  });

  const iconHoverStyles = (color: string): React.CSSProperties => ({
    background: 'white',
    color: color,
    transform: 'translateY(-4px) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
    borderColor: color,
  });

  const tooltipStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    zIndex: 9999,
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    pointerEvents: 'none',
  };

  const tooltipArrowStyles: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid rgba(0, 0, 0, 0.9)',
  };

  return (
    <div>
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#495057',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
      
      </div>
      <div style={containerStyles}>
        {socialLinks.map(({ url, Icon, name, color }, index) => {
          if (!url) return null;
          const iconKey = `${name}-${index}`;
          return (
            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
              {hoveredIcon === iconKey && (
                <div style={tooltipStyles}>
                  Follow {showName} on {name}
                  <div style={tooltipArrowStyles}></div>
                </div>
              )}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${name} page`}
                style={iconStyles(color)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, iconHoverStyles(color));
                  setHoveredIcon(iconKey);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, iconStyles(color));
                  setHoveredIcon(null);
                }}
              >
                {React.createElement(Icon as any)}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMediaIcons;