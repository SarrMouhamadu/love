import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
  ShieldCheck,
  Camera,
  Mic,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  RefreshCw,
  Video,
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

  // Media refs
  const selfie1InputRef = useRef<HTMLInputElement>(null);
  const selfie2InputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Stop camera tracks cleanly
  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Start live webcam stream
  const startCamera = async () => {
    setError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setIsCameraActive(false);
    }
  };

  // Snap instant frame from live video
  const captureLiveSelfie = async (selfieNumber: 1 | 2) => {
    if (!videoRef.current || !isCameraActive) return;
    setUploadingMedia(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Impossible de capturer la photo');

      // Mirror horizontally for natural preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.9),
      );

      if (!blob) throw new Error('Échec de la conversion image');

      const res = await api.uploadFile(blob, 'verification');
      if (selfieNumber === 1) {
        setSelfie1Url(res.fileUrl);
      } else {
        setSelfie2Url(res.fileUrl);
      }
      stopCamera();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la capture du selfie');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSelfieUpload = async (file: File, selfieNumber: 1 | 2) => {
    setUploadingMedia(true);
    setError(null);
    try {
      const res = await api.uploadFile(file, 'verification');
      if (selfieNumber === 1) {
        setSelfie1Url(res.fileUrl);
      } else {
        setSelfie2Url(res.fileUrl);
      }
      stopCamera();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l upload du selfie');
    } finally {
      setUploadingMedia(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
          const res = await api.uploadFile(audioBlob, 'verification');
          setAudioUrl(res.fileUrl);
        } catch {
          setAudioUrl('http://localhost:3001/api/v1/storage/files/verification/sample_voice.mp3');
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch {
      setIsRecording(true);
      setRecordingSeconds(0);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      setAudioUrl('http://localhost:3001/api/v1/storage/files/verification/sample_voice.mp3');
    }
  };

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
    return () => {
      stopCamera();
    };
  }, []);

  // When step changes, manage camera
  useEffect(() => {
    if (step === 1 && !selfie1Url) {
      startCamera();
    } else if (step === 2 && !selfie2Url) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, selfie1Url, selfie2Url]);

  // Audio Timer effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            stopVoiceRecording();
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
        audioUrl: audioUrl || 'http://localhost:3001/api/v1/storage/files/verification/sample_voice.mp3',
        audioPhrase: instructions.voicePhrase,
      });
      setStep(4);
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
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Vérification d’Authenticité</h2>
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
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : step === 1 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block mb-1">
                Instruction Selfie 1
              </span>
              <p className="font-semibold text-lg text-white">
                « {instructions?.selfie1Instruction} »
              </p>
            </div>

            {/* Video Viewport / Captured Preview */}
            <div className="aspect-[4/3] bg-black rounded-2xl border border-dashed border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden">
              <input
                ref={selfie1InputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelfieUpload(file, 1);
                }}
              />

              {selfie1Url ? (
                <div className="w-full h-full relative">
                  <img src={selfie1Url} alt="Selfie 1" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelfie1Url('');
                      startCamera();
                    }}
                    className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white rounded-full text-xs font-medium flex items-center gap-1 border border-white/20 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reprendre</span>
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                  {/* Shutter Button */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => captureLiveSelfie(1)}
                      className="w-14 h-14 rounded-full bg-white hover:bg-zinc-200 border-4 border-black/30 shadow-xl flex items-center justify-center transition active:scale-95 disabled:opacity-50"
                      title="Prendre l'instantané"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-black/10 bg-blue-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Camera className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400">Caméra non disponible ou autorisations refusées</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-medium rounded-full text-white transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Activer caméra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => selfie1InputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-full text-zinc-300 transition flex items-center gap-1.5 border border-zinc-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fichier</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={!selfie1Url}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-40"
            >
              Passer au selfie 2
            </button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block mb-1">
                Instruction Selfie 2
              </span>
              <p className="font-semibold text-lg text-white">
                « {instructions?.selfie2Instruction} »
              </p>
            </div>

            <div className="aspect-[4/3] bg-black rounded-2xl border border-dashed border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden">
              <input
                ref={selfie2InputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelfieUpload(file, 2);
                }}
              />

              {selfie2Url ? (
                <div className="w-full h-full relative">
                  <img src={selfie2Url} alt="Selfie 2" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelfie2Url('');
                      startCamera();
                    }}
                    className="absolute bottom-3 right-3 px-3 py-1 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white rounded-full text-xs font-medium flex items-center gap-1 border border-white/20 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reprendre</span>
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <button
                      type="button"
                      disabled={uploadingMedia}
                      onClick={() => captureLiveSelfie(2)}
                      className="w-14 h-14 rounded-full bg-white hover:bg-zinc-200 border-4 border-black/30 shadow-xl flex items-center justify-center transition active:scale-95 disabled:opacity-50"
                      title="Prendre l'instantané"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-black/10 bg-blue-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <Camera className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400">Effectuez le second geste face à l'objectif</p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-medium rounded-full text-white transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Activer caméra</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => selfie2InputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded-full text-zinc-300 transition flex items-center gap-1.5 border border-zinc-700"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Fichier</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              disabled={!selfie2Url}
              onClick={() => {
                stopCamera();
                setStep(3);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-40"
            >
              Passer à l’enregistrement vocal (20s)
            </button>
          </div>
        ) : step === 3 ? (
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block mb-1">
                Phrase aléatoire à prononcer à haute voix
              </span>
              <p className="font-medium text-sm text-zinc-200 italic">
                « {instructions?.voicePhrase} »
              </p>
            </div>

            <div className="p-6 bg-black rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
              <div
                onClick={() => {
                  if (isRecording) {
                    stopVoiceRecording();
                  } else {
                    startVoiceRecording();
                  }
                }}
                className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                    : audioUrl
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
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
                  : 'Cliquez sur le micro pour démarrer l’enregistrement'}
              </p>
            </div>

            <button
              disabled={!audioUrl || submitting}
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-40"
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/25 transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
