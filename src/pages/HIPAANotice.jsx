import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function HIPAANotice() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#4A6741]" />
            <h1 className="text-4xl font-light text-[#2D3A2D]">Notice of Privacy Practices</h1>
          </div>
          <p className="text-[#5A6B5A] mb-2">Effective Date: January 1, 2025 | Last Updated: May 2026</p>
          <div className="bg-[#4A6741]/10 border border-[#4A6741]/20 rounded-xl p-4 mb-8">
            <p className="text-sm text-[#2D3A2D] font-medium">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">1. Who We Are</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                MedRevolve LLC ("MedRevolve," "we," "us," or "our") operates as a healthcare technology platform connecting patients with licensed healthcare providers. We are a Business Associate (BA) under HIPAA and work with Covered Entities (licensed providers) who use our platform. This Notice applies to all Protected Health Information (PHI) we create, receive, maintain, or transmit in connection with healthcare services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">2. Your Protected Health Information (PHI)</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">PHI includes any information that identifies you and relates to your health status, healthcare provision, or payment for healthcare. This includes:</p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Your name, address, date of birth, Social Security Number</li>
                <li>Medical history, diagnoses, treatment plans, prescriptions</li>
                <li>Lab results, consultation notes, provider communications</li>
                <li>Payment and billing information linked to healthcare services</li>
                <li>Video consultation recordings (with your explicit consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">3. How We May Use and Disclose Your PHI</h2>
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">Without Your Authorization:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2 mb-4">
                <li><strong>Treatment:</strong> To provide, coordinate, or manage your healthcare and related services. Providers on our platform may share your information with other treating providers.</li>
                <li><strong>Payment:</strong> To obtain payment for healthcare services, including billing insurance, processing credit card payments (via Stripe, our PCI-DSS compliant payment processor), and managing collections.</li>
                <li><strong>Healthcare Operations:</strong> Quality assessment, training, accreditation, licensing, and general platform administration.</li>
                <li><strong>As Required by Law:</strong> To comply with federal, state, or local laws including reporting requirements for certain communicable diseases or abuse situations.</li>
                <li><strong>Public Health Activities:</strong> Reporting disease outbreaks or other public health threats to authorized agencies.</li>
                <li><strong>Business Associates:</strong> We share PHI with third-party service providers who assist in our operations (e.g., Stripe for payments, Google for scheduling/email). All Business Associates have signed HIPAA Business Associate Agreements (BAAs) with us.</li>
              </ul>
              <h3 className="text-lg font-semibold text-[#2D3A2D] mb-2">With Your Written Authorization (required for):</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Marketing purposes (unless permitted by law)</li>
                <li>Sale of PHI</li>
                <li>Most disclosures of psychotherapy notes</li>
                <li>Any use or disclosure not described in this Notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">4. Business Associates with Signed BAAs</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">The following third-party vendors have executed HIPAA Business Associate Agreements with MedRevolve:</p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Stripe, Inc. — payment processing</li>
                <li>Google LLC — Google Workspace, Google Calendar, Google Meet (video consultations)</li>
                <li>Twilio Inc. — SMS appointment reminders and communications</li>
                <li>HubSpot, Inc. — CRM (de-identified data only; PHI not shared with HubSpot)</li>
                <li>Partner pharmacies — prescription fulfillment (covered entities)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">5. Your Rights Regarding Your PHI</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-3">
                <li><strong>Right to Access:</strong> You have the right to inspect and obtain a copy of your PHI. We will respond within 30 days. A reasonable fee may apply for copies.</li>
                <li><strong>Right to Amend:</strong> You may request correction of PHI you believe is inaccurate or incomplete. We may deny the request in certain circumstances.</li>
                <li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of disclosures of your PHI made in the past 6 years (excluding treatment, payment, and healthcare operations).</li>
                <li><strong>Right to Request Restrictions:</strong> You may ask us to limit how we use or disclose your PHI, though we are not required to agree to all restrictions.</li>
                <li><strong>Right to Confidential Communications:</strong> You may request that we communicate with you by alternative means or at an alternative location.</li>
                <li><strong>Right to a Paper Copy of This Notice:</strong> You may request a paper copy at any time, even if you agreed to receive it electronically.</li>
                <li><strong>Right to Opt Out of Fundraising:</strong> You may opt out of receiving fundraising communications at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">6. Data Retention</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Medical records and PHI are retained for a minimum of <strong>7 years</strong> from the date of service, or for minor patients, until the patient reaches age 21 (whichever is longer), in accordance with applicable state and federal requirements. Payment records are retained for 7 years. After the retention period, records are securely destroyed using NIST-compliant methods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">7. Data Breach Notification</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                In the event of a breach of unsecured PHI, we will notify you in writing within <strong>60 days</strong> of discovering the breach, as required by the HIPAA Breach Notification Rule (45 CFR Part 164, Subpart D). If the breach affects 500 or more individuals in a state, we will also notify the Secretary of HHS and prominent media outlets in that state. A log of all breaches affecting fewer than 500 individuals will be submitted to HHS annually.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">8. Security Measures</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                MedRevolve implements administrative, physical, and technical safeguards to protect your PHI, including: AES-256 encryption at rest and in transit (TLS 1.2+), role-based access controls, audit logging, multi-factor authentication for all staff accessing PHI, annual security risk assessments, and staff HIPAA training.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">9. Our Duties</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                We are required by law to maintain the privacy and security of your PHI, provide you with this Notice, follow the terms of this Notice, and notify you in the event of a breach. We may change this Notice and the new Notice will be effective for PHI already held. The current Notice will always be available at medrevolve.com/HIPAANotice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">10. Complaints</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">
                If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services (HHS) Office for Civil Rights. We will not retaliate against you for filing a complaint.
              </p>
              <p className="text-[#5A6B5A]">
                <strong>MedRevolve Privacy Officer:</strong><br />
                Email: <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a><br />
                Phone: (704) 426-3311<br />
                Address: Charlotte, North Carolina, United States
              </p>
              <p className="text-[#5A6B5A] mt-3">
                <strong>HHS Office for Civil Rights:</strong><br />
                <a href="https://www.hhs.gov/hipaa/filing-a-complaint" target="_blank" rel="noreferrer" className="text-[#4A6741] underline">www.hhs.gov/hipaa/filing-a-complaint</a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}