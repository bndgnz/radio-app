import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useShowChat = (slug: string, chatEnabled?: boolean) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we're on a show page and chat is enabled
    const isShowPage = router.pathname === '/shows/[slug]';
    const hasChatEnabled = chatEnabled === true;
    
    setIsChatEnabled(isShowPage && hasChatEnabled);
    
    // If chat gets disabled, close it
    if (!isShowPage || !hasChatEnabled) {
      setIsChatVisible(false);
    }
  }, [router.pathname, chatEnabled]);

  const toggleChat = () => {
    if (isChatEnabled) {
      setIsChatVisible(!isChatVisible);
    }
  };

  const openChat = () => {
    if (isChatEnabled) {
      setIsChatVisible(true);
    }
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  return {
    isChatVisible,
    isChatEnabled,
    showSlug: slug,
    toggleChat,
    openChat,
    closeChat,
  };
};