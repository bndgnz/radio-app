import React from 'react';
import { Presenter, PresenterCardVariant } from '../../types/radioShow';

interface PresenterCardProps {
  presenter: Presenter;
  variant?: PresenterCardVariant;
}

const PresenterCard: React.FC<PresenterCardProps> = ({ presenter, variant = 'detailed' }) => {
  const { name, role, description, avatar } = presenter;

  if (variant === 'mini') {
    return (
      <div className="presenter-card-mini">
        <img 
          src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fff&color=c53030`} 
          alt={name}
          className="avatar-mini"
        />
        <div className="info-mini">
          <h4 className="name-mini">{name}</h4>
          <p className="role-mini">{role}</p>
        </div>

        <style jsx>{`
          .presenter-card-mini {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .presenter-card-mini:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateX(4px);
          }

          .avatar-mini {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 255, 255, 0.3);
          }

          .info-mini {
            flex: 1;
          }

          .name-mini {
            font-size: 14px;
            font-weight: 600;
            color: white;
            margin: 0 0 2px 0;
          }

          .role-mini {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="presenter-card">
      <div className="presenter-header">
        <img 
          src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=c53030&color=fff`} 
          alt={name}
          className="avatar"
        />
        <div className="presenter-info">
          <h3 className="name">{name}</h3>
          <p className="role">{role}</p>
        </div>
      </div>
      <p className="description">{description}</p>

      <style jsx>{`
        .presenter-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }

        .presenter-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .presenter-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #f8f9fa;
        }

        .presenter-info {
          flex: 1;
        }

        .name {
          font-size: 18px;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 4px 0;
        }

        .role {
          font-size: 14px;
          color: #666666;
          margin: 0;
        }

        .description {
          font-size: 14px;
          line-height: 1.5;
          color: #666666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .presenter-card {
            padding: 16px;
          }

          .avatar {
            width: 50px;
            height: 50px;
          }

          .name {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default PresenterCard;