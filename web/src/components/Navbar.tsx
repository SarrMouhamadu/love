import React from 'react';
import { Flame, MessageCircle, User, ShieldCheck, Crown, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: 'discover' | 'matches' | 'profile';
  onTabChange: (tab: 'discover' | 'matches' | 'profile') => void;
  user: any;
  onOpenVerification: () => void;
  onOpenPremium: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  onOpenVerification,
  onOpenPremium,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onTabChange('discover')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">ANONYME</span>
            <span className="text-brand-orange font-bold text-lg ml-1">PRO</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        {user && (
          <nav className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-full border border-zinc-800">
            <button
              onClick={() => onTabChange('discover')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentTab === 'discover'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span className="hidden sm:inline">Découvrir</span>
            </button>

            <button
              onClick={() => onTabChange('matches')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentTab === 'matches'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Matchs</span>
            </button>

            <button
              onClick={() => onTabChange('profile')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                currentTab === 'profile'
                  ? 'bg-brand-orange text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profil</span>
            </button>
          </nav>
        )}

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Verification Badge / Action */}
              {user.isVerified ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Vérifié</span>
                </div>
              ) : (
                <button
                  onClick={onOpenVerification}
                  className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full text-xs font-medium border border-zinc-700 transition"
                  title="Faire vérifier mon compte"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Vérifier mon profil</span>
                </button>
              )}

              {/* Premium Button */}
              {user.isPremium ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>PREMIUM</span>
                </div>
              ) : (
                <button
                  onClick={onOpenPremium}
                  className="flex items-center gap-1.5 px-3.5 py-1 bg-gradient-to-r from-amber-500 to-brand-orange hover:opacity-90 text-white rounded-full text-xs font-bold shadow-sm transition"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Passer Premium</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="text-xs text-zinc-500">Dakar, Sénégal</div>
          )}
        </div>
      </div>
    </header>
  );
};
