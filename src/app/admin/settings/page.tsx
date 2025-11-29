'use client';

import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Platform configuration and settings</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Platform Name</label>
            <input
              type="text"
              value="AtlasPrime Exchange"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Admin Email</label>
            <input
              type="email"
              value="admin@atlasprime.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Trading Fee (%)</label>
            <input
              type="number"
              value="0.1"
              step="0.01"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" defaultChecked />
              <span className="text-white">Enable new user registrations</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" defaultChecked />
              <span className="text-white">Require KYC for withdrawals</span>
            </label>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity">
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
