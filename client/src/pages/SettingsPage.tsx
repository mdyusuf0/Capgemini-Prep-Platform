import React from 'react';
import { Settings, Save, Trash2, Download } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const handleSave = () => {
    toast.success('Preferences updated successfully!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-on-surface space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold flex items-center space-x-3 text-on-surface tracking-tight">
          <Settings className="w-8 h-8 text-secondary" />
          <span>System & Account Configuration</span>
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">Manage assessment environment parameters, user credentials, and recruitment telemetry.</p>
      </div>

      <div className="bg-white border border-border-hairline rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-4">Profile Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Candidate Name</label>
            <input 
              type="text" 
              value={user?.name || "Yusuf Khan"} 
              disabled 
              className="w-full bg-surface-cream border border-border-hairline rounded-xl p-3 text-on-surface text-xs font-medium" 
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Email Endpoint</label>
            <input 
              type="email" 
              value={user?.email || "yusuf@capgemini-prep.com"} 
              disabled 
              className="w-full bg-surface-cream border border-border-hairline rounded-xl p-3 text-on-surface text-xs font-medium" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border-hairline rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-on-surface mb-4">Assessment Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Default Coding Language</label>
            <select className="w-full bg-surface-cream border border-border-hairline rounded-xl p-3 text-on-surface text-xs font-medium focus:border-black outline-none">
              <option>Java 17 (Enterprise Standard)</option>
              <option>C++ (Gnu 11)</option>
              <option>Python 3.11</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1.5 font-semibold">Active Theme Architecture</label>
            <select className="w-full bg-surface-cream border border-border-hairline rounded-xl p-3 text-on-surface text-xs font-medium" disabled>
              <option>Paper Engine Light (Default)</option>
            </select>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="mt-6 flex items-center space-x-2 bg-primary-container hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" /> <span>Save Parameters</span>
        </button>
      </div>

      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-red-600 mb-2">Critical Data Zone</h2>
        <p className="text-xs text-on-surface-variant mb-4">Export diagnostic data or purge session history.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center space-x-2 border border-border-hairline hover:bg-surface-cream px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface transition-colors cursor-pointer">
            <Download className="w-4 h-4 text-secondary" /> <span>Export Assessment Telemetry (JSON)</span>
          </button>
          <button 
            onClick={() => toast.error('Progress reset requires administrative confirmation.')}
            className="flex items-center space-x-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> <span>Purge Local Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
