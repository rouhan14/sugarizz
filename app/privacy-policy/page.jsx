import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] px-4 py-8">
      <div className="max-w-4xl mx-auto bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-md p-8 transition-all duration-300">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-8 text-white/90">
          <div>
            <p className="text-sm text-white/70 mb-6">
              {/* <strong>Effective Date:</strong> August 23, 2025<br /> */}
              <strong>Last Updated:</strong> August 23, 2025
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Sugarizz ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place orders, or use our cookie delivery services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">2.1 Personal Information</h3>
            <p className="mb-4">When you place an order or contact us, we collect:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>GPS coordinates (for delivery zone verification)</li>
              <li>Payment information</li>
              {/* <li>Order history and preferences</li> */}
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              {/* <li>Device information</li> */}
              <li>Pages visited and time spent on our website</li>
              {/* <li>Cookies and similar tracking technologies</li> */}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Process and fulfill your cookie orders</li>
              <li>Verify delivery zones and calculate delivery charges</li>
              {/* <li>Send order confirmations and delivery updates</li> */}
              <li>Provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send promotional offers and updates (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li><strong>Service Providers:</strong> Email service providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of business assets</li>
              <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              Our website uses cookies and similar technologies to enhance your browsing experience, analyze website traffic, and serve personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p>To exercise these rights, contact us at sugarizz1000@gmail.com</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Data Retention</h2>
            <p className="mb-4">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Order information is typically retained for 3 years for business and tax purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
            <p className="mb-4">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
            <p className="mb-4">
              Your information may be transferred to and processed in countries other than Pakistan. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-lg">
              <p><strong>Sugarizz</strong></p>
              <p>Email: sugarizz1000@gmail.com</p>
              <p>Website: sugarizz.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
