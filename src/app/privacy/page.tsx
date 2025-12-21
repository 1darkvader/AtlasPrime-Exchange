"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Cookie, UserCheck, Globe, FileText } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: FileText,
      title: "1. Information We Collect",
      content: (
        <>
          <h3 className="text-xl font-semibold mb-3 text-emerald-400">1.1 Personal Information</h3>
          <p className="text-muted-foreground mb-4">
            When you create an account or use our services, we collect the following personal information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>Full name, email address, and phone number</li>
            <li>Date of birth and nationality</li>
            <li>Government-issued identification documents (passport, driver's license)</li>
            <li>Proof of address documents</li>
            <li>Selfie verification photos</li>
            <li>Banking and payment information</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-emerald-400">1.2 Transaction Data</h3>
          <p className="text-muted-foreground mb-4">
            We automatically collect information about your trading activities:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li>Transaction history, trading pairs, and order details</li>
            <li>Deposit and withdrawal records</li>
            <li>Wallet addresses and blockchain transaction data</li>
            <li>Trading volume and portfolio balances</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 text-emerald-400">1.3 Technical Information</h3>
          <p className="text-muted-foreground mb-4">
            We collect technical data to improve our services and ensure security:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>IP addresses, device identifiers, and browser types</li>
            <li>Operating system and device information</li>
            <li>Login timestamps and access logs</li>
            <li>Cookies and similar tracking technologies</li>
            <li>API usage data and authentication tokens</li>
          </ul>
        </>
      ),
    },
    {
      icon: Database,
      title: "2. How We Use Your Information",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            AtlasPrime Exchange uses your personal data for the following purposes:
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2 text-emerald-400">Service Provision</h4>
              <p className="text-muted-foreground text-sm">
                To create and maintain your account, process transactions, execute trades, and provide customer support.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2 text-emerald-400">Compliance & Security</h4>
              <p className="text-muted-foreground text-sm">
                To comply with KYC/AML regulations, prevent fraud, detect suspicious activities, and protect against security threats.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2 text-emerald-400">Platform Improvement</h4>
              <p className="text-muted-foreground text-sm">
                To analyze usage patterns, optimize performance, develop new features, and enhance user experience.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg">
              <h4 className="font-semibold mb-2 text-emerald-400">Communication</h4>
              <p className="text-muted-foreground text-sm">
                To send important notifications, security alerts, platform updates, and promotional materials (with your consent).
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: Shield,
      title: "3. Data Protection & Security",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            We implement industry-leading security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li><strong>Access Controls:</strong> Strict role-based access with multi-factor authentication</li>
            <li><strong>Cold Storage:</strong> 95% of digital assets stored offline in secure cold wallets</li>
            <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection systems</li>
            <li><strong>Audits:</strong> Regular third-party security audits and penetration testing</li>
            <li><strong>Insurance:</strong> Digital asset insurance coverage for additional protection</li>
          </ul>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-emerald-400">Note:</strong> While we employ robust security measures, no system is 100% secure.
              We encourage users to enable 2FA and use strong, unique passwords.
            </p>
          </div>
        </>
      ),
    },
    {
      icon: Globe,
      title: "4. GDPR Compliance & User Rights",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have the following rights:
          </p>
          <div className="grid gap-3">
            <div className="flex gap-3 p-3 bg-card rounded-lg">
              <div className="text-emerald-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Right to Access</h4>
                <p className="text-sm text-muted-foreground">Request a copy of all personal data we hold about you</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-card rounded-lg">
              <div className="text-emerald-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Right to Rectification</h4>
                <p className="text-sm text-muted-foreground">Correct inaccurate or incomplete personal information</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-card rounded-lg">
              <div className="text-emerald-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Right to Erasure</h4>
                <p className="text-sm text-muted-foreground">Request deletion of your personal data (subject to legal obligations)</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-card rounded-lg">
              <div className="text-emerald-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Right to Data Portability</h4>
                <p className="text-sm text-muted-foreground">Receive your data in a structured, machine-readable format</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 bg-card rounded-lg">
              <div className="text-emerald-400 mt-1">✓</div>
              <div>
                <h4 className="font-semibold mb-1">Right to Object</h4>
                <p className="text-sm text-muted-foreground">Object to processing of your data for marketing purposes</p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">
            To exercise these rights, contact our Data Protection Officer at <span className="text-emerald-400">dpo@atlasprime.com</span>
          </p>
        </>
      ),
    },
    {
      icon: Cookie,
      title: "5. Cookies & Tracking Technologies",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar technologies to enhance your experience on our platform:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr>
                  <th className="text-left p-3 font-semibold">Cookie Type</th>
                  <th className="text-left p-3 font-semibold">Purpose</th>
                  <th className="text-left p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-border">
                  <td className="p-3">Essential</td>
                  <td className="p-3">Required for platform functionality and security</td>
                  <td className="p-3">Session/1 year</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Performance</td>
                  <td className="p-3">Analyze usage patterns and improve performance</td>
                  <td className="p-3">2 years</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Functional</td>
                  <td className="p-3">Remember preferences and personalization</td>
                  <td className="p-3">1 year</td>
                </tr>
                <tr className="border-t border-border">
                  <td className="p-3">Marketing</td>
                  <td className="p-3">Deliver relevant advertisements (with consent)</td>
                  <td className="p-3">6 months</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground mt-4">
            You can manage cookie preferences through your browser settings or our cookie consent banner.
          </p>
        </>
      ),
    },
    {
      icon: UserCheck,
      title: "6. Data Sharing & Third Parties",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            We may share your information with trusted third parties in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
            <li><strong>Service Providers:</strong> Cloud hosting, payment processors, KYC verification partners</li>
            <li><strong>Regulatory Authorities:</strong> When required by law or to comply with legal obligations</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            <li><strong>Security & Fraud Prevention:</strong> To protect against illegal activities</li>
          </ul>
          <p className="text-muted-foreground">
            We ensure all third parties adhere to strict data protection standards through contractual agreements.
          </p>
        </>
      ),
    },
    {
      icon: Lock,
      title: "7. Data Retention",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            We retain your personal data only as long as necessary for the purposes outlined in this policy:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>Account data: Retained while your account is active and for 7 years after closure (regulatory requirement)</li>
            <li>Transaction records: Retained for 7 years for tax and audit purposes</li>
            <li>KYC documents: Retained for 7 years from account closure</li>
            <li>Technical logs: Retained for 90 days unless required for security investigations</li>
          </ul>
        </>
      ),
    },
    {
      icon: Eye,
      title: "8. Your Privacy Choices",
      content: (
        <>
          <p className="text-muted-foreground mb-4">
            You have control over your privacy settings:
          </p>
          <div className="space-y-3">
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Marketing Communications</h4>
              <p className="text-sm text-muted-foreground">
                Opt out of promotional emails by clicking "Unsubscribe" in any marketing email or adjusting your account preferences.
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Data Access & Export</h4>
              <p className="text-sm text-muted-foreground">
                Request a copy of your data through your account settings under "Privacy & Data Protection."
              </p>
            </div>
            <div className="p-4 glass rounded-lg">
              <h4 className="font-semibold mb-2">Account Deletion</h4>
              <p className="text-sm text-muted-foreground">
                Request account deletion through our support team. Note: Some data may be retained for legal compliance.
              </p>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6"
              >
                <Shield className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <h1 className="text-5xl font-bold gradient-text mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground text-lg mb-2">
                Your privacy and data security are our top priorities
              </p>
              <p className="text-sm text-muted-foreground mb-1">
                Last updated: November 29, 2024
              </p>
              <p className="text-sm text-muted-foreground">
                Effective Date: November 29, 2024
              </p>
            </div>

            <div className="glass rounded-2xl p-8 mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                At AtlasPrime Exchange, we are committed to protecting your privacy and ensuring the security
                of your personal information. This Privacy Policy explains how we collect, use, disclose, and
                safeguard your data when you use our cryptocurrency trading platform and services. By using
                AtlasPrime Exchange, you consent to the practices described in this policy.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-emerald-500/10 rounded-lg">
                      <section.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold flex-1 pt-2">{section.title}</h2>
                  </div>
                  <div>{section.content}</div>
                </motion.div>
              ))}
            </div>

            {/* International Transfers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="glass rounded-xl p-8 mt-6"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Globe className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold flex-1 pt-2">9. International Data Transfers</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                AtlasPrime Exchange operates globally, and your data may be transferred to and processed in countries
                outside your jurisdiction. We ensure adequate safeguards are in place through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Privacy Shield Framework (where applicable)</li>
                <li>Data processing agreements with third-party providers</li>
              </ul>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="glass rounded-xl p-8 mt-6"
            >
              <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground">
                AtlasPrime Exchange is not intended for individuals under the age of 18. We do not knowingly collect
                personal information from children. If we become aware that a child has provided us with personal data,
                we will take steps to delete such information immediately.
              </p>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="glass rounded-xl p-8 mt-6"
            >
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this Privacy Policy periodically to reflect changes in our practices, technology,
                legal requirements, or other factors. We will notify you of material changes through:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Email notification to your registered email address</li>
                <li>Prominent notice on our platform</li>
                <li>In-app notifications</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Continued use of our services after such modifications constitutes acceptance of the updated Privacy Policy.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="glass rounded-xl p-8 mt-6"
            >
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-6">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
                please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-semibold mb-2 text-emerald-400">General Privacy Inquiries</h4>
                  <p className="text-sm text-muted-foreground">Email: privacy@atlasprime.com</p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-semibold mb-2 text-emerald-400">Data Protection Officer</h4>
                  <p className="text-sm text-muted-foreground">Email: dpo@atlasprime.com</p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-semibold mb-2 text-emerald-400">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    AtlasPrime Exchange<br />
                    123 Crypto Boulevard, Suite 500<br />
                    New York, NY 10013, USA
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg">
                  <h4 className="font-semibold mb-2 text-emerald-400">Support Portal</h4>
                  <p className="text-sm text-muted-foreground">Visit our Help Center for immediate assistance</p>
                </div>
              </div>
            </motion.div>

            {/* Footer Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-12 pt-8 border-t border-border text-center"
            >
              <p className="text-sm text-muted-foreground">
                By using AtlasPrime Exchange, you acknowledge that you have read, understood, and agree to
                the terms outlined in this Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
