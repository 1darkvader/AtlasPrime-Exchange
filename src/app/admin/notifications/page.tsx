'use client';

import { Bell, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Notifications
        </h1>
        <p className="text-gray-400 mt-2">System notifications and alerts</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
        <Bell className="mx-auto mb-4 text-gray-500" size={64} />
        <h2 className="text-2xl font-bold text-white mb-2">No Notifications</h2>
        <p className="text-gray-400">All system notifications will appear here</p>
      </div>
    </div>
  );
}
