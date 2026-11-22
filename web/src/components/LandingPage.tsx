import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  ShieldCheck,
  Sparkles,
  Heart,
  Compass,
  Lock,
  CheckCircle2,
  MessageCircle,
  MapPin,
  SlidersHorizontal,
  ArrowRight,
  Star,
  Users,
  Check,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { LegalModal } from './LegalModal';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const [legalModalType, setLegalModalType] = useState<'cgu' | 'privacy' | null>(null);

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* =========================================================================
          1. HEADER / NAVBAR
      ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#07090E]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" />
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300">
            <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
            <a href="#anti-fake" className="hover:text-white transition">Sécurité Anti-Fake</a>
            <a href="#how-it-works" className="hover:text-white transition">Comment ça marche</a>
            <a href="#community" className="hover:text-white transition">Communauté Dakar</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
            >
              Connexion
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/25 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Rejoindre</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION
      ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Top Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>N°1 des rencontres authentiques & vérifiées à Dakar</span>
            </div>
          </div>

          {/* Main Titles */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Rencontrez de vraies personnes.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                En toute authenticité.
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Fini les faux profils et les pertes de temps. Anonyme Pro réunit une communauté
              sélective à Dakar, certifiée par double vérification biométrique et vocale.
              100% gratuit pour le lancement.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-xl shadow-blue-500/30 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Créer mon profil gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm rounded-full border border-zinc-800 transition"
              >
                J’ai déjà un compte
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] font-medium text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>18+ strict</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Anti-Fake biométrique</span>
              </div>
              <span className="text-zinc-700">•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Conforme CDP Sénégal (Loi 2008-12)</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              HERO VISUAL SHOWCASE
          ========================================================================= */}
          <div className="mt-14 relative max-w-4xl mx-auto">
            {/* Ambient card glowing frame */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950/70 shadow-2xl p-2 sm:p-3">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-900">
                <img
                  src="/assets/hero.jpg"
                  onError={(e) => {
                    // Fallback to high-res cinematic image if custom file is loading
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=80';
                  }}
                  alt="Anonyme Pro Dakar Community"
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Glassmorphic Badge 1: Verified Member */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 p-3 sm:p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-500/40">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                      alt="Fatou"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white">Fatou, 25</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    </div>
                    <p className="text-[10px] text-zinc-300">Almadies • Styliste</p>
                  </div>
                </div>

                {/* Floating Glassmorphic Badge 2: Match alert */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-white block">C’est un Match !</span>
                    <p className="text-[10px] text-zinc-300">Vous avez un intérêt mutuel</p>
                  </div>
                </div>

                {/* Center Badge: Dakar */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dakar & Régions • Sénégal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURES SECTION (LES 4 PILIERS)
      ========================================================================= */}
      <section id="features" className="py-20 border-t border-zinc-800/80 bg-zinc-950/40 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Pourquoi choisir Anonyme Pro
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Une expérience pensée pour le respect et l’authenticité
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Nous avons supprimé les faux profils, les arnaques et les paywalls abusifs
              pour offrir une vraie plateforme de socialisation entre personnes bienveillantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/40 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Vérification Anti-Fake</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                2 selfies avec gestes aléatoires pris en direct + phrase audio codée de 20s.
                Chaque profil avec le badge bleu a été vérifié par notre équipe à Dakar.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/40 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Vie Privée Protégée</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Vos coordonnées GPS exactes ne sont JAMAIS divulguées. Mode Incognito gratuit pour
                n’être visible que par les personnes que vous avez vous-même likées.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/40 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Ancrage Local Dakar</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Filtrez par quartiers de Dakar (Almadies, Plateau, Ngor, Mermoz...) et par centres
                d’intérêt sénégalais (sport, cuisine, culture, affaires, sorties).
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/40 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">100% Gratuit pour le MVP</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Likes illimités, retour en arrière (rewind), messagerie fluide avec notes vocales
                et admirateurs visibles. Zéro restriction frustrante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. ANTI-FAKE PROTOCOL DEEP DIVE
      ========================================================================= */}
      <section id="anti-fake" className="py-20 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
                Sécurité & Confiance Absolue
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Le protocole anti-broutage le plus strict d’Afrique de l’Ouest
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Les faux profils et usurpations d’identité ruinent la confiance sur les réseaux.
                Sur Anonyme Pro, nous exigeons un protocole d’authenticité en temps réel impossible
                à tromper avec des photos téléchargées sur Internet :
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3 p-3.5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Double selfie avec geste aléatoire</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Prise de vue directe via la webcam/caméra (main sur le front, signe de la main, etc.).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Phrase audio de 20 secondes</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Lecture d’une phrase aléatoire avec code vocal unique pour confirmer la personne réelle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Validation humaine par notre équipe</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Chaque dossier est contrôlé à Dakar avant attribution du badge bleu certifié.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-950 border border-brand-border rounded-3xl shadow-2xl relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Badge Vérifié Anonyme Pro</h3>
                  <p className="text-xs text-zinc-400">Garantie d’un interlocuteur authentique</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Zéro robot ou faux profil importé d’Instagram</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Modération réactive avec bannissement immédiat</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Stockage chiffré des données de vérification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Tolérance zéro face aux comportements déplacés</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition"
                >
                  Faire vérifier mon compte dès maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS SECTION
      ========================================================================= */}
      <section id="how-it-works" className="py-20 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Simplicité & Élégance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Comment ça marche ?
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-zinc-400">
              3 étapes pour commencer vos premières rencontres à Dakar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                1
              </div>
              <h3 className="font-bold text-sm text-white mb-2">Créez votre profil</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Renseignez vos photos, votre ville ou quartier à Dakar, vos centres d’intérêt et ce que vous recherchez.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                2
              </div>
              <h3 className="font-bold text-sm text-white mb-2">Explorez & Swipez</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Glissez à droite pour aimer, à gauche pour passer. Utilisez les filtres d’âge et de distance selon vos envies.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-base flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                3
              </div>
              <h3 className="font-bold text-sm text-white mb-2">Discutez en direct</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dès qu’un intérêt est mutuel, le match se crée instantanément. Échangez des messages, photos et notes vocales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. COMMUNITY SECTION (DAKAR TESTIMONIALS)
      ========================================================================= */}
      <section id="community" className="py-20 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Communauté Dakaroise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Ils ont choisi l’authenticité
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                « Enfin une application de rencontres propre à Dakar sans faux profils qui vous demandent de l’argent. Le système de double selfie fait toute la différence ! »
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Aïssatou D.</h4>
                  <p className="text-[10px] text-zinc-500">Almadies, Dakar</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                « Le design est super propre, le swipe est rapide et le chat avec les notes vocales est hyper naturel. J’ai rencontré des personnes formidables. »
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                  C
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Cheikh M.</h4>
                  <p className="text-[10px] text-zinc-500">Mermoz, Dakar</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                « Très rassurant de savoir que la plateforme respecte les règles de la CDP sénégalaise. Pas de localisation GPS indiscrète, juste la vraie proximité. »
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-white">
                  I
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Ibrahima S.</h4>
                  <p className="text-[10px] text-zinc-500">Plateau, Dakar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FINAL CTA BANNER
      ========================================================================= */}
      <section className="py-16 border-t border-zinc-800/80 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Prêt à faire des rencontres qui ont du sens ?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Rejoignez Anonyme Pro aujourd’hui. Inscription gratuite en moins de 2 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-xl shadow-blue-500/30 transition active:scale-95 flex items-center gap-2"
            >
              <span>Créer mon compte gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. CORPORATE FOOTER
      ========================================================================= */}
      <footer className="border-t border-zinc-800 bg-[#04060A] pt-14 pb-10 text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-3">
              <Logo size="md" />
              <p className="text-zinc-500 text-xs leading-relaxed mt-2">
                Plateforme sociale et de rencontres authentiques à Dakar. Sécurité biométrique
                anti-faux profils, respect de la vie privée et convivialité.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500">
                <span className="font-semibold text-zinc-300">Siège :</span> Dakar, Sénégal
              </div>
            </div>

            {/* Column 2: Navigation Produit */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Produit</h4>
              <ul className="space-y-1.5 text-zinc-400">
                <li><a href="#features" className="hover:text-white transition">Découverte</a></li>
                <li><a href="#anti-fake" className="hover:text-white transition">Badge Vérifié</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">Messagerie</a></li>
                <li><a href="#features" className="hover:text-white transition">Mode Incognito</a></li>
              </ul>
            </div>

            {/* Column 3: Légal & Conformité */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Légal & Éthique</h4>
              <ul className="space-y-1.5 text-zinc-400">
                <li>
                  <button onClick={() => setLegalModalType('cgu')} className="hover:text-white transition">
                    Conditions Générales (CGU)
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition">
                    Politique de Confidentialité
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('privacy')} className="hover:text-white transition">
                    Conformité CDP (Loi 2008-12)
                  </button>
                </li>
                <li>
                  <span className="text-zinc-500">Tolérance zéro harcèlement</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Coordonnées & Support */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Coordonnées</h4>
              <div className="space-y-1.5 text-zinc-400">
                <p>
                  <span className="text-zinc-500">Email :</span>{' '}
                  <a href="mailto:contact@annonyme.pro" className="text-blue-400 hover:underline">
                    contact@annonyme.pro
                  </a>
                </p>
                <p>
                  <span className="text-zinc-500">Support :</span>{' '}
                  <a href="mailto:support@annonyme.pro" className="text-blue-400 hover:underline">
                    support@annonyme.pro
                  </a>
                </p>
                <p>
                  <span className="text-zinc-500">DPO :</span>{' '}
                  <a href="mailto:dpo@annonyme.pro" className="text-blue-400 hover:underline">
                    dpo@annonyme.pro
                  </a>
                </p>
                <p className="text-[11px] text-zinc-500 pt-2">
                  Dakar, Sénégal (Zone Pilote Almadies & Plateau)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <p>© 2026 Anonyme Pro. Tous droits réservés.</p>
            <p>Conçu et opéré au Sénégal avec fierté 🇸🇳</p>
          </div>
        </div>
      </footer>

      {/* Legal Modal Popup */}
      {legalModalType && (
        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      )}
    </div>
  );
};
