import React from 'react';
import { Settings, Save, Trash2, Download } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto text-white space-y-8">
      <h1 className="text-3xl font-bold flex items-center space-x-3">
        <Settings className="w-8 h-8 text-indigo-500" />
        <span>Settings</span>
      </h1>

      <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Display Name</label>
            <input type="text" value="John Doe" disabled className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-gray-300" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
            <input type="email" value="john@example.com" disabled className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Programming Language</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white">
              <option>Java</option>
              <option>C++</option>
              <option>Python</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Theme</label>
            <select className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white" disabled>
              <option>Dark (Default)</option>
            </select>
          </div>
        </div>
        <button className="mt-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors">
          <Save className="w-4 h-4" /> <span>Save Preferences</span>
        </button>
      </div>

      <div className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex items-center space-x-2 border border-gray-600 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" /> <span>Export Data (JSON)</span>
          </button>
          <button className="flex items-center space-x-2 border border-red-900/50 hover:bg-red-900/20 text-red-400 px-4 py-2 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" /> <span>Reset All Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
}
