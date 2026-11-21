import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  Crown,
  Plus,
  Trash2,
  Check,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenVerification: () => void;
  onOpenPremium: () => void;
  onProfileUpdated: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenVerification,
  onOpenPremium,
  onProfileUpdated,
}) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('');
  const [education, setEducation] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [incognitoMode, setIncognitoMode] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await api.getMyProfile();
      setProfile(data);
      setDisplayName(data.displayName || '');
      setBio(data.bio || '');
      setCity(data.city || 'Dakar');
      setProfession(data.profession || '');
      setEducation(data.education || '');
      setLookingFor(data.lookingFor || '');
      setIncognitoMode(data.incognitoMode || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile({
        displayName,
        bio,
        city,
        profession,
        education,
        lookingFor,
        incognitoMode,
      });
      alert('Profil mis à jour avec succès');
      onProfileUpdated();
      fetchProfile();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    try {
      await api.addPhoto(newPhotoUrl.trim());
      setNewPhotoUrl('');
      setShowAddPhoto(false);
      fetchProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Supprimer cette photo ?')) return;
    try {
      await api.deletePhoto(photoId);
      fetchProfile();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isVerified = profile?.user?.isVerified;
  const isPremium = profile?.user?.isPremium;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Top Status Badges Card */}
      <div className="bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {profile?.photos?.[0] ? (
              <img
                src={profile.photos[0].url}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                {profile?.displayName?.[0]}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{profile?.displayName}</h1>
              <span className="text-zinc-400 text-lg font-light">{profile?.age} ans</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{profile?.user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Verification Status */}
          {isVerified ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Profil Vérifié</span>
            </div>
          ) : (
            <button
              onClick={onOpenVerification}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-full text-xs font-medium transition"
            >
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              <span>Vérifier mon profil</span>
            </button>
          )}

          {/* Premium Status */}
          {isPremium ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
              <Crown className="w-4 h-4" />
              <span>Membre Premium</span>
            </div>
          ) : (
            <button
              onClick={onOpenPremium}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-brand-orange text-white rounded-full text-xs font-bold transition hover:opacity-90"
            >
              <Crown className="w-4 h-4" />
              <span>Passer Premium</span>
            </button>
          )}
        </div>
      </div>

      {/* Photo Gallery (Max 6) */}
      <div className="bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">Photos de profil ({profile?.photos?.length || 0}/6)</h2>
          {profile?.photos?.length < 6 && (
            <button
              type="button"
              onClick={() => setShowAddPhoto(true)}
              className="flex items-center gap-1.5 text-xs text-brand-orange font-semibold hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une photo</span>
            </button>
          )}
        </div>

        {showAddPhoto && (
          <form onSubmit={handleAddPhoto} className="flex gap-2 mb-4 p-3 bg-zinc-900 rounded-2xl border border-zinc-800">
            <input
              type="url"
              required
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              placeholder="Entrez l URL d une photo (ex: https://...)"
              className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:border-brand-orange"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-orange text-white text-xs font-medium rounded-xl hover:bg-brand-orange-hover"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setShowAddPhoto(false)}
              className="px-3 py-2 text-zinc-400 text-xs hover:text-white"
            >
              Annuler
            </button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-3">
          {profile?.photos?.map((ph: any) => (
            <div
              key={ph.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 group"
            >
              <img src={ph.url} alt="Photo" className="w-full h-full object-cover" />
              {ph.isMain && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded-md text-[10px] font-semibold text-white">
                  Principale
                </span>
              )}
              <button
                type="button"
                onClick={() => handleDeletePhoto(ph.id)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full text-white transition opacity-0 group-hover:opacity-100"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold mb-4">Informations Personnelles</h2>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Nom d affichage</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1">Description (Bio)</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Parlez un peu de vous, de vos passions, de ce qui vous anime..."
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Profession</label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="Ex: Consultant"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Études / Diplôme</label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="Ex: Master"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">Je recherche</label>
            <input
              type="text"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              placeholder="Ex: Rencontres amicales"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>

        {/* Incognito mode toggle */}
        <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <span>Mode Incognito</span>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Votre profil ne sera visible que par les personnes que vous avez vous-même likées.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              disabled={!isPremium}
              checked={incognitoMode}
              onChange={(e) => setIncognitoMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange disabled:opacity-30"></div>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition shadow-lg shadow-brand-orange/20 disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
};
