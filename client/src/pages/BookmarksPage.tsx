import React from 'react';
import { Bookmark, Trash2, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookmarks, removeBookmark } from '@/services/questionService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: bookmarks = [], isLoading } = useQuery({
    queryKey: ['user-bookmarks'],
    queryFn: getBookmarks
  });

  const removeMutation = useMutation({
    mutationFn: ({ itemType, itemId }: { itemType: string; itemId: string }) => 
      removeBookmark(itemType, itemId),
    onSuccess: () => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['user-bookmarks'] });
    },
    onError: () => {
      toast.error('Failed to remove bookmark');
    }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 flex items-center space-x-3 text-on-surface tracking-tight">
          <Bookmark className="w-8 h-8 text-secondary" />
          <span>Saved Bookmarks</span>
        </h1>
        <p className="text-on-surface-variant text-sm">
          Instant index to your starred questions, conceptual paradigms, and revision problems.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-border-hairline rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
          <Loader2 className="w-6 h-6 text-secondary animate-spin" />
          <p className="text-xs font-mono text-on-surface-variant">Loading bookmarked questions...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white border border-border-hairline rounded-2xl p-12 text-center text-on-surface-variant font-mono text-xs shadow-sm space-y-3">
          <Bookmark className="w-10 h-10 text-zinc-300 mx-auto" />
          <p>No bookmarked questions found in your personal ledger yet.</p>
          <p className="text-[11px] text-zinc-400">Click the star icon on any question in Practice or Must-Know to pin it here for rapid revision.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm: any) => {
            const item = bm.item || {};
            const prompt = item.question || item.title || item.questionText || 'Bookmarked Question';

            return (
              <div
                key={bm._id}
                className="bg-white border border-border-hairline hover:border-zinc-400 rounded-2xl p-6 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-cream text-secondary border border-border-hairline text-[11px] font-mono font-bold uppercase">
                        {item.category || bm.itemType || 'Practice'}
                      </span>
                      {item.topic && (
                        <span className="text-xs text-on-surface-variant font-mono">• {item.topic}</span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-on-surface pt-1 leading-snug">
                      {prompt}
                    </h3>
                  </div>

                  <button
                    onClick={() => removeMutation.mutate({ itemType: bm.itemType, itemId: bm.itemId })}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {item.options && Array.isArray(item.options) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {item.options.map((opt: string, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                          item.answer === idx
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                            : 'bg-surface-cream/50 border-border-hairline text-on-surface-variant'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white border border-border-hairline flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}

                {item.explanation && (
                  <div className="text-xs text-on-surface-variant bg-surface-cream/70 p-3 rounded-xl border border-border-hairline leading-relaxed">
                    <span className="font-bold text-on-surface font-mono text-[11px]">Explanation: </span>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
