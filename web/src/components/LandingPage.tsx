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
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition">Avantages</a>
            <a href="#how-it-works" className="hover:text-white transition">Comment ça marche</a>
            <a href="#security" className="hover:text-white transition">Sécurité</a>
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
        {/* Animated glowing orbs / blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/15 blur-[140px] pointer-events-none rounded-full animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-sky-500/10 blur-[120px] pointer-events-none rounded-full animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-[280px] h-[280px] bg-blue-700/10 blur-[130px] pointer-events-none rounded-full animate-blob" style={{ animationDelay: '3s' }} />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* Top Pill with Shimmer effect */}
          <div className="flex justify-center mb-6">
            <div className="relative overflow-hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-sm backdrop-blur-md">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent animate-shimmer" />
              <Sparkles className="w-3.5 h-3.5 relative z-10 text-blue-400" />
              <span className="relative z-10">N°1 des rencontres authentiques & vérifiées à Dakar</span>
            </div>
          </div>

          {/* Main Titles */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Rencontrez de vraies personnes.{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                En toute authenticité.
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal max-w-xl mx-auto">
              La communauté dakaroise certifiée 100% sans faux profils.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 glow-btn"
              >
                <span>Rejoindre gratuitement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm rounded-full border border-zinc-800 hover:border-zinc-700 transition duration-200"
              >
                Connexion
              </button>
            </div>

            {/* Trust Badges - Minimal 1-liner */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-blue-400" /> Profils vérifiés</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-blue-400" /> Données privées</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-blue-400" /> 100% Gratuit</span>
            </div>
          </div>

          {/* =========================================================================
              HERO VISUAL SHOWCASE
          ========================================================================= */}
          <div className="mt-14 relative max-w-4xl mx-auto">
            {/* Ambient card glowing frame */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800/90 bg-zinc-950/70 shadow-2xl p-2 sm:p-3 backdrop-blur-sm">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-900 group">
                <img
                  src="/assets/hero.jpg"
                  onError={(e) => {
                    // Fallback to high-res cinematic image if custom file is loading
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&auto=format&fit=crop&q=80';
                  }}
                  alt="Anonyme Pro Dakar Community"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Floating Glassmorphic Badge 1: Verified Member (Smooth Apple Float) */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 p-3 sm:p-4 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 animate-float transition-transform duration-300 hover:scale-105">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-blue-500/40 relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                      alt="Fatou"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white">Fatou, 25</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    </div>
                    <p className="text-[10px] text-zinc-300">Almadies • Styliste</p>
                  </div>
                </div>

                {/* Floating Glassmorphic Badge 2: Match alert (Smooth Apple Float Reverse) */}
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 p-3 sm:p-4 rounded-2xl bg-black/65 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 animate-float-reverse transition-transform duration-300 hover:scale-105">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/40">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-white block">C’est un Match !</span>
                    <p className="text-[10px] text-zinc-300">Intérêt mutuel instantané</p>
                  </div>
                </div>

                {/* Center Badge: Dakar */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dakar & Régions • Sénégal</span>
                </div>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white block bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                  1 500+
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Membres à Dakar</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">
                  100%
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Profils Vérifiés</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white block">
                  &lt; 2h
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">Délai validation</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm text-center hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 block">
                  0 FCFA
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">100% Gratuit Lancement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. AVANTAGES (3 PILIERS CONCIS)
      ========================================================================= */}
      <section id="features" className="py-16 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-2">
              L'expérience Anonyme Pro
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              L'essentiel, sans compromis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pilier 1 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-900/90 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">Vérification Anti-Fake</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Selfie gestuel direct + note vocale. Chaque badge bleu certifie une personne réelle à Dakar.
              </p>
            </div>

            {/* Pilier 2 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-900/90 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">Vie Privée Protégée</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pas de localisation exacte visible. Mode incognito gratuit pour choisir qui peut vous voir.
              </p>
            </div>

            {/* Pilier 3 */}
            <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-900/90 hover:-translate-y-1.5 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-600/20 transition-all">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white mb-1.5">100% Gratuit au Lancement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Likes illimités, rewinds et messagerie vocale fluide sans aucun paywall frustrant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. COMMENT ÇA MARCHE (3 ÉTAPES RAPIDES)
      ========================================================================= */}
      <section id="how-it-works" className="py-16 border-t border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Comment ça marche
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Prêt(e) à faire vos premières rencontres en 3 étapes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                1
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Créez votre profil</h4>
              <p className="text-xs text-zinc-400">Quelques photos, vos passions et vos quartiers favoris à Dakar.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                2
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Faites-vous certifier</h4>
              <p className="text-xs text-zinc-400">Double selfie rapide pour afficher le badge vérifié.</p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center hover:border-zinc-700 transition">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                3
              </div>
              <h4 className="font-bold text-sm text-white mb-1">Échangez en direct</h4>
              <p className="text-xs text-zinc-400">Match instantané, messages et notes vocales avec vos coups de cœur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SÉCURITÉ & CONFIANCE (BANDEAU UNIQUE COMPACT)
      ========================================================================= */}
      <section id="security" className="py-12 border-t border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Sécurité & Respect à Dakar</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Conforme CDP Sénégal (Loi 2008-12) • Zéro robot • Modération réactive
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full md:w-auto px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-full border border-zinc-700 transition whitespace-nowrap"
            >
              Rejoindre la communauté
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FINAL CTA
      ========================================================================= */}
      <section className="py-16 border-t border-zinc-800/80 bg-gradient-to-b from-transparent to-blue-950/20 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Prêt(e) à faire de vraies rencontres ?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400">
            Rejoignez Anonyme Pro gratuitement. Inscription en moins de 2 minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-xl shadow-blue-500/30 transition active:scale-95 flex items-center gap-2 glow-btn"
            >
              <span>Créer mon profil gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FOOTER ÉPURÉ & MINIMALISTE
      ========================================================================= */}
      <footer className="border-t border-zinc-800 bg-[#04060A] py-8 text-xs text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-zinc-600">|</span>
            <span className="text-[11px] text-zinc-400">Dakar, Sénégal 🇸🇳</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button onClick={() => setLegalModalType('cgu')} className="hover:text-zinc-300 transition">
              CGU
            </button>
            <button onClick={() => setLegalModalType('privacy')} className="hover:text-zinc-300 transition">
              Confidentialité (CDP)
            </button>
            <a href="mailto:contact@annonyme.pro" className="hover:text-zinc-300 transition">
              Contact
            </a>
          </div>

          <p className="text-[11px] text-zinc-600">
            © 2026 Anonyme Pro
          </p>
        </div>
      </footer>

      {/* Legal Modal Popup */}
      {legalModalType && (
        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      )}
    </div>
  );
};
