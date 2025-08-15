import React from 'react';
import PresenterCard from './PresenterCard';
import { ShowInfo } from '../../types/radioShow';

interface MainContentProps {
  showInfo: ShowInfo;
}

const MainContent: React.FC<MainContentProps> = ({ showInfo }) => {
  const { about, sponsor, presenters } = showInfo;

  return (
    <main className="main-content">
      <div className="content-wrapper">
        <section className="about-section">
          <h2 className="section-heading">About the Show</h2>
          <div className="content-card">
            <p className="about-text">{about}</p>
          </div>
        </section>

        <section className="presenters-section">
          <h2 className="section-heading">Meet the Presenters</h2>
          <div className="presenters-grid">
            {presenters.map((presenter) => (
              <PresenterCard 
                key={presenter.id} 
                presenter={presenter} 
                variant="detailed" 
              />
            ))}
          </div>
        </section>

        <section className="sponsor-section">
          <h2 className="section-heading">Sponsor</h2>
          <div className="content-card sponsor-card">
            <p className="sponsor-text">{sponsor}</p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .main-content {
          flex: 1;
          background: #f8f9fa;
          min-height: 100vh;
          overflow-y: auto;
        }

        .content-wrapper {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-heading {
          font-size: 20px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 20px 0;
        }

        .about-section,
        .presenters-section,
        .sponsor-section {
          margin-bottom: 40px;
        }

        .content-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .about-text {
          font-size: 15px;
          line-height: 1.6;
          color: #666666;
          margin: 0;
        }

        .presenters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .sponsor-card {
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border: 1px solid #feb2b2;
        }

        .sponsor-text {
          font-size: 16px;
          font-weight: 500;
          color: #c53030;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            padding: 24px;
          }

          .presenters-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 20px;
          }

          .section-heading {
            font-size: 18px;
            margin-bottom: 16px;
          }

          .content-card {
            padding: 20px;
          }

          .about-section,
          .presenters-section,
          .sponsor-section {
            margin-bottom: 32px;
          }
        }
      `}</style>
    </main>
  );
};

export default MainContent;