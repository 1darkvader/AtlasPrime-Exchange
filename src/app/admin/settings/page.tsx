'use client';

import { useState } from 'react';
import { Settings, Save, Database, RefreshCw, Mail, Send } from 'lucide-react';

export default function SettingsPage() {
  const [migrating, setMigrating] = useState(false);
  const [migrationOutput, setMigrationOutput] = useState<string | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const [testEmail, setTestEmail] = useState('');
  const [testEmailType, setTestEmailType] = useState('welcome');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

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

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter an email address');
      return;
    }

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const token = localStorage.getItem('atlasprime_token');

      if (!token) {
        alert('❌ Not authenticated. Please refresh and login again.');
        setSendingEmail(false);
        return;
      }

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          type: testEmailType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEmailResult(`✅ ${data.message}`);
        alert(`✅ Email sent successfully to ${testEmail}!`);
      } else {
        setEmailResult(`❌ ${data.message || data.error}`);
        alert(`❌ Failed to send email: ${data.message || data.error}`);
      }
    } catch (error: any) {
      setEmailResult(`❌ ${error.message}`);
      alert(`❌ Error sending email: ${error.message}`);
    } finally {
      setSendingEmail(false);
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

      {/* Email Testing Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Email Service Testing</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Send Test Email</h3>
            <p className="text-gray-400 text-sm mb-4">
              Test the Mailgun email service by sending a test email to any address.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email Type</label>
                <select
                  value={testEmailType}
                  onChange={(e) => setTestEmailType(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="welcome">Welcome Email</option>
                  <option value="kyc-approval">KYC Approval</option>
                  <option value="kyc-rejection">KYC Rejection</option>
                </select>
              </div>

              <button
                onClick={handleTestEmail}
                disabled={sendingEmail || !testEmail}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  sendingEmail || !testEmail
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90'
                }`}
              >
                {sendingEmail ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email Result */}
          {emailResult && (
            <div className={`${
              emailResult.includes('✅')
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-red-500/10 border-red-500/20'
            } border rounded-lg p-4`}>
              <p className={`text-sm ${
                emailResult.includes('✅') ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {emailResult}
              </p>
            </div>
          )}

          {/* Email Configuration Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Current Configuration:</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>📧 Domain: mail.atlasprime.trade</li>
              <li>✉️ From: AtlasPrime &lt;Hello@mail.atlasprime.trade&gt;</li>
              <li>🔑 Service: Mailgun</li>
              <li>✅ Status: {process.env.MAILGUN_API_KEY ? 'Configured' : 'Not Configured'}</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <p className="text-orange-400 text-sm">
              💡 <strong>Tip:</strong> Check your spam/junk folder if you don't receive the test email.
              Mailgun emails may be flagged on first delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
