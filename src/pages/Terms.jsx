import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-light text-[#2D3A2D] mb-4">Terms of Service</h1>
          <p className="text-[#5A6B5A] mb-8">Last Updated: May 2026 | Effective Date: January 1, 2025</p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800 text-sm font-medium">EMERGENCY: If you are experiencing a medical emergency, call 911 or go to your nearest emergency room. Do not use this platform for emergencies.</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">1. Agreement to Terms</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                By accessing or using MedRevolve.com ("Platform"), you agree to be bound by these Terms of Service ("Terms"), our <Link to="/Privacy" className="text-[#4A6741] underline">Privacy Policy</Link>, our <Link to="/HIPAANotice" className="text-[#4A6741] underline">HIPAA Notice of Privacy Practices</Link>, our <Link to="/TelehealthConsent" className="text-[#4A6741] underline">Telehealth Informed Consent</Link>, and all applicable laws. If you do not agree, do not use the Platform. MedRevolve LLC reserves the right to update these Terms at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">2. Description of Services</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">MedRevolve provides:</p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li><strong>Consumer Telehealth Marketplace:</strong> Connecting patients with independently licensed physicians, nurse practitioners, and physician assistants for telehealth consultations.</li>
                <li><strong>B2B White-Label Platform:</strong> Infrastructure, compliance tools, and marketplace access for licensed merchants to operate telehealth businesses.</li>
                <li><strong>Pharmaceutical Supply:</strong> USP-grade ancillary supplies (bacteriostatic water) for licensed facilities and consumers.</li>
              </ul>
              <p className="text-[#5A6B5A] mt-3">MedRevolve is a technology platform. We do not practice medicine. Providers on our platform practice independently and establish their own provider-patient relationships.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">3. Telehealth Services and Informed Consent</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                By booking a telehealth consultation, you acknowledge that you have read and agree to our <Link to="/TelehealthConsent" className="text-[#4A6741] underline">Telehealth Informed Consent</Link>, which covers: the nature and limitations of telehealth, provider licensure, emergency procedures, recording consent, and your rights to in-person care. All providers are licensed in the state where you receive care at the time of consultation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">4. Prescriptions, Medications, and Controlled Substances</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Prescriptions are issued solely at the clinical discretion of the treating licensed provider. No prescription is guaranteed.</li>
                <li>Providers comply with all applicable federal (DEA) and state prescribing laws.</li>
                <li>MedRevolve does not facilitate the prescribing of Schedule I controlled substances. Schedule II-IV controlled substances are only prescribed in compliance with the Ryan Haight Online Pharmacy Consumer Protection Act and applicable DEA exceptions.</li>
                <li>Compounded medications are dispensed by PCAB-accredited, 503A/503B-licensed pharmacies with valid prescriber orders.</li>
                <li>You are responsible for accurately disclosing all current medications, allergies, and health conditions to your provider.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">5. Eligibility</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li>You must be at least 18 years of age to use our services.</li>
                <li>You must be located in the United States at the time of your telehealth consultation.</li>
                <li>Merchant accounts require a valid U.S. business entity (LLC, Corporation, or equivalent).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">6. User Responsibilities</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Provide accurate, complete, and current information at all times.</li>
                <li>Maintain the security of your account credentials and notify us immediately of unauthorized access.</li>
                <li>Use the Platform only for lawful purposes consistent with these Terms.</li>
                <li>Not attempt to circumvent, hack, or reverse-engineer any aspect of the Platform.</li>
                <li>Not use the Platform to distribute spam, malware, or harmful content.</li>
                <li>Comply with all applicable federal, state, and local laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">7. Payment, Refunds, and Cancellations</h2>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-2">Consultations:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1 mb-3">
                <li>Full refund: cancellation more than 24 hours before appointment</li>
                <li>50% refund: cancellation 2–24 hours before appointment</li>
                <li>No refund: no-show or cancellation within 2 hours</li>
                <li>Full refund: provider cancels, or platform technical failure on our end</li>
              </ul>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-2">Products:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1 mb-3">
                <li>Unopened products may be returned within 30 days for a full refund (minus shipping).</li>
                <li>Pharmaceutical products (bacteriostatic water) that have been opened cannot be returned for safety reasons.</li>
              </ul>
              <h3 className="text-base font-semibold text-[#2D3A2D] mb-2">Merchant Subscriptions:</h3>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-1">
                <li>Monthly subscriptions may be cancelled at any time; access continues until end of billing period.</li>
                <li>No partial month refunds for merchant platform fees.</li>
              </ul>
              <p className="text-[#5A6B5A] mt-3 text-sm">Refund requests: <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a> within 7 days of the transaction date. All payments processed via Stripe.</p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">8. Intellectual Property</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                All content on MedRevolve.com — including text, graphics, logos, software, and platform architecture — is the exclusive property of MedRevolve LLC and is protected by U.S. and international copyright, trademark, and trade secret laws. You may not reproduce, distribute, or create derivative works without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">9. Disclaimer of Warranties</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. MEDREVOLVE DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">10. Limitation of Liability</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                MedRevolve facilitates connections between patients and independently licensed healthcare providers. MedRevolve is not responsible for the medical advice, diagnosis, or treatment provided by individual practitioners. To the maximum extent permitted by applicable law, MedRevolve's total liability for any claim arising from these Terms or your use of the Platform shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">11. Indemnification</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                You agree to indemnify, defend, and hold harmless MedRevolve LLC, its officers, directors, employees, agents, and affiliates from any claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">12. Dispute Resolution and Arbitration</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Any dispute arising from these Terms or your use of the Platform shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, except that either party may bring claims in small claims court for disputes within that court's jurisdiction. <strong>You waive your right to a jury trial and to participate in class action lawsuits.</strong> Arbitration shall take place in Mecklenburg County, North Carolina, or via video conference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">13. Governing Law</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                These Terms are governed by the laws of the State of North Carolina, without regard to its conflict-of-law principles. Federal and state telehealth laws applicable to the patient's state of residence also apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">14. Contact Information</h2>
              <p className="text-[#5A6B5A]">
                Legal/Compliance: <a href="mailto:compliance@medrevolve.com" className="text-[#4A6741] underline">compliance@medrevolve.com</a><br />
                General Support: <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a><br />
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