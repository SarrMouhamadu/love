import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  Camera,
  Mic,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface VerificationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [instructions, setInstructions] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verification media state
  const [selfie1Url, setSelfie1Url] = useState('');
  const [selfie2Url, setSelfie2Url] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  // Voice recording timer
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const data = await api.getVerificationInstructions();
        setInstructions(data);
      } catch (err: any) {
        setError(err.message || 'Impossible de charger les instructions');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            setIsRecording(false);
            setAudioUrl('https://storage.example.com/audio/verification_recorded.mp3');
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.submitVerification({
        selfie1Url: selfie1Url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        selfie1Instruction: instructions.selfie1Instruction,
        selfie2Url: selfie2Url || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
        selfie2Instruction: instructions.selfie2Instruction,
        audioUrl: audioUrl || 'https://storage.example.com/audio/sample_voice.mp3',
        audioPhrase: instructions.voicePhrase,
      });
      setStep(4); // Success screen
    } catch (err: any) {
      setError(err.message || 'Échec de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Vérification d Authenticité</h2>
            <p className="text-xs text-zinc-400">Étape {step} sur 3 — Anti-faux profils</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-orange block mb-1">
                Instruction Selfie 1
              </span>
              <p className="font-semibold text-lg text-white">
                « {instructions?.selfie1Instruction} »
              </p>
            </div>

            <div className="aspect-video bg-black rounded-2xl border border-dashed border-zinc-700 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              {selfie1Url ? (
                <img src={selfie1Url} alt="Selfie 1" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-zinc-500 mb-2" />
                  <p className="text-xs text-zinc-400">Prenez votre selfie face caméra en suivant la consigne</p>
                  <button
                    type="button"
                    onClick={() => setSelfie1Url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500')}
                    className="mt-3 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-full text-white transition border border-zinc-700"
                  >
                    Capturer le selfie 1
                  </button>
                </>
              )}
            </div>

            <button
              disabled={!selfie1Url}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition disabled:opacity-40"
            >
              Passer au selfie 2
            </button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-orange block mb-1">
                Instruction Selfie 2
              </span>
              <p className="font-semibold text-lg text-white">
                « {instructions?.selfie2Instruction} »
              </p>
            </div>

            <div className="aspect-video bg-black rounded-2xl border border-dashed border-zinc-700 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              {selfie2Url ? (
                <img src={selfie2Url} alt="Selfie 2" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-10 h-10 text-zinc-500 mb-2" />
                  <p className="text-xs text-zinc-400">Effectuez le second geste demandé face caméra</p>
                  <button
                    type="button"
                    onClick={() => setSelfie2Url('https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500')}
                    className="mt-3 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-full text-white transition border border-zinc-700"
                  >
                    Capturer le selfie 2
                  </button>
                </>
              )}
            </div>

            <button
              disabled={!selfie2Url}
              onClick={() => setStep(3)}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition disabled:opacity-40"
            >
              Passer à l enregistrement vocal (20s)
            </button>
          </div>
        ) : step === 3 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-orange block mb-1">
                Phrase aléatoire à prononcer à haute voix
              </span>
              <p className="font-medium text-sm text-zinc-200 italic">
                « {instructions?.voicePhrase} »
              </p>
            </div>

            <div className="p-6 bg-black rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
              <div
                onClick={() => {
                  if (!isRecording && recordingSeconds < 20) {
                    setIsRecording(true);
                  }
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : audioUrl
                    ? 'bg-green-500/20 text-green-400 border border-green-500'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Mic className="w-8 h-8" />
              </div>

              <div className="flex items-center gap-1.5 mt-3 text-xs font-mono text-zinc-300">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  {recordingSeconds}s / {instructions?.voiceDurationSeconds || 20}s
                </span>
              </div>

              <p className="text-xs text-zinc-400 mt-2">
                {isRecording
                  ? 'Enregistrement en cours... Lisez la phrase ci-dessus distinctement.'
                  : audioUrl
                  ? 'Note vocale enregistrée avec succès.'
                  : 'Cliquez sur le micro pour démarrer l enregistrement de 20 secondes'}
              </p>
            </div>

            <button
              disabled={!audioUrl || submitting}
              onClick={handleSubmit}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition shadow-lg shadow-brand-orange/20 disabled:opacity-40"
            >
              {submitting ? 'Transmission sécurisée...' : 'Soumettre mon dossier de vérification'}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto text-blue-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold">Demande envoyée avec succès !</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Vos selfies et votre enregistrement vocal ont été transmis à notre équipe de
              vérification à Dakar. Votre badge sera activé après validation (délai moyen : moins de
              2h).
            </p>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-full border border-zinc-700 transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
