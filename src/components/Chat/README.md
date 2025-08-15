# 💬 Real-time Live Chat for Show Pages

A real-time chat overlay system that appears on show pages when enabled, using Ably for real-time messaging.

## 🚀 Features

### ✅ **Conditional Display**
- Only shows on show pages (`/shows/showname`)
- Only when the show has `chat: true` in Contentful
- Automatically hides on other pages

### ✅ **Real-time Messaging**
- Powered by Ably real-time messaging
- Instant message delivery
- Connection status indicators
- Show-specific chat rooms

### ✅ **Chat History**
- Displays last 7 days of chat history
- Automatic message persistence
- Date separators for better organization
- Message count display

### ✅ **User Experience**
- Floating toggle button when closed
- Full overlay when opened
- Username setup flow
- Own message highlighting
- Responsive design (mobile & desktop)

## 🔧 Implementation

### Components

#### `ChatOverlay.tsx`
Main chat component with full functionality:
- Real-time messaging via Ably
- 7-day message history
- Username management
- Mobile-responsive design
- Connection status monitoring

#### `useShowChat.ts`
React hook for managing chat state:
- Determines if chat should be enabled
- Manages visibility state
- Provides toggle functions

### Integration

The chat is integrated into show pages via:

```tsx
// pages/shows/[slug].tsx
const { isChatVisible, isChatEnabled, showSlug, toggleChat } = useShowChat({ 
  showData: { slug, chat } 
});

{isChatEnabled && (
  <ChatOverlay
    showSlug={showSlug}
    isVisible={isChatVisible}
    onToggle={toggleChat}
  />
)}
```

## 📊 Data Flow

1. **Show Page Load** → Check if `chat: true` in Contentful
2. **Chat Enabled** → Show toggle button
3. **User Opens Chat** → Connect to Ably channel `show-chat-{slug}`
4. **Load History** → Fetch last 7 days of messages
5. **Real-time Updates** → Subscribe to new messages
6. **User Sends Message** → Publish to channel

## 🎛️ Configuration

### Environment Variables
```env
NEXT_PUBLIC_ABLY_API_KEY=your_ably_api_key
```

### Contentful Setup
Add `chat` boolean field to the `shows` content type:
- Field ID: `chat`
- Type: Boolean
- Default: `false`

## 🎨 Design Features

### Visual Elements
- **Toggle Button**: Blue floating button with chat icon
- **Overlay**: Modern card design with header/body/footer
- **Messages**: Clean bubble layout with timestamps
- **Own Messages**: Highlighted in light blue
- **Date Separators**: Clear day boundaries

### States
- **Closed**: Floating toggle button
- **Username Setup**: Simple form to join chat
- **Active Chat**: Full messaging interface
- **Loading**: History loading indicator
- **Offline**: Connection status display

## 📱 Responsive Behavior

### Desktop
- Fixed 350px width overlay
- Positioned bottom-right
- 500px height

### Mobile
- Full-width overlay (with margins)
- Reduced height (400px)
- Touch-optimized controls

## 🔒 Security & Performance

### Security
- Client-side only usernames (no authentication)
- Rate limiting via Ably
- Message length limits (500 chars)
- Username length limits (20 chars)

### Performance
- Efficient message rendering
- Auto-scroll optimization
- Connection management
- Memory cleanup on unmount

## 🎯 Usage Examples

### Enable Chat for a Show
1. Go to Contentful
2. Edit the show content
3. Set `chat` field to `true`
4. Publish the content

### Test the Chat
1. Visit a show page with chat enabled
2. Click the "Live Chat" button
3. Enter a username
4. Start chatting!

## 🛠️ Technical Details

### Ably Channels
- Channel naming: `show-chat-{showSlug}`
- Message format: `{ username, message }`
- History retention: 7 days
- Client ID: Auto-generated unique ID

### React Patterns
- Custom hooks for state management
- Conditional rendering based on props
- Effect cleanup for connections
- Ref usage for auto-scrolling

### TypeScript Support
- Full type definitions
- Interface documentation
- Proper error handling

## 🚀 Future Enhancements

- User authentication integration
- Moderation features
- Emoji support
- File/image sharing
- Chat notifications
- User online status
- Message reactions

The chat system is now fully functional and ready for use on any show page where the `chat` field is enabled in Contentful!