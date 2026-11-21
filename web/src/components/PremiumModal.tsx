import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Shield,
  Eye,
  RotateCcw,
  Infinity,
  AlertCircle,
} from 'lucide-react';

interface PremiumModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.createNabooCheckout(phoneNumber || undefined);
      if (res.checkoutUrl) {
        // In local simulation mode or live redirect
        if (res.checkoutUrl.includes('simulated=true')) {
          // Direct local simulation validation
          alert('Mode simulation : Paiement Wave/Orange Money de 500 FCFA validé via NabooPay !');
          // Call webhook locally to simulate NabooPay callback
          await api.request('/payment/webhook/naboopay', {
            method: 'POST',
            body: JSON.stringify({
              order_id: res.orderId,
              transaction_status: 'paid',
              total_amount: 500,
            }),
          });
          onSuccess();
          onClose();
        } else {
          // Live NabooPay checkout redirection
          window.location.href = res.checkoutUrl;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Impossible d initier le paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 text-white">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">ANONYME PRO PREMIUM</h2>
          <div className="inline-flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-white">500</span>
            <span className="text-sm font-semibold text-amber-400">FCFA / mois</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Payable facilement par Wave & Orange Money au Sénégal
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Benefits List */}
        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Infinity className="w-3.5 h-3.5" />
            </div>
            <span><strong>Likes illimités</strong> chaque jour sans aucune interruption</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span><strong>Découvrez qui a aimé votre profil</strong> et matchez directement</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span><strong>Mode Incognito :</strong> visibilité contrôlée uniquement auprès de vos likes</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-3.5 h-3.5" />
            </div>
            <span><strong>Rewind :</strong> annulez votre dernier passage en un clic</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-200">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span><strong>Boost de visibilité</strong> prioritaire auprès des membres à Dakar</span>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1">
              Numéro de téléphone Wave ou Orange Money
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+221 77 000 00 00"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 py-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Wave
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Orange Money
            </span>
            <span className="text-zinc-600">• NabooPay</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-brand-orange hover:opacity-95 text-white font-bold rounded-xl transition shadow-lg shadow-amber-500/25 disabled:opacity-50"
          >
            {loading ? 'Connexion à NabooPay...' : 'Payer 500 FCFA avec Wave / Orange'}
          </button>
        </form>
      </div>
    </div>
  );
};
