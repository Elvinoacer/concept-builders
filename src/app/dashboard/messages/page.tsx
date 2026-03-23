"use client";

import React, { useState, useEffect } from "react";
import ConversationList from "@/components/dashboard/messages/ConversationList";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";
import { ConversationWithMessagesAndUsers } from "@/components/dashboard/messages/ConversationList";
import { useSocket } from "@/app/Providers";

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithMessagesAndUsers | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const socketContext = useSocket();
  const onlineUsers = socketContext?.onlineUsers || [];

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobileView(mobile);
      if (mobile && selectedConversation) {
        setShowConversationList(false);
      } else {
        setShowConversationList(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [selectedConversation]);

  const handleSelectConversation = (
    conversation: ConversationWithMessagesAndUsers | null
  ) => {
    setSelectedConversation(conversation);
    if (isMobileView && conversation) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setShowConversationList(true);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-screen bg-ink">
      {/* Conversation List - Responsive Behavior */}
      <div
        className={`
        ${showConversationList ? "flex" : "hidden"} 
        lg:flex 
        w-full lg:w-1/3 xl:w-1/4 2xl:w-1/5
        bg-card 
        border-r border-cb-border
        flex-col
        absolute lg:relative 
        inset-0 lg:inset-auto
        z-10 lg:z-auto
      `}
      >
        {/* Mobile Header for Conversation List */}
        {isMobileView && (
          <div className="flex items-center gap-3 p-4 border-b border-cb-border lg:hidden">
            <button
              onClick={handleBackToList}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface transition-colors"
            >
              <span className="material-symbols-outlined text-cream-dim">
                arrow_back
              </span>
            </button>
            <h1
              className="text-lg font-semibold text-cream"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Messages
            </h1>
          </div>
        )}
        <ConversationList
          onSelectConversation={handleSelectConversation}
          onlineUsers={onlineUsers}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Chat Window - Responsive Behavior */}
      <div
        className={`
        ${!showConversationList ? "flex" : "hidden"} 
        lg:flex 
        w-full lg:w-2/3 xl:w-3/4 2xl:w-4/5
        flex-col
        absolute lg:relative 
        inset-0 lg:inset-auto
        z-10 lg:z-auto
      `}
      >
        {selectedConversation ? (
          <>
            {/* Mobile Header for Chat */}
            {isMobileView && (
              <div className="flex items-center gap-3 p-4 border-b border-cb-border bg-card lg:hidden">
                <button
                  onClick={handleBackToList}
                  className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-cream-dim">
                    arrow_back
                  </span>
                </button>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-ink text-sm font-semibold">
                      {selectedConversation.participants[0]?.name?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-cream truncate">
                      {selectedConversation.participants[0]?.name ||
                        "Unknown User"}
                    </h2>
                    <p className="text-xs text-emerald-400">
                      Online
                    </p>
                  </div>
                </div>
              </div>
            )}
            <ChatWindow
              conversation={selectedConversation}
              onlineUsers={onlineUsers}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-card">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-cb-border">
                <span className="material-symbols-outlined text-cream-dim text-2xl">
                  chat
                </span>
              </div>
              <p className="text-cream-dim text-lg font-medium mb-2">
                Select a conversation
              </p>
              <p className="text-cb-muted text-sm">
                Choose a conversation from the list to start messaging
              </p>
              {/* Mobile-only button to show conversation list */}
              {isMobileView && (
                <button
                  onClick={() => setShowConversationList(true)}
                  className="mt-4 px-6 py-2 bg-gold text-ink rounded-lg font-semibold text-sm transition-all hover:bg-gold-light"
                >
                  View Conversations
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobileView && !showConversationList && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={handleBackToList}
        />
      )}
    </div>
  );
};

export default MessagesPage;
