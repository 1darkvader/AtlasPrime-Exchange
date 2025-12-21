"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { Upload, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

type DocumentType = "ID_FRONT" | "ID_BACK" | "SELFIE" | "PROOF_OF_ADDRESS";

interface UploadedDoc {
  type: DocumentType;
  url: string;
  status: "pending" | "approved" | "rejected";
}

export default function KYCPage() {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFileUpload = async (file: File, type: DocumentType) => {
    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // Upload to Cloudinary via API
        const response = await fetch('/api/kyc/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64,
            documentType: type,
            userId: user?.id,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setUploadedDocs(prev => [...prev, {
            type,
            url: result.url,
            status: 'pending',
          }]);
        }
      };
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const documentTypes: { type: DocumentType; label: string; description: string }[] = [
    { type: "ID_FRONT", label: "ID Front", description: "Front of your government-issued ID" },
    { type: "ID_BACK", label: "ID Back", description: "Back of your government-issued ID" },
    { type: "SELFIE", label: "Selfie", description: "Photo of yourself holding your ID" },
    { type: "PROOF_OF_ADDRESS", label: "Proof of Address", description: "Utility bill or bank statement" },
  ];

  return (
    <ProtectedRoute>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold gradient-text mb-2">KYC Verification</h1>
            <p className="text-muted-foreground">Complete your identity verification to unlock all features</p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold">Verification Status</h2>
                  <button
                    onClick={handleRefreshStatus}
                    disabled={refreshing}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Refresh status"
                  >
                    <RefreshCw className={`w-4 h-4 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  {user?.kycStatus === "verified" || user?.kycStatus === "VERIFIED" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Verified</span>
                    </>
                  ) : user?.kycStatus === "pending" || user?.kycStatus === "PENDING" ? (
                    <>
                      <Clock className="w-5 h-5 text-orange-400" />
                      <span className="text-orange-400 font-semibold">Under Review</span>
                    </>
                  ) : user?.kycStatus === "rejected" || user?.kycStatus === "REJECTED" ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 font-semibold">Rejected</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Not Started</span>
                    </>
                  )}
                </div>
              </div>
              {(user?.kycStatus === "verified" || user?.kycStatus === "VERIFIED") && (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
              )}
            </div>
          </motion.div>

          {user?.kycStatus !== "verified" && (
            <>
              {/* Steps Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        step >= s ? "bg-blue-500 text-white" : "bg-card text-muted-foreground"
                      }`}>
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`w-32 h-1 mx-2 ${step > s ? "bg-blue-500" : "bg-card"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold">Personal Info</div>
                    <div className="text-muted-foreground text-xs">Basic details</div>
                  </div>
                  <div>
                    <div className="font-semibold">Upload Documents</div>
                    <div className="text-muted-foreground text-xs">ID & Proof</div>
                  </div>
                  <div>
                    <div className="font-semibold">Review</div>
                    <div className="text-muted-foreground text-xs">Final check</div>
                  </div>
                </div>
              </motion.div>

              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-6"
              >
                <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Please upload clear photos of the following documents. Files must be in JPG, PNG, or PDF format, and under 5MB.
                </p>

                <div className="space-y-4">
                  {documentTypes.map((doc) => {
                    const uploaded = uploadedDocs.find(d => d.type === doc.type);

                    return (
                      <div key={doc.type} className="p-4 bg-card rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{doc.label}</h3>
                            <p className="text-xs text-muted-foreground">{doc.description}</p>
                          </div>
                          {uploaded ? (
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                          ) : (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, doc.type);
                                }}
                                disabled={uploading}
                              />
                              <div className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center gap-2 transition-all">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">Upload</span>
                              </div>
                            </label>
                          )}
                        </div>
                        {uploaded && (
                          <div className="mt-2 text-xs text-emerald-400">
                            ✓ Uploaded successfully - Under review
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {uploadedDocs.length === 4 && (
                  <div className="mt-6">
                    <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Submit for Verification
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4"
              >
                <h3 className="font-semibold text-blue-400 mb-2">Important Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Verification usually takes 24-48 hours</li>
                  <li>Make sure all documents are clear and readable</li>
                  <li>Your information is encrypted and secure</li>
                  <li>You'll be notified via email once verified</li>
                </ul>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
