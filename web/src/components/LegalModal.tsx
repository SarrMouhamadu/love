import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'cgu' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8">
      <div className="w-full max-w-2xl bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            {type === 'cgu' ? <FileText className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">
              {type === 'cgu'
                ? 'Conditions Générales d’Utilisation (CGU)'
                : 'Politique de Confidentialité & Protection des Données'}
            </h2>
            <p className="text-xs text-zinc-400">
              Conformité Loi N° 2008-12 (Sénégal) & Commission de Protection des Données (CDP)
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed pr-2">
          {type === 'cgu' ? (
            <>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">Article 1 : Objet & Portée</span>
                <p className="mt-1">
                  Les présentes Conditions Générales d’Utilisation régissent l’accès et l’utilisation de la plateforme Anonyme Pro au Sénégal. En créant un compte, vous acceptez sans réserve ces conditions.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">Article 2 : Condition d’Âge Strict (18+)</span>
                <p className="mt-1">
                  L’accès à Anonyme Pro est strictement réservé aux personnes majeures âgées de 18 ans révolus au moment de l’inscription. Tout compte appartenant à un mineur sera immédiatement et définitivement résilié.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">Article 3 : Respect & Tolérance Zéro Harcèlement</span>
                <p className="mt-1">
                  Sont strictement prohibés : les discours haineux, le harcèlement, la sollicitation commerciale illicite, le chantage affectif ou financier, la diffusion de contenus intimes non sollicités (dickpics/nudité non consentie), l’usurpation d’identité. Tout signalement vérifié entraîne le bannissement irréversible du compte et le signalement aux autorités compétentes le cas échéant.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">Article 4 : Vérification d’Identité Anti-Faux Profils</span>
                <p className="mt-1">
                  Anonyme Pro met en œuvre un protocole biométrique strict (double selfie gestuel aléatoire + phrase audio vocale codée) examiné par notre équipe de modération. Ce processus protège la communauté contre les arnaques sentimentales (« broutage »).
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">Article 5 : Gratuité du Service</span>
                <p className="mt-1">
                  Pour la phase MVP, l’ensemble des fonctionnalités de découverte, likes illimités, retour en arrière (rewind), mode incognito et messagerie est mis à disposition à titre 100% gratuit.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">1. Engagement de Confidentialité</span>
                <p className="mt-1">
                  Anonyme Pro traite vos données à caractère personnel conformément à la <strong>Loi sénégalaise N° 2008-12 du 25 janvier 2008</strong> portant sur la protection des données à caractère personnel, sous le contrôle de la Commission des Données Personnelles (CDP) du Sénégal.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">2. Géolocalisation & Vie Privée</span>
                <p className="mt-1">
                  Vos coordonnées GPS exactes (latitude / longitude) <strong>ne sont JAMAIS communiquées</strong> aux autres utilisateurs. Seule une distance approximative en kilomètres est calculée pour vous suggérer des profils à proximité (Dakar et régions).
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">3. Données de Vérification Biométrique</span>
                <p className="mt-1">
                  Les médias soumis lors de la vérification (selfies gestuels et enregistrement vocal) sont stockés de façon hautement sécurisée et chiffrée. Ils sont consultés exclusivement par les modérateurs agréés d’Anonyme Pro pour la validation du badge et ne sont jamais rendus publics.
                </p>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <span className="font-bold text-brand-orange">4. Droits des Utilisateurs (Accès, Rectification, Suppression)</span>
                <p className="mt-1">
                  Conformément à la législation en vigueur, vous disposez d’un droit d’accès, de rectification et de suppression totale de votre compte et de toutes vos données associées à tout moment depuis les paramètres de votre profil ou sur simple demande à <strong>dpo@anonymepro.sn</strong>.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
