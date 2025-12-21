'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Shield, Smartphone, AlertCircle, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setIs2FAEnabled(user.twoFactorEnabled);
    }
  }, [isAuthenticated, user, router]);

  const handleSetup2FA = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowSetup(true);
      } else {
        setError(data.message || 'Failed to setup 2FA');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('2FA enabled successfully!');
        setIs2FAEnabled(true);
        setShowSetup(false);
        setVerificationCode('');

        // Refresh user data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter your 6-digit authentication code to disable 2FA');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('atlasprime_token');
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('2FA disabled successfully');
        setIs2FAEnabled(false);
        setVerificationCode('');

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setSuccess('Secret key copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Security Settings
            </h1>
            <p className="text-gray-400">
              Manage your account security and two-factor authentication
            </p>
          </div>

          {/* 2FA Status Card */}
          <div className="glass rounded-2xl p-6 mb-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Shield className="text-blue-400" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-400">
                    {is2FAEnabled ? 'Enabled' : 'Not enabled'}
                  </p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                is2FAEnabled
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
              }`}>
                {is2FAEnabled ? 'Active' : 'Inactive'}
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your authenticator app when signing in.
            </p>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-green-400">{success}</span>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            {/* 2FA Not Enabled - Setup */}
            {!is2FAEnabled && !showSetup && (
              <button
                onClick={handleSetup2FA}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            )}

            {/* 2FA Setup Process */}
            {!is2FAEnabled && showSetup && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Smartphone size={20} className="text-blue-400" />
                    Step 1: Scan QR Code
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                  </p>

                  {qrCode && (
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-white rounded-xl">
                        <Image
                          src={qrCode}
                          alt="2FA QR Code"
                          width={200}
                          height={200}
                          className="w-[200px] h-[200px]"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Or enter this key manually:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-sm font-mono text-blue-400">
                        {secret}
                      </code>
                      <button
                        onClick={copySecret}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        title="Copy secret"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Step 2: Enter Verification Code
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter the 6-digit code from your authenticator app to complete setup
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                      maxLength={6}
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowSetup(false);
                          setVerificationCode('');
                          setError('');
                        }}
                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleVerify2FA}
                        disabled={loading || verificationCode.length !== 6}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Verify & Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2FA Enabled - Disable Option */}
            {is2FAEnabled && (
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    Your account is protected with two-factor authentication
                  </p>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-2">Disable 2FA</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter your authentication code to disable two-factor authentication
                  </p>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500"
                      maxLength={6}
                    />

                    <button
                      onClick={handleDisable2FA}
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Security Tips */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Security Tips</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <span>Save your backup codes in a secure location</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <span>Use a strong, unique password for your account</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <span>Never share your authentication codes with anyone</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <span>Enable email notifications for account activities</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
