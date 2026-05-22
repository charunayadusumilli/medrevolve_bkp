import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-light text-[#2D3A2D] mb-4">Privacy Policy</h1>
          <p className="text-[#5A6B5A] mb-2">Last Updated: May 2026</p>
          <p className="text-sm text-[#5A6B5A] mb-8">
            This Privacy Policy governs MedRevolve's collection and use of data on medrevolve.com. For our HIPAA-specific healthcare data practices, see our{' '}
            <Link to="/HIPAANotice" className="text-[#4A6741] underline">Notice of Privacy Practices (HIPAA NPP)</Link>.
          </p>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">1. Who We Are</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                MedRevolve LLC ("MedRevolve," "we," "us") operates medrevolve.com — a B2B telehealth platform and consumer telehealth marketplace. Registered address: Charlotte, North Carolina, United States. Contact: <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a> | (704) 426-3311.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">Information You Provide:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1 mb-4">
                <li>Account registration: name, email, password</li>
                <li>Health intake forms: medical history, symptoms, health goals</li>
                <li>Appointment booking: contact details, reason for visit</li>
                <li>Contact forms: name, email, phone, message</li>
                <li>Business/merchant onboarding: business name, EIN, domain, payment details</li>
              </ul>
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">Automatically Collected:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li>IP address, browser type, operating system, device identifiers</li>
                <li>Pages visited, time on site, referring URL, click paths</li>
                <li>Cookies and tracking pixels (see our <Link to="/CookiePolicy" className="text-[#4A6741] underline">Cookie Policy</Link>)</li>
                <li>Google Analytics (GA4) and Meta Pixel data (with consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Providing, operating, and improving our telehealth platform and services</li>
                <li>Matching patients with licensed healthcare providers</li>
                <li>Processing payments securely via Stripe (PCI-DSS Level 1 certified)</li>
                <li>Sending appointment confirmations, reminders, and healthcare communications</li>
                <li>SMS communications (appointment reminders) with your explicit prior written consent per TCPA</li>
                <li>Syncing lead and business data to HubSpot CRM for sales and support workflows (de-identified; no PHI)</li>
                <li>Analytics and platform optimization using anonymized/aggregated data</li>
                <li>Compliance with HIPAA, DEA, state telehealth laws, and other regulatory requirements</li>
                <li>Marketing and advertising with your consent (you may opt out at any time)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">4. Third-Party Service Providers</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">We share data with trusted service providers to operate our platform. All providers who handle PHI have signed HIPAA Business Associate Agreements (BAAs). Current third-party processors include:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-[#5A6B5A] border border-[#E8E0D5] rounded-lg">
                  <thead>
                    <tr className="bg-[#F5F0E8]">
                      <th className="text-left px-4 py-2 text-[#2D3A2D] font-semibold">Provider</th>
                      <th className="text-left px-4 py-2 text-[#2D3A2D] font-semibold">Purpose</th>
                      <th className="text-left px-4 py-2 text-[#2D3A2D] font-semibold">BAA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Stripe, Inc.', 'Payment processing (PCI-DSS L1)', 'Yes'],
                      ['Google LLC', 'Calendar, Meet, Workspace, Analytics', 'Yes (Workspace/Meet)'],
                      ['Twilio Inc.', 'SMS notifications', 'Yes'],
                      ['HubSpot, Inc.', 'CRM — sales & business data only (no PHI)', 'N/A'],
                      ['Meta Platforms', 'Advertising analytics (with consent)', 'N/A'],
                      ['Cookiebot (Usercentrics)', 'Cookie consent management', 'N/A'],
                      ['Qualiphy', 'eConsent & identity verification', 'Yes'],
                      ['Partner Pharmacies', 'Prescription fulfillment', 'Yes (Covered Entity)'],
                    ].map(([p, pu, b]) => (
                      <tr key={p} className="border-t border-[#E8E0D5]">
                        <td className="px-4 py-2 font-medium">{p}</td>
                        <td className="px-4 py-2">{pu}</td>
                        <td className="px-4 py-2">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">5. SMS / Text Message Consent (TCPA)</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                We send SMS messages <strong>only with your prior express written consent</strong>, obtained at the time of account creation or appointment booking. Message types: appointment reminders, confirmation codes, care updates. Frequency varies. Message & data rates may apply. To opt out, reply <strong>STOP</strong> to any SMS. For help, reply <strong>HELP</strong> or contact <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a>. We do not share your phone number with third parties for their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">6. Data Retention</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li>Medical records / PHI: 7 years from date of service (or age 21 for minors, whichever is longer)</li>
                <li>Payment records: 7 years</li>
                <li>Marketing / analytics data: 26 months (per Google Analytics default)</li>
                <li>Account data (non-medical): 3 years after last activity</li>
                <li>After retention period: secure deletion using NIST 800-88 methods</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">7. Your Rights</h2>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-1">All Users:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1 mb-3">
                <li>Access, correct, or delete your account information at any time via Account Settings</li>
                <li>Opt out of marketing emails via unsubscribe link in any email</li>
                <li>Opt out of SMS via reply STOP</li>
              </ul>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-1">California Residents (CCPA/CPRA):</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1 mb-3">
                <li>Right to know what personal information is collected and how it's used</li>
                <li>Right to delete personal information (with certain exceptions)</li>
                <li>Right to opt out of sale/sharing of personal information (we do not sell PI)</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-1">HIPAA Rights:</h3>
              <p className="text-[#5A6B5A]">See our <Link to="/HIPAANotice" className="text-[#4A6741] underline">Notice of Privacy Practices</Link> for full HIPAA rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">8. Children's Privacy</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected data from a minor, contact us immediately at <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">9. Security</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                We implement industry-standard security including AES-256 encryption at rest, TLS 1.2+ in transit, role-based access controls, MFA, and regular security assessments. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">10. Changes to This Policy</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                We may update this policy periodically. Material changes will be communicated via email to registered users and/or a prominent notice on the website. The "Last Updated" date at the top reflects the most recent revision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">11. Contact Us</h2>
              <p className="text-[#5A6B5A]">
                Privacy Officer: <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a><br />
                Phone: (704) 426-3311<br />
                Address: Charlotte, North Carolina, United States
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}