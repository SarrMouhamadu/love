import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
  Heart,
  X,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  MessageCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { DiscoveryFiltersModal, DiscoveryFilters } from './DiscoveryFiltersModal';

interface DiscoveryViewProps {
  onOpenChat: (conversationId: string) => void;
  user: any;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  onOpenChat,
  user,
}) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastPassedId, setLastPassedId] = useState<string | null>(null);

  // Filters state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilters>({
    minAge: 18,
    maxAge: 50,
    onlyVerified: false,
    maxDistance: 50,
  });

  // Match celebration state
  const [matchData, setMatchData] = useState<any | null>(null);

  // Swipe gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const fetchProfiles = async (customFilters?: DiscoveryFilters) => {
    setLoading(true);
    const activeFilters = customFilters || filters;
    try {
      const params: Record<string, any> = {
        minAge: activeFilters.minAge,
        maxAge: activeFilters.maxAge,
        maxDistance: activeFilters.maxDistance,
      };
      if (activeFilters.gender) params.gender = activeFilters.gender;
      if (activeFilters.city) params.city = activeFilters.city;
      if (activeFilters.onlyVerified) params.onlyVerified = true;

      const data = await api.getDiscovery(params);
      setProfiles(data);
      setCurrentIndex(0);
      setCurrentPhotoIndex(0);
      setExitDirection(null);
      setDragOffset({ x: 0, y: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleLike = async () => {
    if (!currentProfile || exitDirection) return;
    setExitDirection('right');

    setTimeout(async () => {
      try {
        const res = await api.likeUser(currentProfile.userId);
        if (res.isMatch) {
          setMatchData({
            matchId: res.matchId,
            conversationId: res.conversationId,
            user: res.matchedUser || currentProfile,
          });
        }
        nextProfile();
      } catch (err: any) {
        console.error(err);
        nextProfile();
      }
    }, 200);
  };

  const handlePass = async () => {
    if (!currentProfile || exitDirection) return;
    setExitDirection('left');

    setTimeout(async () => {
      try {
        await api.passUser(currentProfile.userId);
        setLastPassedId(currentProfile.userId);
        nextProfile();
      } catch (err: any) {
        console.error(err);
        nextProfile();
      }
    }, 200);
  };

  const handleRewind = async () => {
    if (!lastPassedId) return;

    try {
      await api.rewindUser(lastPassedId);
      fetchProfiles();
      setLastPassedId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const nextProfile = () => {
    setExitDirection(null);
    setDragOffset({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
    setCurrentPhotoIndex(0);
  };

  // --- Touch & Mouse Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (exitDirection) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startPos.current = { x: clientX, y: clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || exitDirection) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging || exitDirection) return;
    setIsDragging(false);

    // Threshold check for swipe
    const SWIPE_THRESHOLD = 90;
    if (dragOffset.x > SWIPE_THRESHOLD) {
      handleLike();
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      handlePass();
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm mt-4 font-medium">Recherche de profils autour de Dakar...</p>
      </div>
    );
  }

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/30 rounded-3xl flex items-center justify-center mb-4 text-blue-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">C’est tout pour le moment !</h2>
        <p className="text-zinc-400 text-sm mt-2 mb-6 leading-relaxed">
          Vous avez exploré tous les profils correspondant à vos filtres actuels. Élargissez votre
          zone géographique ou revenez plus tard.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Modifier les filtres</span>
          </button>
          <button
            onClick={() => fetchProfiles()}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-xs font-medium border border-zinc-700 transition"
          >
            Rafraîchir
          </button>
        </div>

        {showFilters && (
          <DiscoveryFiltersModal
            currentFilters={filters}
            onApply={(newFilters) => {
              setFilters(newFilters);
              fetchProfiles(newFilters);
            }}
            onClose={() => setShowFilters(false)}
          />
        )}
      </div>
    );
  }

  const photos = currentProfile.photos || [];
  const currentPhoto =
    photos[currentPhotoIndex]?.url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  // Card transform calculation
  const rotateDeg = exitDirection === 'right' ? 20 : exitDirection === 'left' ? -20 : dragOffset.x * 0.08;
  const translateX = exitDirection === 'right' ? 500 : exitDirection === 'left' ? -500 : dragOffset.x;
  const translateY = exitDirection ? 50 : dragOffset.y * 0.3;
  const cardStyle = {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotateDeg}deg)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  // Stamp opacities
  const likeOpacity = Math.min(Math.max(dragOffset.x / 100, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / 100, 0), 1);

  return (
    <div className="max-w-md mx-auto px-4 py-3 relative select-none">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-medium text-white">{filters.city || 'Dakar'}</span>
          <span>• Rayon {filters.maxDistance} km</span>
        </div>

        <button
          onClick={() => setShowFilters(true)}
          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl border border-zinc-800 transition flex items-center gap-1.5 text-xs font-semibold"
          title="Filtres de recherche"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Profile Card Container */}
      <div
        style={cardStyle}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative bg-zinc-900 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl h-[560px] flex flex-col justify-end cursor-grab active:cursor-grabbing will-change-transform"
      >
        {/* LIKE STAMP (APPEARS ON SWIPE RIGHT) */}
        <div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-8 z-30 pointer-events-none transform -rotate-12 border-2 border-emerald-400 text-emerald-400 bg-emerald-950/40 backdrop-blur-md px-4 py-1.5 rounded-2xl font-black text-2xl tracking-wider shadow-lg shadow-emerald-500/20"
        >
          J’AIME
        </div>

        {/* PASS STAMP (APPEARS ON SWIPE LEFT) */}
        <div
          style={{ opacity: passOpacity }}
          className="absolute top-8 right-8 z-30 pointer-events-none transform rotate-12 border-2 border-rose-500 text-rose-500 bg-rose-950/40 backdrop-blur-md px-4 py-1.5 rounded-2xl font-black text-2xl tracking-wider shadow-lg shadow-rose-500/20"
        >
          PASSER
        </div>

        {/* Background Image */}
        <img
          src={currentPhoto}
          alt={currentProfile.displayName}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Photo Pagination Bars */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5 pointer-events-none">
            {photos.map((_: any, idx: number) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx === currentPhotoIndex ? 'bg-white shadow' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Photo Click Zones */}
        {photos.length > 1 && (
          <div className="absolute inset-0 z-10 flex pointer-events-auto">
            <div
              className="w-1/2 h-2/3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
              }}
            />
            <div
              className="w-1/2 h-2/3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
              }}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/50 to-transparent pointer-events-none" />

        {/* Profile Info Card Content */}
        <div className="relative z-20 p-6 text-white pointer-events-none">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight">{currentProfile.displayName}</h2>
            <span className="text-2xl font-light text-zinc-300">{currentProfile.age}</span>

            {currentProfile.isVerified && (
              <span className="p-1 bg-blue-500 rounded-full shadow-sm" title="Profil vérifié">
                <ShieldCheck className="w-4 h-4 text-white" />
              </span>
            )}
          </div>

          {/* Location & Distance */}
          <div className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-white">{currentProfile.city}</span>
            {currentProfile.distanceKm != null && (
              <span className="text-zinc-400">• à ~{currentProfile.distanceKm} km</span>
            )}
          </div>

          {/* Profession & Education */}
          {(currentProfile.profession || currentProfile.education) && (
            <div className="flex items-center gap-3 text-xs text-zinc-300 mt-2">
              {currentProfile.profession && (
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentProfile.profession}</span>
                </div>
              )}
              {currentProfile.education && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{currentProfile.education}</span>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {currentProfile.bio && (
            <p className="text-sm text-zinc-200 mt-2.5 line-clamp-3 leading-relaxed">
              {currentProfile.bio}
            </p>
          )}

          {/* Interests */}
          {currentProfile.interests && currentProfile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {currentProfile.interests.slice(0, 4).map((interest: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-medium border border-white/10"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Swipe Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {/* Rewind */}
        <button
          onClick={handleRewind}
          disabled={!lastPassedId && user.isPremium}
          className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition shadow-lg disabled:opacity-40"
          title="Annuler (Rewind)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Pass */}
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 hover:scale-105 active:scale-95 transition shadow-lg hover:border-rose-500/50"
          title="Passer"
        >
          <X className="w-8 h-8 stroke-[2.5]" />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition shadow-xl shadow-blue-500/30 ring-2 ring-white/20"
          title="J’aime"
        >
          <Heart className="w-8 h-8 fill-white" />
        </button>
      </div>

      {/* MATCH POPUP CELEBRATION */}
      {matchData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-zinc-950 border border-blue-500/40 rounded-3xl p-6 text-center shadow-2xl relative">
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white">C’EST UN MATCH !</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Vous et <span className="text-white font-medium">{matchData.user.displayName}</span>{' '}
              vous plaisez mutuellement.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  const convId = matchData.conversationId;
                  setMatchData(null);
                  onOpenChat(convId);
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer un message</span>
              </button>

              <button
                onClick={() => setMatchData(null)}
                className="w-full py-2.5 text-zinc-400 hover:text-white text-sm font-medium transition"
              >
                Continuer à découvrir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS MODAL */}
      {showFilters && (
        <DiscoveryFiltersModal
          currentFilters={filters}
          onApply={(newFilters) => {
            setFilters(newFilters);
            fetchProfiles(newFilters);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};
