import React, { useState } from 'react';
import { X, SlidersHorizontal, ShieldCheck, Check } from 'lucide-react';

export interface DiscoveryFilters {
  minAge: number;
  maxAge: number;
  gender?: 'MALE' | 'FEMALE';
  city?: string;
  onlyVerified: boolean;
  maxDistance: number;
}

interface DiscoveryFiltersModalProps {
  currentFilters: DiscoveryFilters;
  onApply: (filters: DiscoveryFilters) => void;
  onClose: () => void;
}

const POPULAR_CITIES = ['Dakar', 'Almadies', 'Plateau', 'Mermoz', 'Ngor', 'Ouakam', 'Thiès', 'Mbour', 'Saint-Louis'];

export const DiscoveryFiltersModal: React.FC<DiscoveryFiltersModalProps> = ({
  currentFilters,
  onApply,
  onClose,
}) => {
  const [minAge, setMinAge] = useState(currentFilters.minAge);
  const [maxAge, setMaxAge] = useState(currentFilters.maxAge);
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | undefined>(currentFilters.gender);
  const [city, setCity] = useState<string | undefined>(currentFilters.city);
  const [onlyVerified, setOnlyVerified] = useState(currentFilters.onlyVerified);
  const [maxDistance, setMaxDistance] = useState(currentFilters.maxDistance);

  const handleReset = () => {
    setMinAge(18);
    setMaxAge(50);
    setGender(undefined);
    setCity(undefined);
    setOnlyVerified(false);
    setMaxDistance(50);
  };

  const handleSave = () => {
    onApply({
      minAge,
      maxAge,
      gender,
      city: city || undefined,
      onlyVerified,
      maxDistance,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Filtres de découverte</h2>
            <p className="text-xs text-zinc-400">Personnalisez vos suggestions à Dakar</p>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          {/* Tranche d'âge */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-zinc-300">Tranche d’âge</label>
              <span className="text-xs font-mono text-blue-400">
                {minAge} — {maxAge} ans
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="18"
                max="65"
                value={minAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= maxAge) setMinAge(val);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <input
                type="range"
                min="18"
                max="65"
                value={maxAge}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= minAge) setMaxAge(val);
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Distance max */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-zinc-300">Distance maximale</label>
              <span className="text-xs font-mono text-blue-400">Jusqu’à {maxDistance} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Je souhaite rencontrer
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGender(undefined)}
                className={`py-2 text-xs font-medium rounded-xl border transition ${
                  gender === undefined
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setGender('FEMALE')}
                className={`py-2 text-xs font-medium rounded-xl border transition ${
                  gender === 'FEMALE'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Femmes
              </button>
              <button
                type="button"
                onClick={() => setGender('MALE')}
                className={`py-2 text-xs font-medium rounded-xl border transition ${
                  gender === 'MALE'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Hommes
              </button>
            </div>
          </div>

          {/* Profils vérifiés uniquement */}
          <div className="p-3.5 bg-zinc-900/70 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Profils vérifiés uniquement</p>
                <p className="text-[11px] text-zinc-400">Masquer les comptes sans badge bleu</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Ville / Quartier */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Zone géographique (Sénégal)
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCity(undefined)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  city === undefined
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                Tout le pays
              </button>
              {POPULAR_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(city === c ? undefined : c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    city === c
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl border border-zinc-800 transition"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};
