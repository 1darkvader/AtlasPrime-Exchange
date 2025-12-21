"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  XCircle, AlertCircle, Copy, Check, Search, RefreshCw,
  ExternalLink, Upload, CheckCircle2, Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getNetworksByToken, type DepositAddress } from "@/lib/depositWallets";

export function DepositModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [selectedNetwork, setSelectedNetwork] = useState<DepositAddress | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchNetwork, setSearchNetwork] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  // New fields for deposit confirmation
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<'address' | 'confirm'>("address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const availableNetworks = getNetworksByToken(selectedAsset);
  const popularAssets = ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL", "MATIC", "AVAX", "ADA", "XRP"];

  useEffect(() => {
    if (availableNetworks.length > 0 && !selectedNetwork) {
      setSelectedNetwork(availableNetworks[0]);
    }
  }, [selectedAsset, availableNetworks, selectedNetwork]);

  useEffect(() => {
    if (selectedNetwork) {
      setLoadingQR(true);
      fetch(`/api/qrcode?address=${encodeURIComponent(selectedNetwork.address)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQrCode(data.qrCode);
          }
        })
        .catch(err => console.error('QR code error:', err))
        .finally(() => setLoadingQR(false));
    }
  }, [selectedNetwork]);

  const handleCopyAddress = () => {
    if (selectedNetwork) {
      navigator.clipboard.writeText(selectedNetwork.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNetworkSelect = (network: DepositAddress) => {
    setSelectedNetwork(network);
    setSearchNetwork("");
  };

  const filteredNetworks = availableNetworks.filter(n =>
    n.chain.toLowerCase().includes(searchNetwork.toLowerCase()) ||
    n.network.toLowerCase().includes(searchNetwork.toLowerCase())
  );

  const handleContinueToConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmDeposit = async () => {
    if (!user || !selectedNetwork || !amount) {
      alert('Please complete all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get auth token
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        alert('Please log in to continue');
        return;
      }

      // Create transaction
      const createResponse = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'DEPOSIT',
          asset: selectedAsset,
          amount: amountNum,
          network: selectedNetwork.chain,
          address: selectedNetwork.address,
        }),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        console.error('Create deposit error:', createData);
        alert(createData.message || 'Failed to create deposit request');
        return;
      }

      setTransactionId(createData.transaction.id);

      // Confirm transaction (sends Telegram notification)
      const confirmResponse = await fetch('/api/transactions/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: createData.transaction.id,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        alert('✅ Deposit confirmed! Funds will be available after 1 blockchain confirmation.');
        onClose();
      } else {
        console.error('Confirm deposit error:', confirmData);
        alert(confirmData.message || 'Failed to confirm deposit');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {step === 'address' ? 'Deposit Crypto' : 'Confirm Deposit'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {step === 'address' ? (
          <div className="space-y-4">
            {/* Select Asset */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Asset</label>
              <div className="grid grid-cols-5 gap-2">
                {popularAssets.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedAsset === asset
                        ? "bg-emerald-500 text-white"
                        : "bg-card hover:bg-card/80 text-muted-foreground"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Deposit Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the amount you will deposit
              </p>
            </div>

            {/* Select Network */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Network ({availableNetworks.length} available)
              </label>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchNetwork}
                  onChange={(e) => setSearchNetwork(e.target.value)}
                  placeholder="Search networks..."
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {filteredNetworks.map((network) => (
                  <button
                    key={network.chain + network.network}
                    onClick={() => handleNetworkSelect(network)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedNetwork?.chain === network.chain
                        ? "bg-emerald-500/20 border-2 border-emerald-500"
                        : "bg-card border border-border hover:bg-card/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{network.chain}</div>
                        <div className="text-xs text-muted-foreground">{network.network}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{network.chainType}</div>
                        <div className="text-xs font-mono text-emerald-400">{network.nativeCoin}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Address */}
            {selectedNetwork && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Deposit Address</label>
                  <div className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">
                        {selectedNetwork.chain} Network
                      </span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-semibold">
                        {selectedNetwork.chainType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 p-3 bg-background rounded-lg">
                        <div className="text-xs font-mono break-all">
                          {selectedNetwork.address}
                        </div>
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="p-3 hover:bg-background rounded-lg transition-all"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="mt-4 flex justify-center">
                      {loadingQR ? (
                        <div className="w-48 h-48 bg-background rounded-lg flex items-center justify-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : qrCode ? (
                        <div className="p-4 bg-white rounded-lg">
                          <img
                            src={qrCode}
                            alt={`QR Code for ${selectedNetwork.address}`}
                            className="w-40 h-40"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-400">
                      <strong>Important:</strong> Only send {selectedAsset} to this address via {selectedNetwork.chain} network.
                      Sending any other asset may result in permanent loss.
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinueToConfirm}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
                >
                  Continue to Confirm
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Transaction Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-semibold">{selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-emerald-400">{amount} {selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-semibold">{selectedNetwork?.chain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit Address:</span>
                  <span className="font-mono text-xs">{selectedNetwork?.address.substring(0, 10)}...{selectedNetwork?.address.substring(selectedNetwork.address.length - 10)}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-400">
                  <strong>Next Steps:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Send exactly <strong>{amount} {selectedAsset}</strong> to the address above</li>
                    <li>Click "Confirm Transaction" below after sending</li>
                    <li>Funds will be available after 1 blockchain confirmation (typically 10-30 minutes)</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('address')}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-card hover:bg-card/80 text-foreground font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmDeposit}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Transaction
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function WithdrawModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [step, setStep] = useState<'form' | 'confirm'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popularAssets = ["USDT", "USDC", "BTC", "ETH", "BNB", "SOL"];
  const networks = ["ERC20", "TRC20", "BEP20", "Polygon", "Arbitrum", "Optimism"];

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!address) {
      alert('Please enter withdrawal address');
      return;
    }
    if (!selectedNetwork) {
      alert('Please select a network');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmWithdrawal = async () => {
    if (!user) {
      alert('Please log in to continue');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get auth token
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        alert('Please log in to continue');
        return;
      }

      // Create withdrawal transaction
      const createResponse = await fetch('/api/transactions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'WITHDRAWAL',
          asset: selectedAsset,
          amount: amountNum,
          network: selectedNetwork,
          address: address,
        }),
      });

      const createData = await createResponse.json();

      if (!createData.success) {
        console.error('Create withdrawal error:', createData);
        alert(createData.message || 'Failed to create withdrawal request');
        return;
      }

      // Confirm withdrawal (sends Telegram notification)
      const confirmResponse = await fetch('/api/transactions/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: createData.transaction.id,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        alert('✅ Withdrawal confirmed! Funds will be processed after security verification.');
        onClose();
      } else {
        alert(confirmData.message || 'Failed to confirm withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {step === 'form' ? 'Withdraw Crypto' : 'Confirm Withdrawal'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-lg transition-all">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <div className="space-y-4">
            {/* Select Asset */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Asset</label>
              <div className="grid grid-cols-3 gap-2">
                {popularAssets.map((asset) => (
                  <button
                    key={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedAsset === asset
                        ? "bg-red-500 text-white"
                        : "bg-card hover:bg-card/80 text-muted-foreground"
                    }`}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Available: 0.00 {selectedAsset}</span>
                <button className="text-red-400 hover:text-red-300">Max</button>
              </div>
            </div>

            {/* Network */}
            <div>
              <label className="block text-sm font-medium mb-2">Network</label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Network</option>
                {networks.map((network) => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">Withdrawal Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter destination address"
                className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
              />
            </div>

            {/* Warning */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-400">
                  <strong>Warning:</strong> Please ensure the address and network are correct.
                  Withdrawals to wrong addresses cannot be recovered.
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Withdrawal Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-semibold">{selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-red-400">{amount} {selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="font-semibold">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="font-mono text-xs">{address.substring(0, 10)}...{address.substring(address.length - 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee:</span>
                  <span className="font-semibold">~0.001 {selectedAsset}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-400">
                  <strong>Next Steps:</strong>
                  <p className="mt-2">
                    Click "Confirm Withdrawal" to submit your request.
                    Funds will be processed after security verification (typically 10-30 minutes).
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-card hover:bg-card/80 text-foreground font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmWithdrawal}
                disabled={isSubmitting}
                className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Withdrawal
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
