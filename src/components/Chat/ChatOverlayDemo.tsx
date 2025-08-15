import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  clientId: string;
}

interface ChatOverlayDemoProps {
  showSlug: string;
  isVisible: boolean;
  onToggle: () => void;
}

const ChatOverlayDemo: React.FC<ChatOverlayDemoProps> = ({ showSlug, isVisible, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected] = useState(true); // Demo mode always connected
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState(3); // Demo online count
  const [messageReactions, setMessageReactions] = useState<Record<string, Array<{emoji: string, count: number}>>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientId = useRef(`demo-user-${Math.random().toString(36).substr(2, 9)}`);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

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
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        clientId: 'demo-user-1',
      },
      {
        id: '2',
        username: 'IslandLife',
        message: 'Thanks for playing my request!',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        clientId: 'demo-user-2',
      },
      {
        id: '3',
        username: 'MusicLover',
        message: 'What was that last song? It was amazing!',
        timestamp: new Date(Date.now() - 60000), // 1 minute ago
        clientId: 'demo-user-3',
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
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

    // Simulate other users responding
    if (Math.random() > 0.7) {
      // Show someone typing first
      const typingUser = ['ChatBot', 'DemoUser', 'TestUser'][Math.floor(Math.random() * 3)];
      setTypingUsers(prev => [...prev, typingUser]);
      
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(user => user !== typingUser));
        
        const responses = [
          'Nice one!',
          'Agreed! 👍',
          'Great point!',
          'Love it!',
          'Same here!',
        ];
        const randomResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          username: typingUser,
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          clientId: 'demo-bot',
        };
        setMessages(prev => [...prev, randomResponse]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    // Demo typing simulation
    if (value.trim()) {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      typingTimeout.current = setTimeout(() => {
        // Simulate stopping typing in demo
      }, 3000);
    }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isVisible) {
    return (
      <div className="chat-toggle">
        <button onClick={onToggle} className="chat-toggle-btn">
          <FaComments />
          <span>Live Chat (Demo)</span>
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
            background: #28a745;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
            transition: all 0.3s ease;
            font-weight: 600;
          }

          .chat-toggle-btn:hover {
            background: #218838;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
          }

          @media (max-width: 768px) {
            .chat-toggle {
              bottom: 80px;
              right: 15px;
            }
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
            <FaComments />
            <span>Live Chat (Demo)</span>
            <div className="connection-status connected">
              ● Demo Mode
            </div>
          </div>
          <button onClick={onToggle} className="close-btn">
            <FaTimes />
          </button>
        </div>

        {/* Username Setup */}
        {!isUsernameSet && (
          <div className="username-setup">
            <h3>Join the chat demo</h3>
            <p>This is a demo of the live chat functionality</p>
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
                Join Demo Chat
              </button>
            </form>
          </div>
        )}

        {/* Chat Messages */}
        {isUsernameSet && (
          <>
            <div className="messages-container">
              {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const showDate = !prevMsg || 
                  formatDate(msg.timestamp) !== formatDate(prevMsg.timestamp);
                
                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="date-separator">
                        {formatDate(msg.timestamp)}
                      </div>
                    )}
                    <div 
                      className={`message ${msg.clientId === clientId.current ? 'own-message' : ''}`}
                    >
                      <div className="message-header">
                        <FaUser className="user-icon" />
                        <span className="username">{msg.username}</span>
                        <span className="timestamp">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  </div>
                );
              })}
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
                  <FaPaperPlane />
                </button>
              </form>
              <div className="chat-info">
                Demo mode • Show: {showSlug} • {messages.length} messages
              </div>
            </div>
          </>
        )}
      </div>

      {/* Same styles as original ChatOverlay */}
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
          background: #28a745;
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .chat-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
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
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
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
          margin: 0 0 8px 0;
          color: #333;
        }

        .username-setup p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
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
          transition: border-color 0.2s;
        }

        .username-input:focus {
          border-color: #28a745;
        }

        .username-setup button {
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .username-setup button:hover:not(:disabled) {
          background: #218838;
        }

        .username-setup button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          background: #f8f9fa;
        }

        .date-separator {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin: 16px 0 8px 0;
          padding: 4px 8px;
          background: white;
          border-radius: 12px;
          display: inline-block;
          width: 100%;
        }

        .message {
          margin-bottom: 12px;
          padding: 8px 12px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message.own-message {
          background: #e8f5e8;
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
          color: #28a745;
        }

        .timestamp {
          color: #666;
          margin-left: auto;
        }

        .message-content {
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
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
          margin-bottom: 8px;
        }

        .message-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e1e5e9;
          border-radius: 20px;
          outline: none;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: #28a745;
        }

        .send-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #28a745;
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #218838;
        }

        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .chat-info {
          font-size: 11px;
          color: #666;
          text-align: center;
        }

        @media (max-width: 768px) {
          .chat-overlay {
            bottom: 10px;
            right: 10px;
            left: 10px;
            width: auto;
            height: 400px;
          }
        }

        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
};

export default ChatOverlayDemo;