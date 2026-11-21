import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DiscoveryView } from './components/DiscoveryView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { VerificationModal } from './components/VerificationModal';
import { PremiumModal } from './components/PremiumModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'discover' | 'matches' | 'profile'>('discover');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Modals
  const [showVerification, setShowVerification] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-brand-orange selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setActiveConversationId(null);
        }}
        user={currentUser}
        onOpenVerification={() => setShowVerification(true)}
        onOpenPremium={() => setShowPremium(true)}
        onLogout={handleLogout}
      />

      {/* Main View */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {!currentUser ? (
          <AuthModal onSuccess={(user) => setCurrentUser(user)} />
        ) : currentTab === 'discover' ? (
          <DiscoveryView
            user={currentUser}
            onOpenPremium={() => setShowPremium(true)}
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
        ) : (
          <ProfileView
            onOpenVerification={() => setShowVerification(true)}
            onOpenPremium={() => setShowPremium(true)}
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

      {/* Premium Upgrade Modal */}
      {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onSuccess={checkAuth}
        />
      )}
    </div>
  );
};
export default App;
