import React from 'react';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
        <Bookmark className="w-8 h-8 text-indigo-500" />
        <span>Bookmarks</span>
      </h1>
      <p className="text-gray-400 mb-8">Quick access to your saved questions and topics.</p>

      <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-8 text-center text-gray-500">
        You haven't bookmarked any items yet.
      </div>
    </div>
  );
}
