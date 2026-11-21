import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import {
  Send,
  Mic,
  Image as ImageIcon,
  ArrowLeft,
  CheckCheck,
  ShieldCheck,
  UserX,
  Flag,
} from 'lucide-react';

interface ChatViewProps {
  initialConversationId?: string | null;
  currentUser: any;
}

export const ChatView: React.FC<ChatViewProps> = ({
  initialConversationId,
  currentUser,
}) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordTimerRef = useRef<any>(null);

  // Load matches
  const fetchMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data);
      if (initialConversationId) {
        const found = data.find((m: any) => m.conversationId === initialConversationId);
        if (found) setSelectedMatch(found);
      } else if (data.length > 0 && !selectedMatch) {
        setSelectedMatch(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [initialConversationId]);

  // Load messages when selected match changes
  useEffect(() => {
    if (!selectedMatch?.conversationId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await api.getMessages(selectedMatch.conversationId);
        // backend returns desc, let's reverse for chronological display
        setMessages(res.messages.reverse());
        await api.markAsRead(selectedMatch.conversationId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedMatch?.conversationId]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedMatch?.conversationId) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      const newMsg = await api.sendMessage(selectedMatch.conversationId, textToSend);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err: any) {
      alert(err.message || 'Échec de l envoi');
    }
  };

  // Voice note simulation
  const toggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setIsRecording(false);
      const duration = recordSeconds || 3;
      // Send audio message simulation
      try {
        const newMsg = await api.sendMessage(selectedMatch.conversationId, undefined, [
          {
            fileUrl: 'https://actions.google.com/sounds/v1/speech/greeting.ogg',
            fileType: 'audio',
            duration,
          },
        ]);
        setMessages((prev) => [...prev, newMsg]);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-5.5rem)] flex border border-brand-border rounded-3xl overflow-hidden bg-zinc-950 shadow-2xl">
      {/* MATCHES LIST (Left Pane) */}
      <div
        className={`w-full md:w-80 border-r border-brand-border flex flex-col bg-zinc-900/60 ${
          selectedMatch ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-brand-border">
          <h2 className="text-lg font-bold">Vos Matchs</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            {matches.length} correspondance{matches.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
          {loadingMatches ? (
            <div className="p-8 text-center text-zinc-500 text-sm">Chargement des matchs...</div>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Aucun match pour l instant. Continuez à découvrir des profils !
            </div>
          ) : (
            matches.map((m: any) => {
              const isSelected = selectedMatch?.matchId === m.matchId;
              const photo =
                m.otherUser.photoUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

              return (
                <div
                  key={m.matchId}
                  onClick={() => setSelectedMatch(m)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
                    isSelected ? 'bg-zinc-800/90' : 'hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={photo}
                      alt={m.otherUser.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                    />
                    {m.otherUser.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-blue-500 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm truncate text-white">
                        {m.otherUser.displayName}
                      </h3>
                      {m.lastMessage && (
                        <span className="text-[10px] text-zinc-500">
                          {new Date(m.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">
                      {m.lastMessage?.content || 'Nouvelle correspondance ! Dites bonjour 👋'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CHAT CONVERSATION (Right Pane) */}
      <div
        className={`flex-1 flex flex-col bg-black/40 ${
          !selectedMatch ? 'hidden md:flex' : 'flex'
        }`}
      >
        {selectedMatch ? (
          <>
            {/* Conversation Header */}
            <div className="h-16 px-4 border-b border-brand-border flex items-center justify-between bg-zinc-900/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <img
                  src={
                    selectedMatch.otherUser.photoUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={selectedMatch.otherUser.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-sm text-white">
                      {selectedMatch.otherUser.displayName}
                    </h3>
                    {selectedMatch.otherUser.isVerified && (
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {selectedMatch.otherUser.city || 'Dakar'}
                  </span>
                </div>
              </div>

              {/* Action Menu (Safety) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (confirm('Voulez-vous bloquer cet utilisateur ?')) {
                      api.request('/safety/block', {
                        method: 'POST',
                        body: JSON.stringify({ blockedUserId: selectedMatch.otherUser.id }),
                      }).then(() => {
                        alert('Utilisateur bloqué.');
                        setSelectedMatch(null);
                        fetchMatches();
                      });
                    }
                  }}
                  className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition"
                  title="Bloquer"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 text-xs">
                  Vous avez matché ! Envoyez le premier message.
                </div>
              ) : (
                messages.map((msg: any) => {
                  const isMe = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-zinc-800 text-zinc-100 rounded-bl-xs'
                        }`}
                      >
                        {msg.content && <p className="leading-relaxed">{msg.content}</p>}

                        {/* Attachments (Voice note or Image) */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-1 mt-1">
                            {msg.attachments.map((att: any) =>
                              att.fileType === 'audio' ? (
                                <div
                                  key={att.id}
                                  className="flex items-center gap-2 py-1 px-2 bg-black/20 rounded-xl"
                                >
                                  <Mic className="w-4 h-4 text-white" />
                                  <span className="text-xs font-mono">
                                    Message vocal ({att.duration || 5}s)
                                  </span>
                                </div>
                              ) : (
                                <img
                                  key={att.id}
                                  src={att.fileUrl}
                                  alt="Média"
                                  className="max-h-48 rounded-xl object-cover"
                                />
                              ),
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1 px-1">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
                          <CheckCheck
                            className={`w-3.5 h-3.5 ${
                              msg.isRead ? 'text-blue-400' : 'text-zinc-500'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-brand-border bg-zinc-900/60 backdrop-blur-md flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => alert('Sélectionnez une photo de votre galerie')}
                className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition"
                title="Envoyer une photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full transition ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
                title="Message vocal"
              >
                <Mic className="w-5 h-5" />
              </button>

              {isRecording ? (
                <div className="flex-1 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center justify-between">
                  <span>Enregistrement en cours... ({recordSeconds}s)</span>
                  <span className="font-semibold text-[10px]">Cliquez sur le micro pour envoyer</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Écrivez un message..."
                  className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              )}

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-30 disabled:hover:bg-blue-600 shadow-sm shadow-blue-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 text-sm">
            Sélectionnez une correspondance pour commencer à discuter.
          </div>
        )}
      </div>
    </div>
  );
};
