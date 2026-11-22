import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DiscoveryView } from './components/DiscoveryView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { VerificationModal } from './components/VerificationModal';
import { AdminView } from './components/AdminView';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'discover' | 'matches' | 'profile' | 'admin'>('discover');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Auth modal for visitors on Landing Page
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);

  // Modals
  const [showVerification, setShowVerification] = useState(false);

  const checkAuth = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    api.clearToken();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Visitor View: Landing Page ---
  if (!currentUser) {
    return (
      <>
        <LandingPage onOpenAuth={(mode) => setAuthModalMode(mode)} />
        {authModalMode && (
          <AuthModal
            initialMode={authModalMode}
            onClose={() => setAuthModalMode(null)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setAuthModalMode(null);
            }}
          />
        )}
      </>
    );
  }

  // --- Authenticated App View ---
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setActiveConversationId(null);
        }}
        user={currentUser}
        onOpenVerification={() => setShowVerification(true)}
        onLogout={handleLogout}
      />

      {/* Main View */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {currentTab === 'discover' ? (
          <DiscoveryView
            user={currentUser}
            onOpenChat={(convId) => {
              setActiveConversationId(convId);
              setCurrentTab('matches');
            }}
          />
        ) : currentTab === 'matches' ? (
          <ChatView
            currentUser={currentUser}
            initialConversationId={activeConversationId}
          />
        ) : currentTab === 'admin' ? (
          <AdminView />
        ) : (
          <ProfileView
            onOpenVerification={() => setShowVerification(true)}
            onProfileUpdated={checkAuth}
          />
        )}
      </main>

      {/* Verification Modal */}
      {showVerification && (
        <VerificationModal
          onClose={() => setShowVerification(false)}
          onSuccess={checkAuth}
        />
      )}
    </div>
  );
};
export default App;
