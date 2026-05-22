import React from 'react';
import { motion } from 'framer-motion';
import { Video, AlertTriangle } from 'lucide-react';

export default function TelehealthConsent() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-8 h-8 text-[#4A6741]" />
            <h1 className="text-4xl font-light text-[#2D3A2D]">Telehealth Informed Consent</h1>
          </div>
          <p className="text-[#5A6B5A] mb-2">Effective Date: January 1, 2025 | Last Updated: May 2026</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800"><strong>EMERGENCY NOTICE:</strong> Telehealth services are NOT appropriate for medical emergencies. If you are experiencing a life-threatening emergency, call 911 or go to your nearest emergency room immediately.</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">1. What Is Telehealth?</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Telehealth involves the delivery of healthcare services using electronic communications, including video conferencing, phone calls, and secure messaging. By using MedRevolve's platform to access healthcare services, you are consenting to receive care through telehealth modalities. Telehealth consultations on this platform are conducted by independently licensed physicians, nurse practitioners, and physician assistants.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">2. Provider Licensure</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                All healthcare providers on the MedRevolve platform are independently licensed to practice medicine and/or prescribe medications in the state(s) where you are located at the time of your consultation. Your provider's license number and issuing state are available upon request and can be verified through your state's medical licensing board. If a provider is not licensed in your state, you will be matched with a licensed provider who is.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">3. Benefits of Telehealth</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Convenient access to healthcare from your home or preferred location</li>
                <li>Reduced travel time and associated costs</li>
                <li>Access to specialists who may not be available locally</li>
                <li>Flexible scheduling, including same-day and next-day appointments</li>
                <li>Continuity of care with your preferred provider</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">4. Risks and Limitations of Telehealth</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">You understand and acknowledge the following limitations:</p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Telehealth is not a substitute for in-person medical evaluation in all circumstances</li>
                <li>Providers cannot perform physical examinations and must rely on information you provide and visual observation via video</li>
                <li>Technical failures (internet outages, equipment malfunction) may interrupt or delay care</li>
                <li>The provider may determine that an in-person visit is clinically necessary and refer you accordingly</li>
                <li>There is a risk of information breach despite our security measures</li>
                <li>Not all conditions can be appropriately treated via telehealth</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">5. Your Right to In-Person Care</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                You have the right to request an in-person consultation at any time. If your provider determines that your condition requires in-person evaluation, they will advise you accordingly and assist with an appropriate referral. Using telehealth services does not waive your right to seek in-person care from any licensed healthcare provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">6. Prescriptions and Medications</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Prescriptions are issued entirely at the clinical discretion of the treating provider. No prescription is guaranteed. Providers follow all applicable federal and state laws regarding prescribing, including DEA regulations for controlled substances. You understand that providers on this platform do not prescribe Schedule II-IV controlled substances via telehealth without an in-person examination where required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">7. Privacy and Confidentiality</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                All telehealth sessions and health information are protected under HIPAA. Sessions are conducted over encrypted, HIPAA-compliant video platforms. Sessions will only be recorded with your explicit written consent prior to the session. No unauthorized third parties will be present during your consultation without your permission. Please ensure you are in a private location during your consultation to protect your own privacy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">8. Refund and Cancellation Policy</h2>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li><strong>Full refund:</strong> Cancellations made more than 24 hours before your scheduled appointment receive a full refund.</li>
                <li><strong>50% refund:</strong> Cancellations made between 2–24 hours before the appointment receive a 50% refund.</li>
                <li><strong>No refund:</strong> No-shows or cancellations within 2 hours of the appointment are non-refundable.</li>
                <li><strong>Provider cancellation:</strong> If your provider cancels your appointment, you will receive a full refund and an opportunity to reschedule at no charge.</li>
                <li><strong>Technical issues:</strong> If a session cannot be completed due to platform technical failures on MedRevolve's end, you will receive a full refund or free reschedule.</li>
                <li>To request a refund, contact <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a> within 7 days of the appointment date.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">9. Acknowledgment</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                By booking a telehealth consultation through MedRevolve, you confirm that: (a) you have read and understand this Informed Consent; (b) you consent to receive healthcare services via telehealth; (c) you understand the benefits, risks, and limitations described above; (d) you understand that no provider-patient relationship is established until a licensed provider accepts your case; and (e) you have had an opportunity to ask questions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">10. Contact</h2>
              <p className="text-[#5A6B5A]">
                Questions about this consent: <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a> | (704) 426-3311
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}