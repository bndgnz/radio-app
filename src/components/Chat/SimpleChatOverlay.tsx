import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  clientId: string;
}

interface SimpleChatOverlayProps {
  showSlug: string;
  isVisible: boolean;
  onToggle: () => void;
}

const SimpleChatOverlay: React.FC<SimpleChatOverlayProps> = ({ 
  showSlug, 
  isVisible, 
  onToggle 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // Simplified for now
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientId = useRef(`user-${Math.random().toString(36).substr(2, 9)}`);

  // Session storage keys
  const STORAGE_KEYS = {
    username: `chat_username_${showSlug}`,
    isUsernameSet: `chat_username_set_${showSlug}`,
    messages: `chat_messages_${showSlug}`,
    clientId: `chat_client_id_${showSlug}`
  };

  // Load persisted data from session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load username and username set status
    const savedUsername = sessionStorage.getItem(STORAGE_KEYS.username);
    const savedIsUsernameSet = sessionStorage.getItem(STORAGE_KEYS.isUsernameSet);
    const savedClientId = sessionStorage.getItem(STORAGE_KEYS.clientId);
    const savedMessages = sessionStorage.getItem(STORAGE_KEYS.messages);

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedIsUsernameSet === 'true') {
      setIsUsernameSet(true);
    }

    if (savedClientId) {
      clientId.current = savedClientId;
    } else {
      // Save the generated client ID for consistency
      sessionStorage.setItem(STORAGE_KEYS.clientId, clientId.current);
    }

    if (savedMessages) {
      try {
        const parsedMessages: ChatMessage[] = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
        return; // Skip demo messages if we have saved ones
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }

    // Only load demo messages if no saved messages exist
    const demoMessages: ChatMessage[] = [
      {
        id: '1',
        username: 'RadioFan',
        message: 'Great show! Love this music 🎵',
        timestamp: new Date(Date.now() - 300000),
        clientId: 'demo-user-1',
      },
      {
        id: '2',
        username: 'IslandLife',
        message: 'Thanks for playing my request!',
        timestamp: new Date(Date.now() - 120000),
        clientId: 'demo-user-2',
      },
    ];
    setMessages(demoMessages);
  }, [showSlug]);

  // Save username to session storage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (username) {
      sessionStorage.setItem(STORAGE_KEYS.username, username);
    }
  }, [username, showSlug]);

  // Save username set status to session storage when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(STORAGE_KEYS.isUsernameSet, isUsernameSet.toString());
  }, [isUsernameSet, showSlug]);

  // Save messages to session storage when they change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length > 0) {
      sessionStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
    }
  }, [messages, showSlug]);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !username.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      username: username.trim(),
      message: newMessage.trim(),
      timestamp: new Date(),
      clientId: clientId.current,
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      setIsUsernameSet(true);
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isVisible) {
    return (
      <div className="chat-toggle">
        <button onClick={onToggle} className="chat-toggle-btn">
          {(FaComments as any)({})}
          <span>Live Chat</span>
        </button>
        
        <style jsx>{`
          .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
          }

          .chat-toggle-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
            transition: all 0.3s ease;
            font-weight: 600;
          }

          .chat-toggle-btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-title">
            {(FaComments as any)({})}
            <span>Live Chat - {showSlug}</span>
            <div className="connection-status">
              ● {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
          <button onClick={onToggle} className="close-btn">
            {(FaTimes as any)({})}
          </button>
        </div>

        {/* Username Setup */}
        {!isUsernameSet && (
          <div className="username-setup">
            <h3>Join the chat</h3>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="username-input"
                autoFocus
              />
              <button type="submit" disabled={username.trim().length < 2}>
                Join Chat
              </button>
            </form>
          </div>
        )}

        {/* Chat Messages */}
        {isUsernameSet && (
          <>
            <div className="messages-container">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`message ${msg.clientId === clientId.current ? 'own-message' : ''}`}
                >
                  <div className="message-header">
                    {(FaUser as any)({ className: "user-icon" })}
                    <span className="username">{msg.username}</span>
                    <span className="timestamp">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <form onSubmit={handleMessageSubmit} className="message-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={500}
                  className="message-input"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="send-btn"
                >
                  {(FaPaperPlane as any)({})}
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .chat-overlay {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          border: 1px solid #e1e5e9;
        }

        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #007bff;
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
        }

        .connection-status {
          font-size: 12px;
          margin-left: 8px;
          color: #90EE90;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
        }

        .username-setup {
          padding: 24px;
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .username-setup h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .username-setup form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .username-input {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          outline: none;
        }

        .username-setup button {
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          background: #f8f9fa;
        }

        .message {
          margin-bottom: 12px;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
        }

        .message.own-message {
          background: #e3f2fd;
          margin-left: 20px;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .user-icon {
          color: #666;
        }

        .username {
          font-weight: 600;
          color: #007bff;
        }

        .timestamp {
          color: #666;
          margin-left: auto;
        }

        .message-content {
          font-size: 14px;
          line-height: 1.4;
        }

        .message-input-container {
          padding: 12px;
          border-top: 1px solid #e1e5e9;
          background: white;
          border-radius: 0 0 12px 12px;
        }

        .message-form {
          display: flex;
          gap: 8px;
        }

        .message-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e1e5e9;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SimpleChatOverlay;