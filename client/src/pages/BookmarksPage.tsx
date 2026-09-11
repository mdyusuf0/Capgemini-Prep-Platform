import React from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
        <span>✨ CAPGEMINI PREP BY YUSUF</span>
      </div>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center space-x-3 text-on-surface tracking-tight">
        <Bookmark className="w-8 h-8 text-secondary" />
        <span>Saved Bookmarks</span>
      </h1>
      <p className="text-on-surface-variant text-sm mb-8">Instant index to your starred questions, conceptual paradigms, and revision problems.</p>

      <div className="bg-white border border-border-hairline rounded-2xl p-12 text-center text-on-surface-variant font-mono text-xs shadow-sm">
        No bookmarked questions found in your personal ledger yet. Click the bookmark icon on any problem to pin it here.
      </div>
    </div>
  );
}
