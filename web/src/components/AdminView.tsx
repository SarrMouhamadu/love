import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  ShieldAlert,
  BarChart3,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Volume2,
  Camera,
  RefreshCw,
  Ban,
  Check,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [tab, setTab] = useState<'analytics' | 'verifications' | 'reports' | 'audit'>('analytics');
  const [loading, setLoading] = useState(true);

  // Analytics data
  const [analytics, setAnalytics] = useState<any | null>(null);

  // Verifications data
  const [verifications, setVerifications] = useState<any[]>([]);

  // Reports data
  const [reports, setReports] = useState<any[]>([]);

  // Audit logs data
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const fetchTabContent = async () => {
    setLoading(true);
    try {
      if (tab === 'analytics') {
        const data = await api.getAdminAnalytics();
        setAnalytics(data);
      } else if (tab === 'verifications') {
        const data = await api.getPendingVerifications();
        setVerifications(data.requests || []);
      } else if (tab === 'reports') {
        const data = await api.getAdminReports();
        setReports(data.reports || []);
      } else if (tab === 'audit') {
        const data = await api.getAdminAuditLogs();
        setAuditLogs(data.logs || []);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabContent();
  }, [tab]);

  // Review verification
  const handleReviewVerification = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    let rejectionReason: string | undefined;
    if (status === 'REJECTED') {
      const reason = prompt('Motif du rejet (ex: Les selfies ne correspondent pas au profil) :');
      if (!reason) return;
      rejectionReason = reason;
    }

    try {
      await api.reviewVerification(id, status, rejectionReason);
      alert(status === 'VERIFIED' ? 'Profil vérifié avec succès !' : 'Demande rejetée.');
      fetchTabContent();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du traitement');
    }
  };

  // Action report
  const handleActionReport = async (reportId: string, action: 'DISMISS' | 'BAN') => {
    try {
      if (action === 'DISMISS') {
        await api.actionReport(reportId, 'DISMISSED', false, 'Signalement classé sans suite.');
        alert('Signalement classé sans suite.');
      } else {
        const notes = prompt('Motif de la sanction / du bannissement :') || 'Infraction aux règles de la communauté';
        await api.actionReport(reportId, 'ACTIONED', true, notes);
        alert('Utilisateur banni et signalement traité.');
      }
      fetchTabContent();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Console d Administration & Modération</h1>
            <p className="text-xs text-zinc-400">Supervision de la communauté Anonyme Pro (Dakar)</p>
          </div>
        </div>

        <button
          onClick={fetchTabContent}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-full text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-brand-border">
        <button
          onClick={() => setTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === 'analytics'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Tableau de Bord</span>
        </button>

        <button
          onClick={() => setTab('verifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === 'verifications'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Vérifications en Attente</span>
        </button>

        <button
          onClick={() => setTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === 'reports'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Signalements & Abus</span>
        </button>

        <button
          onClick={() => setTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            tab === 'audit'
              ? 'bg-brand-orange text-white shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Journal d Audit</span>
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tab === 'analytics' && analytics ? (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-zinc-400">Total Utilisateurs</span>
              <p className="text-2xl font-extrabold mt-1 text-white">{analytics.users.total}</p>
              <span className="text-[10px] text-green-400">
                {analytics.users.active} actifs
              </span>
            </div>

            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-zinc-400">Profils Vérifiés</span>
              <p className="text-2xl font-extrabold mt-1 text-blue-400">
                {analytics.users.verified}
              </p>
              <span className="text-[10px] text-zinc-500">Anti-fake approuvés</span>
            </div>

            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-zinc-400">Interactions (Likes)</span>
              <p className="text-2xl font-extrabold mt-1 text-brand-orange">
                {analytics.engagement.totalLikes}
              </p>
              <span className="text-[10px] text-zinc-500">
                {analytics.engagement.totalMatches} matchs créés
              </span>
            </div>

            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-zinc-400">Messages Échangés</span>
              <p className="text-2xl font-extrabold mt-1 text-white">
                {analytics.engagement.totalMessages}
              </p>
              <span className="text-[10px] text-zinc-500">Discussions actives</span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Cities */}
            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">Répartition Géographique (Dakar)</h3>
              <div className="space-y-2">
                {analytics.users.topCities?.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-900">
                    <span className="text-zinc-300">{c.city || 'Dakar'}</span>
                    <span className="font-semibold text-brand-orange">{c.count} membres</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Overview */}
            <div className="bg-zinc-950 border border-brand-border rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3">Sécurité & Vigilance</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl">
                  <span>Demandes de vérification en attente</span>
                  <span className="font-bold text-blue-400">
                    {analytics.safety.pendingVerifications}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl">
                  <span>Signalements à traiter</span>
                  <span className="font-bold text-amber-400">
                    {analytics.safety.pendingReports}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-xl">
                  <span>Comptes suspendus ou bannis</span>
                  <span className="font-bold text-red-400">
                    {analytics.safety.suspendedOrBlockedUsers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : tab === 'verifications' ? (
        <div className="space-y-4">
          {verifications.length === 0 ? (
            <div className="bg-zinc-950 border border-brand-border rounded-3xl p-12 text-center text-zinc-500 text-sm">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
              Toutes les demandes de vérification ont été traitées !
            </div>
          ) : (
            verifications.map((req: any) => {
              const selfie1 = req.media.find((m: any) => m.type === 'SELFIE_INSTRUCTION_1');
              const selfie2 = req.media.find((m: any) => m.type === 'SELFIE_INSTRUCTION_2');
              const audio = req.media.find((m: any) => m.type === 'VOICE_RECORDING');
              const profilePhoto = req.user.profile?.photos?.[0]?.url;

              return (
                <div
                  key={req.id}
                  className="bg-zinc-950 border border-brand-border rounded-3xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                    <div className="flex items-center gap-3">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profil"
                          className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-bold">
                          {req.user.profile?.displayName?.[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-sm text-white">
                          {req.user.profile?.displayName} ({req.user.email})
                        </h3>
                        <span className="text-xs text-zinc-400">
                          {req.user.profile?.gender === 'MALE' ? 'Homme' : 'Femme'} • Soumis le{' '}
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewVerification(req.id, 'REJECTED')}
                        className="flex items-center gap-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Rejeter</span>
                      </button>

                      <button
                        onClick={() => handleReviewVerification(req.id, 'VERIFIED')}
                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>
                    </div>
                  </div>

                  {/* Media comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Selfie 1 */}
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 mb-2">
                        <Camera className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Selfie 1 : « {selfie1?.instructionText} »</span>
                      </div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black">
                        {selfie1?.fileUrl && (
                          <img src={selfie1.fileUrl} alt="Selfie 1" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>

                    {/* Selfie 2 */}
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 mb-2">
                        <Camera className="w-3.5 h-3.5 text-brand-orange" />
                        <span>Selfie 2 : « {selfie2?.instructionText} »</span>
                      </div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-black">
                        {selfie2?.fileUrl && (
                          <img src={selfie2.fileUrl} alt="Selfie 2" className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>

                    {/* Voice Memo */}
                    <div className="p-3 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 mb-2">
                          <Volume2 className="w-3.5 h-3.5 text-brand-orange" />
                          <span>Enregistrement Vocal (20s)</span>
                        </div>
                        <p className="text-xs text-zinc-400 italic bg-black/40 p-2.5 rounded-xl border border-zinc-800">
                          {audio?.instructionText}
                        </p>
                      </div>

                      <div className="mt-4 p-3 bg-black rounded-xl border border-zinc-800 text-center">
                        <span className="text-xs text-zinc-400 block mb-2">Lecture audio</span>
                        <audio controls className="w-full h-8" src={audio?.fileUrl} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : tab === 'reports' ? (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-zinc-950 border border-brand-border rounded-3xl p-12 text-center text-zinc-500 text-sm">
              <Check className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
              Aucun signalement en attente.
            </div>
          ) : (
            reports.map((rep: any) => (
              <div
                key={rep.id}
                className="bg-zinc-950 border border-brand-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md text-[10px] font-bold">
                      {rep.reason}
                    </span>
                    <span className="text-xs text-zinc-400">
                      Signaleur: {rep.reporter.email}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-white mt-1">
                    Signalé : {rep.reported?.profile?.displayName || rep.reported?.email}
                  </h3>
                  {rep.details && (
                    <p className="text-xs text-zinc-300 mt-1 italic bg-zinc-900/60 p-2 rounded-lg">
                      « {rep.details} »
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActionReport(rep.id, 'DISMISS')}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition"
                  >
                    Classer sans suite
                  </button>

                  <button
                    onClick={() => handleActionReport(rep.id, 'BAN')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Bannir le compte</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Audit Logs */
        <div className="bg-zinc-950 border border-brand-border rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-brand-border">
            <h2 className="font-bold text-sm text-white">Registre d Audit Infalsifiable</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Historique complet des consultations et sanctions par l équipe administrative
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Administrateur</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entité Cible</th>
                  <th className="px-4 py-3">Adresse IP</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-zinc-900/40">
                    <td className="px-4 py-3 font-medium text-white">{log.adminUser?.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-mono text-zinc-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{log.targetEntity}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500">{log.ipAddress || 'local'}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
