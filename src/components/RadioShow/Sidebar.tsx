import React from 'react';
import { FaRss } from 'react-icons/fa';
import AudioPlayer from './AudioPlayer';
import PresenterCard from './PresenterCard';
import { ShowInfo } from '../../types/radioShow';

interface SidebarProps {
  showInfo: ShowInfo;
}

const Sidebar: React.FC<SidebarProps> = ({ showInfo }) => {
  const { title, schedule, duration, presenters, audioUrl } = showInfo;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="show-header">
          <h1 className="show-title">{title}</h1>
          <div className="schedule-badge">
            <span>{schedule}</span>
            <FaRss className="rss-icon" />
          </div>
        </div>

        <AudioPlayer audioUrl={audioUrl} duration={duration} />

        <div className="presenters-section">
          <h2 className="section-title">Presenters</h2>
          <div className="presenters-list">
            {presenters.map((presenter) => (
              <PresenterCard 
                key={presenter.id} 
                presenter={presenter} 
                variant="mini" 
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sidebar {
          width: 300px;
          background: linear-gradient(135deg, #c53030 0%, #b91c1c 100%);
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
        }

        .sidebar-content {
          padding: 24px;
        }

        .show-header {
          margin-bottom: 24px;
        }

        .show-title {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin: 0 0 12px 0;
        }

        .schedule-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          color: white;
        }

        .rss-icon {
          font-size: 14px;
          opacity: 0.8;
        }

        .presenters-section {
          margin-top: 32px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin: 0 0 16px 0;
          opacity: 0.9;
        }

        .presenters-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Scrollbar styling */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }

          .sidebar-content {
            padding: 20px;
          }

          .show-title {
            font-size: 20px;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;