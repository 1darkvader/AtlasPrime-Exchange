'use client';

import { useEffect, useState } from 'react';
import { FileCheck, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import Image from 'next/image';

interface KYCDocument {
  id: string;
  documentType: string;
  fileUrl: string;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    kycStatus: string;
  };
}

export default function KYCVerification() {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [selectedDoc, setSelectedDoc] = useState<KYCDocument | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/admin/kyc?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching KYC documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (documentId: string, action: string) => {
    if (action === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem('atlasprime_token');
      if (!token) {
        console.error('No auth token found');
        setActionLoading(false);
        return;
      }

      const res = await fetch('/api/admin/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          documentId,
          action,
          rejectionReason: action === 'REJECTED' ? rejectionReason : null
        })
      });

      if (res.ok) {
        fetchDocuments();
        setShowApprovalModal(false);
        setSelectedDoc(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error updating KYC document:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ID_FRONT: 'ID Front',
      ID_BACK: 'ID Back',
      PASSPORT: 'Passport',
      SELFIE: 'Selfie',
      PROOF_OF_ADDRESS: 'Proof of Address'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          KYC Verification
        </h1>
        <p className="text-gray-400 mt-2">Review and verify user KYC documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="text-yellow-500" size={24} />
            <div className="text-gray-400 text-sm">Pending</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {documents.filter(d => d.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <div className="text-gray-400 text-sm">Approved</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {documents.filter(d => d.status === 'APPROVED').length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-500" size={24} />
            <div className="text-gray-400 text-sm">Rejected</div>
          </div>
          <div className="text-3xl font-bold text-white">
            {documents.filter(d => d.status === 'REJECTED').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="flex gap-2">
          {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20">
            <FileCheck className="mx-auto mb-4 text-gray-500" size={48} />
            <p className="text-gray-400">No {statusFilter.toLowerCase()} KYC documents</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all"
              >
                {/* Document Preview */}
                <div className="relative h-48 bg-gray-800">
                  {doc.fileUrl ? (
                    <img
                      src={doc.fileUrl}
                      alt={doc.documentType}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileCheck className="text-gray-600" size={48} />
                    </div>
                  )}
                </div>

                {/* Document Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white">
                      {getDocumentTypeLabel(doc.documentType)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.status === 'APPROVED'
                        ? 'bg-green-500/20 text-green-400'
                        : doc.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {doc.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm text-white">{doc.user.username}</div>
                        <div className="text-xs text-gray-400">{doc.user.email}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  {doc.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setShowApprovalModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoc(doc);
                          setShowApprovalModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}

                  {doc.status === 'REJECTED' && doc.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                      Reason: {doc.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Review Document</h2>

            {/* Document Preview */}
            <div className="mb-6">
              {selectedDoc.fileUrl && (
                <img
                  src={selectedDoc.fileUrl}
                  alt={selectedDoc.documentType}
                  className="w-full rounded-lg"
                />
              )}
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">User Information</div>
              <div className="text-white">
                <div className="font-medium">{selectedDoc.user.username}</div>
                <div className="text-sm text-gray-400">{selectedDoc.user.email}</div>
                <div className="text-sm text-gray-400">
                  KYC Status: {selectedDoc.user.kycStatus}
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                Rejection Reason (if rejecting)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedDoc(null);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedDoc.id, 'REJECTED')}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </button>
              <button
                onClick={() => handleAction(selectedDoc.id, 'APPROVED')}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
