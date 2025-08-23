import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f2937] via-[#111827] to-[#0f172a] px-4 py-8">
      <div className="max-w-4xl mx-auto bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-md p-8 transition-all duration-300">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Terms of Service</h1>
        
        <div className="space-y-8 text-white/90">
          <div>
            <p className="text-sm text-white/70 mb-6">
              {/* <strong>Effective Date:</strong> August 23, 2025<br /> */}
              <strong>Last Updated:</strong> August 23, 2025
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              Welcome to Sugarizz! By accessing our website, placing orders, or using our cookie delivery services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Sugarizz is an online cookie delivery service operating in Pakistan. We offer various cookie flavors including:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>HazelNut Chocolate Cookie</li>
              <li>Pistachio Kunafa Cookie</li>
              <li>Classic Chocolate Cookie</li>
              <li>Cookie & Cream Cookie</li>
              <li>Double Chocolate Cookie</li>
              <li>Peanut Butter Cookie</li>
              <li>Red Velvet Cookie</li>
              <li>Walnut Cookie</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Ordering and Payment</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">3.1 Minimum Order</h3>
            <p className="mb-4">The minimum order value is Rs. 1,000.</p>

            <h3 className="text-xl font-medium text-white mb-3">3.2 Pricing</h3>
            <p className="mb-4">
              All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice. Prices include applicable taxes but exclude delivery charges.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">3.3 Payment Methods</h3>
            <p className="mb-4">
              We accept various payment methods including cash on delivery and online payment options. Payment must be completed before order processing begins.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">3.4 Order Confirmation</h3>
            <p className="mb-4">
              Orders are confirmed only after successful payment verification and delivery zone confirmation. We reserve the right to cancel orders that cannot be delivered to your location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Delivery Terms</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">4.1 Delivery Zones</h3>
            <p className="mb-4">
              We deliver only within our designated delivery zones. Delivery charges vary based on location and distance from our store. Your address will be verified for delivery zone eligibility.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">4.2 Delivery Time</h3>
            <p className="mb-4">
              We strive to deliver orders within the estimated time frame provided at checkout. Delivery times are estimates and may vary due to weather, traffic, or other unforeseen circumstances.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">4.3 Address Accuracy</h3>
            <p className="mb-4">
              You are responsible for providing accurate delivery information. Additional charges may apply for incorrect addresses or failed delivery attempts due to inaccurate information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Product Quality and Freshness</h2>
            <p className="mb-4">
              We are committed to delivering fresh, high-quality cookies. All products are baked using premium ingredients and prepared following strict hygiene standards.
            </p>
            
            <h3 className="text-xl font-medium text-white mb-3">5.1 Shelf Life</h3>
            <p className="mb-4">
              Our cookies are best consumed within 3-5 days of delivery when stored properly. We recommend storing cookies in a cool, dry place.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">5.2 Ingredients and Allergens</h3>
            <p className="mb-4">
              Our cookies may contain nuts, dairy, gluten, and other allergens. Please inform us of any allergies or dietary restrictions when placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Vouchers and Discounts</h2>
            <p className="mb-4">
              Vouchers and promotional codes are subject to terms and conditions specified at the time of offer. Vouchers cannot be combined with other offers unless explicitly stated. Expired or invalid vouchers will not be honored.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Cancellation and Refund Policy</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">7.1 Order Cancellation</h3>
            <p className="mb-4">
              Orders can be cancelled within 30 minutes of placement. Once preparation begins, orders cannot be cancelled.
            </p>

            <h3 className="text-xl font-medium text-white mb-3">7.2 Refunds</h3>
            <p className="mb-4">
              Refunds are provided only in cases of:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Product quality issues</li>
              <li>Failed delivery due to our fault</li>
              <li>Order cancellation within allowed timeframe</li>
            </ul>
            <p className="mb-4">
              Refunds will be processed within 5-7 business days to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. User Conduct</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4">
              <li>Provide false or misleading information</li>
              <li>Use our service for any illegal purposes</li>
              <li>Interfere with our website's operation</li>
              <li>Place fraudulent orders</li>
              <li>Abuse our customer service team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Intellectual Property</h2>
            <p className="mb-4">
              All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of Sugarizz and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Privacy</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Sugarizz shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Force Majeure</h2>
            <p className="mb-4">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, or pandemic-related restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Pakistan. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Pakistan.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-[rgba(255,255,255,0.1)] p-4 rounded-lg">
              <p><strong>Sugarizz</strong></p>
              <p>Email: sugarizz1000@gmail.com</p>
              <p>Website: sugarizz.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">16. Severability</h2>
            <p className="mb-4">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
