'use client';

import { useState } from 'react';
import { Settings, Save, Database, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [migrating, setMigrating] = useState(false);
  const [migrationOutput, setMigrationOutput] = useState<string | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const handleDatabaseMigration = async () => {
    if (!confirm('Are you sure you want to push database schema changes? This will update the database structure.')) {
      return;
    }

    setMigrating(true);
    setMigrationOutput(null);
    setMigrationError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('atlasprime_token');

      if (!token) {
        alert('❌ Not authenticated. Please refresh and login again.');
        setMigrating(false);
        return;
      }

      const response = await fetch('/api/admin/migrate-database', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMigrationOutput(data.output + '\n' + data.generateOutput);
        alert('✅ Database schema updated successfully! Server will restart automatically.');
      } else {
        setMigrationError(data.details || data.error);
        alert('❌ Migration failed: ' + (data.details || data.error));
      }
    } catch (error: any) {
      setMigrationError(error.message);
      alert('❌ Migration failed: ' + error.message);
    } finally {
      setMigrating(false);
    }
  };
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

      {/* Database Management Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Database Management</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Push Schema Changes</h3>
            <p className="text-gray-400 text-sm mb-4">
              Update the database schema to match the Prisma schema file. This will:
            </p>
            <ul className="text-gray-400 text-sm space-y-1 mb-4 ml-4 list-disc">
              <li>Create new tables (StockPortfolio, StockWatchlist)</li>
              <li>Add new columns to existing tables</li>
              <li>Generate updated Prisma Client</li>
              <li>Accept data loss if schema changes require it</li>
            </ul>

            <button
              onClick={handleDatabaseMigration}
              disabled={migrating}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                migrating
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
              }`}
            >
              {migrating ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Updating Database...
                </>
              ) : (
                <>
                  <Database size={20} />
                  Push Database Schema
                </>
              )}
            </button>
          </div>

          {/* Migration Output */}
          {migrationOutput && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h4 className="text-emerald-400 font-semibold mb-2">✅ Success</h4>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {migrationOutput}
              </pre>
            </div>
          )}

          {/* Migration Error */}
          {migrationError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">❌ Error</h4>
              <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {migrationError}
              </pre>
            </div>
          )}

          {/* Warning Notice */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <p className="text-orange-400 text-sm">
              ⚠️ <strong>Warning:</strong> Only run this when you've updated the Prisma schema.
              Make sure to backup your database before running migrations in production.
            </p>
          </div>

          {/* Quick Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Recent Schema Updates:</h4>
            <ul className="text-gray-400 text-sm space-y-1 ml-4 list-disc">
              <li>Added StockPortfolio model for tracking user stock holdings</li>
              <li>Added StockWatchlist model for favorite stocks</li>
              <li>Updated User model relations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
