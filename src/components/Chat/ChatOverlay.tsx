import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import Ably from 'ably';
import ChatOverlayDemo from './ChatOverlayDemo';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  clientId: string;
}

interface TypingUser {
  clientId: string;
  username: string;
  timestamp: number;
}

interface PresenceUser {
  clientId: string;
  username: string;
  joinedAt: Date;
}

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  userReacted: boolean;
}

interface ReactionEvent {
  messageId: string;
  emoji: string;
  username: string;
  clientId: string;
  action: 'add' | 'remove';
}

interface ChatOverlayProps {
  showSlug: string;
  isVisible: boolean;
  onToggle: () => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ showSlug, isVisible, onToggle }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [channelAccessDenied, setChannelAccessDenied] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, MessageReaction[]>>({});
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  
  const ablyClient = useRef<Ably.Realtime | null>(null);
  const channel = useRef<Ably.RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    const savedMessages = sessionStorage.getItem(STORAGE_KEYS.messages);

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedIsUsernameSet === 'true') {
      setIsUsernameSet(true);
    }

    if (savedMessages) {
      try {
        const parsedMessages: ChatMessage[] = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
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

  // Initialize Ably connection
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    console.log('Ably API Key check:', apiKey ? 'Key found' : 'Key missing');
    
    if (!apiKey) {
      console.error('Ably API key not found in environment variables');
      return;
    }

    try {
      console.log('Initializing Ably connection...');
      
      // Get or create persistent client ID
      let persistentClientId = sessionStorage.getItem(STORAGE_KEYS.clientId);
      if (!persistentClientId) {
        persistentClientId = `user-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(STORAGE_KEYS.clientId, persistentClientId);
      }

      ablyClient.current = new Ably.Realtime({
        key: apiKey,
        clientId: persistentClientId,
        autoConnect: true,
        disconnectedRetryTimeout: 15000,
        suspendedRetryTimeout: 30000,
      });

      ablyClient.current.connection.on('connected', () => {
        setIsConnected(true);
        console.log('✅ Connected to Ably successfully');
      });

      ablyClient.current.connection.on('connecting', () => {
        console.log('🔄 Connecting to Ably...');
      });

      ablyClient.current.connection.on('disconnected', () => {
        setIsConnected(false);
        console.log('❌ Disconnected from Ably');
      });

      ablyClient.current.connection.on('suspended', () => {
        setIsConnected(false);
        console.log('⏸️ Ably connection suspended');
      });

      ablyClient.current.connection.on('failed', (err) => {
        setIsConnected(false);
        console.error('💥 Ably connection failed:', err);
        
        // Check for specific error codes
        if (err.reason && err.reason.code === 40101) {
          console.error('🔑 API Key Error: The provided Ably API key is invalid or expired.');
          console.error('Please check your Ably dashboard for the correct key.');
        } else if (err.reason && err.reason.code === 40103) {
          console.error('🚫 API Key Error: The API key does not have sufficient permissions.');
        }
      });

    } catch (error) {
      console.error('Failed to initialize Ably:', error);
      setIsConnected(false);
    }

    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
      }
      if (ablyClient.current) {
        ablyClient.current.close();
      }
    };
  }, []);

  // Subscribe to show-specific channel
  useEffect(() => {
    if (!ablyClient.current || !isConnected || !showSlug) return;

    // Now that permissions are fixed, use show-specific channels
    const channelName = `show-chat-${showSlug}`;
    console.log(`Attempting to connect to channel: ${channelName}`);
    
    channel.current = ablyClient.current.channels.get(channelName);

    // Subscribe to new messages with error handling
    channel.current.subscribe('message', (message) => {
      const chatMessage: ChatMessage = {
        id: message.id || Math.random().toString(),
        username: message.data.username,
        message: message.data.message,
        timestamp: new Date(message.timestamp),
        clientId: message.clientId,
      };
      
      setMessages(prev => [...prev, chatMessage]);
    });

    // Subscribe to typing events
    channel.current.subscribe('typing:start', (message) => {
      if (message.clientId !== ablyClient.current?.auth.clientId) {
        setTypingUsers(prev => {
          const existing = prev.find(user => user.clientId === message.clientId);
          if (existing) {
            return prev.map(user => 
              user.clientId === message.clientId 
                ? { ...user, timestamp: Date.now() }
                : user
            );
          }
          return [...prev, {
            clientId: message.clientId,
            username: message.data.username,
            timestamp: Date.now()
          }];
        });
      }
    });

    channel.current.subscribe('typing:stop', (message) => {
      if (message.clientId !== ablyClient.current?.auth.clientId) {
        setTypingUsers(prev => prev.filter(user => user.clientId !== message.clientId));
      }
    });

    // Subscribe to reaction events
    channel.current.subscribe('reaction', (message) => {
      const reactionData: ReactionEvent = message.data;
      
      setMessageReactions(prev => {
        const messageId = reactionData.messageId;
        const currentReactions = prev[messageId] || [];
        
        const existingReactionIndex = currentReactions.findIndex(r => r.emoji === reactionData.emoji);
        
        if (reactionData.action === 'add') {
          if (existingReactionIndex >= 0) {
            // Update existing reaction
            const updatedReactions = [...currentReactions];
            const reaction = updatedReactions[existingReactionIndex];
            
            if (!reaction.users.includes(reactionData.username)) {
              reaction.count += 1;
              reaction.users.push(reactionData.username);
              
              // Check if current user reacted
              if (reactionData.clientId === ablyClient.current?.auth.clientId) {
                reaction.userReacted = true;
              }
            }
            
            return { ...prev, [messageId]: updatedReactions };
          } else {
            // Add new reaction
            const newReaction: MessageReaction = {
              emoji: reactionData.emoji,
              count: 1,
              users: [reactionData.username],
              userReacted: reactionData.clientId === ablyClient.current?.auth.clientId
            };
            
            return { ...prev, [messageId]: [...currentReactions, newReaction] };
          }
        } else if (reactionData.action === 'remove' && existingReactionIndex >= 0) {
          // Remove reaction
          const updatedReactions = [...currentReactions];
          const reaction = updatedReactions[existingReactionIndex];
          
          const userIndex = reaction.users.indexOf(reactionData.username);
          if (userIndex >= 0) {
            reaction.count -= 1;
            reaction.users.splice(userIndex, 1);
            
            // Check if current user removed reaction
            if (reactionData.clientId === ablyClient.current?.auth.clientId) {
              reaction.userReacted = false;
            }
            
            // Remove reaction if no users left
            if (reaction.count === 0) {
              updatedReactions.splice(existingReactionIndex, 1);
            }
          }
          
          return { ...prev, [messageId]: updatedReactions };
        }
        
        return prev;
      });
    });

    // Enter presence when channel is ready
    if (isUsernameSet && username) {
      channel.current.presence.enter({
        username: username,
        joinedAt: new Date().toISOString()
      });
    }

    // Subscribe to presence events
    channel.current.presence.subscribe('enter', (presenceMessage) => {
      if (presenceMessage.clientId !== ablyClient.current?.auth.clientId) {
        setPresenceUsers(prev => {
          const existing = prev.find(user => user.clientId === presenceMessage.clientId);
          if (!existing) {
            return [...prev, {
              clientId: presenceMessage.clientId,
              username: presenceMessage.data.username,
              joinedAt: new Date(presenceMessage.data.joinedAt)
            }];
          }
          return prev;
        });
      }
    });

    channel.current.presence.subscribe('leave', (presenceMessage) => {
      setPresenceUsers(prev => prev.filter(user => user.clientId !== presenceMessage.clientId));
      // Also remove from typing users
      setTypingUsers(prev => prev.filter(user => user.clientId !== presenceMessage.clientId));
    });

    channel.current.presence.subscribe('update', (presenceMessage) => {
      if (presenceMessage.clientId !== ablyClient.current?.auth.clientId) {
        setPresenceUsers(prev => prev.map(user => 
          user.clientId === presenceMessage.clientId 
            ? { ...user, username: presenceMessage.data.username }
            : user
        ));
      }
    });

    // Handle channel errors
    channel.current.on('failed', (err) => {
      console.error('❌ Channel failed:', err);
      if (err.reason && err.reason.code === 40160) {
        console.error('🔒 Channel access denied. The API key may not have permission for this channel.');
        console.error('💡 Falling back to demo mode...');
        setChannelAccessDenied(true);
      }
    });

    // Load chat history (last 7 days) - will trigger fallback if no permission
    setTimeout(() => {
      loadChatHistory();
    }, 1000); // Give connection time to establish before trying history

    return () => {
      if (channel.current) {
        // Leave presence before unsubscribing
        if (isUsernameSet && username) {
          channel.current.presence.leave();
        }
        channel.current.unsubscribe();
      }
    };
  }, [showSlug, isConnected, isUsernameSet, username]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up old typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => 
        prev.filter(user => Date.now() - user.timestamp < 3000) // Remove after 3 seconds
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  // Close reaction picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.reaction-picker') && !target.closest('.add-reaction-button')) {
        setShowReactionPicker(null);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showReactionPicker]);

  const loadChatHistory = async () => {
    if (!channel.current) return;
    
    setIsLoading(true);
    try {
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const result = await channel.current.history({
        start: oneWeekAgo,
        limit: 100,
      });

      const historyMessages: ChatMessage[] = [];
      
      for (const page of result.items.reverse()) {
        const chatMessage: ChatMessage = {
          id: page.id || Math.random().toString(),
          username: page.data.username,
          message: page.data.message,
          timestamp: new Date(page.timestamp),
          clientId: page.clientId,
        };
        historyMessages.push(chatMessage);
      }

      setMessages(historyMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Check for permission errors (multiple ways this can manifest)
      const isPermissionError = 
        (error.message && error.message.includes('action not permitted')) ||
        (error.code === 40160) ||
        (error.statusCode === 401);
        
      if (isPermissionError) {
        console.error('📜 History/Channel access denied. API key lacks required permissions.');
        console.error('💡 Falling back to demo mode...');
        setChannelAccessDenied(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startTyping = () => {
    if (!channel.current || !isUsernameSet || isTyping) return;
    
    setIsTyping(true);
    channel.current.publish('typing:start', {
      username: username.trim()
    });

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Auto-stop typing after 3 seconds
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!channel.current || !isTyping) return;
    
    setIsTyping(false);
    channel.current.publish('typing:stop', {
      username: username.trim()
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
  };

  const sendReaction = async (messageId: string, emoji: string) => {
    if (!channel.current || !isUsernameSet) return;
    
    const reactions = messageReactions[messageId] || [];
    const existingReaction = reactions.find(r => r.emoji === emoji);
    const action = existingReaction?.userReacted ? 'remove' : 'add';
    
    try {
      await channel.current.publish('reaction', {
        messageId,
        emoji,
        username: username.trim(),
        action
      } as ReactionEvent);
    } catch (error) {
      console.error('Failed to send reaction:', error);
    }
  };

  const toggleReactionPicker = (messageId: string) => {
    setShowReactionPicker(prev => prev === messageId ? null : messageId);
  };

  const sendMessage = async () => {
    if (!channel.current || !newMessage.trim() || !username.trim()) return;

    // Stop typing indicator when sending message
    stopTyping();

    try {
      await channel.current.publish('message', {
        username: username.trim(),
        message: newMessage.trim(),
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 2) {
      setIsUsernameSet(true);
      
      // Enter presence when username is set
      if (channel.current) {
        channel.current.presence.enter({
          username: username.trim(),
          joinedAt: new Date().toISOString()
        });
      }
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    
    if (value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
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

  // If channel access is denied, fall back to demo mode
  if (channelAccessDenied) {
    return (
      <ChatOverlayDemo
        showSlug={showSlug}
        isVisible={isVisible}
        onToggle={onToggle}
      />
    );
  }

  if (!isVisible) {
    return (
      <div className="chat-toggle">
        <button onClick={onToggle} className="chat-toggle-btn">
          <FaComments />
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
            <span>Live Chat</span>
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Live' : '● Offline'}
            </div>
            {presenceUsers.length > 0 && (
              <div className="presence-count">
                {presenceUsers.length + 1} online
              </div>
            )}
          </div>
          <button onClick={onToggle} className="close-btn">
            <FaTimes />
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
              {isLoading && (
                <div className="loading">Loading chat history...</div>
              )}
              
              {messages.length === 0 && !isLoading && (
                <div className="no-messages">
                  <FaComments size={48} />
                  <p>No messages yet. Be the first to say hello!</p>
                </div>
              )}

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
                      className={`message ${msg.clientId === ablyClient.current?.auth.clientId ? 'own-message' : ''}`}
                    >
                      <div className="message-header">
                        <FaUser className="user-icon" />
                        <span className="username">{msg.username}</span>
                        <span className="timestamp">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                      
                      {/* Message Reactions */}
                      <div className="message-reactions">
                        {messageReactions[msg.id]?.map((reaction) => (
                          <button
                            key={reaction.emoji}
                            className={`reaction-button ${reaction.userReacted ? 'user-reacted' : ''}`}
                            onClick={() => sendReaction(msg.id, reaction.emoji)}
                            title={`${reaction.users.join(', ')} reacted with ${reaction.emoji}`}
                          >
                            <span className="reaction-emoji">{reaction.emoji}</span>
                            <span className="reaction-count">{reaction.count}</span>
                          </button>
                        ))}
                        
                        {/* Add Reaction Button */}
                        <button
                          className="add-reaction-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReactionPicker(msg.id);
                          }}
                          title="Add reaction"
                        >
                          ➕
                        </button>
                        
                        {/* Reaction Picker */}
                        {showReactionPicker === msg.id && (
                          <div 
                            className="reaction-picker"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'].map((emoji) => (
                              <button
                                key={emoji}
                                className="reaction-emoji-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  sendReaction(msg.id, emoji);
                                  setShowReactionPicker(null);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicators */}
              {typingUsers.length > 0 && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0].username} is typing...`
                      : typingUsers.length === 2
                      ? `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`
                      : `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing...`
                    }
                  </span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <form onSubmit={handleMessageSubmit} className="message-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleMessageInputChange}
                  maxLength={500}
                  className="message-input"
                  disabled={!isConnected}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || !isConnected}
                  className="send-btn"
                >
                  <FaPaperPlane />
                </button>
              </form>
              <div className="chat-info">
                Chat history: Last 7 days • {messages.length} messages
              </div>
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
        }

        .connection-status {
          font-size: 12px;
          margin-left: 8px;
        }

        .connection-status.connected {
          color: #90EE90;
        }

        .connection-status.disconnected {
          color: #FFB6C1;
        }

        .presence-count {
          font-size: 11px;
          margin-left: 8px;
          color: #90EE90;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 10px;
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
          transition: border-color 0.2s;
        }

        .username-input:focus {
          border-color: #007bff;
        }

        .username-setup button {
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .username-setup button:hover:not(:disabled) {
          background: #0056b3;
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

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }

        .no-messages {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .no-messages p {
          margin: 12px 0 0 0;
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
          border-color: #007bff;
        }

        .message-input:disabled {
          background: #f5f5f5;
          color: #999;
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
          transition: background-color 0.2s;
        }

        .send-btn:hover:not(:disabled) {
          background: #0056b3;
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

        /* Custom scrollbar */
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

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          margin: 8px 0;
          background: rgba(0, 123, 255, 0.1);
          border-radius: 8px;
          font-size: 12px;
          color: #666;
        }

        .typing-dots {
          display: flex;
          gap: 2px;
        }

        .typing-dots span {
          width: 4px;
          height: 4px;
          background: #007bff;
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .typing-text {
          font-style: italic;
        }

        .message-reactions {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-top: 6px;
          position: relative;
        }

        .reaction-button {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 12px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .reaction-button:hover {
          background: #e0e0e0;
          transform: scale(1.05);
        }

        .reaction-button.user-reacted {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .reaction-emoji {
          font-size: 14px;
        }

        .reaction-count {
          font-size: 11px;
          font-weight: 600;
          min-width: 12px;
          text-align: center;
        }

        .add-reaction-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          background: transparent;
          border: 1px dashed #ccc;
          border-radius: 12px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
          opacity: 0.7;
        }

        .add-reaction-button:hover {
          background: #f0f0f0;
          border-color: #007bff;
          opacity: 1;
        }

        .reaction-picker {
          position: absolute;
          top: -50px;
          left: 0;
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }

        .reaction-emoji-button {
          padding: 4px;
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          transition: background-color 0.2s;
        }

        .reaction-emoji-button:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ChatOverlay;