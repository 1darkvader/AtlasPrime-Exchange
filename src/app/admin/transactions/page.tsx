'use client';

import { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, Download } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: string;
  fee: string | null;
  status: string;
  txHash: string | null;
  address: string | null;
  network: string | null;
  createdAt: string;
  completedAt: string | null;
  userConfirmed: boolean;
  adminApproved: boolean;
  approvedBy: string | null;
  rejectionReason: string | null;
  proofUrl: string | null;
  approvedAt: string | null;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function TransactionsMonitoring() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [page, typeFilter, statusFilter, assetFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(assetFilter && { asset: assetFilter })
      });

      const res = await fetch(`/api/admin/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId: string) => {
    if (!confirm('Are you sure you want to approve this transaction? Funds will be credited/debited immediately.')) {
      return;
    }

    try {
      const token = localStorage.getItem('atlasprime_token');
      const res = await fetch('/api/admin/transactions/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          action: 'approve',
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Transaction approved successfully!');
        fetchTransactions(); // Refresh list
      } else {
        alert(`❌ Failed to approve: ${data.message}`);
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('❌ An error occurred while approving the transaction');
    }
  };

  const handleReject = async (transactionId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('atlasprime_token');
      const res = await fetch('/api/admin/transactions/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          action: 'reject',
          rejectionReason: reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Transaction rejected');
        fetchTransactions(); // Refresh list
      } else {
        alert(`❌ Failed to reject: ${data.message}`);
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('❌ An error occurred while rejecting the transaction');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowDownCircle className="text-green-500" size={20} />;
      case 'WITHDRAWAL':
        return <ArrowUpCircle className="text-red-500" size={20} />;
      case 'TRANSFER':
        return <ArrowLeftRight className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Type', 'User', 'Asset', 'Amount', 'Fee', 'Status', 'Date', 'TX Hash'].join(','),
      ...transactions.map(tx => [
        tx.type,
        tx.user.username,
        tx.asset,
        tx.amount,
        tx.fee || '0',
        tx.status,
        new Date(tx.createdAt).toLocaleString(),
        tx.txHash || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Transaction Monitoring
          </h1>
          <p className="text-gray-400 mt-2">Monitor all platform transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowDownCircle className="text-green-500" size={24} />
            <div className="text-gray-400 text-sm">Deposits</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {transactions.filter(t => t.type === 'DEPOSIT').length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpCircle className="text-red-500" size={24} />
            <div className="text-gray-400 text-sm">Withdrawals</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {transactions.filter(t => t.type === 'WITHDRAWAL').length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ArrowLeftRight className="text-blue-500" size={24} />
            <div className="text-gray-400 text-sm">Transfers</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {transactions.filter(t => t.type === 'TRANSFER').length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="text-orange-500" size={24} />
            <div className="text-gray-400 text-sm">Needs Approval</div>
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {transactions.filter(t => t.userConfirmed && !t.adminApproved && t.status === 'PROCESSING').length}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Pending: {transactions.filter(t => t.status === 'PENDING' || t.status === 'PROCESSING').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="TRANSFER">Transfer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Assets</option>
            <option value="USDT">USDT</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
            <option value="SOL">SOL</option>
          </select>

          <button
            onClick={() => {
              setTypeFilter('');
              setStatusFilter('');
              setAssetFilter('');
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Asset</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <span className="text-white">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{tx.user.username}</div>
                          <div className="text-sm text-gray-400">{tx.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                          {tx.asset}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-white font-medium">
                            {Number(tx.amount).toFixed(8)} {tx.asset}
                          </span>
                          {tx.network && (
                            <div className="text-xs text-gray-400 mt-1">{tx.network}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                            tx.status === 'COMPLETED'
                              ? 'bg-green-500/20 text-green-400'
                              : tx.status === 'PENDING'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : tx.status === 'PROCESSING'
                              ? 'bg-blue-500/20 text-blue-400'
                              : tx.status === 'FAILED'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {tx.status}
                          </span>
                          {tx.userConfirmed && !tx.adminApproved && tx.status === 'PROCESSING' && (
                            <span className="text-xs text-orange-400">⏳ Awaiting Approval</span>
                          )}
                          {tx.adminApproved && (
                            <span className="text-xs text-green-400">✅ Approved</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-white">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-gray-400">
                            {new Date(tx.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tx.userConfirmed && !tx.adminApproved && tx.status === 'PROCESSING' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(tx.id)}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded transition-all"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject(tx.id)}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded transition-all"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        ) : tx.adminApproved ? (
                          <span className="text-xs text-green-400">Approved</span>
                        ) : tx.status === 'FAILED' ? (
                          <span className="text-xs text-red-400">{tx.rejectionReason || 'Rejected'}</span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <div className="text-sm text-gray-400">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
