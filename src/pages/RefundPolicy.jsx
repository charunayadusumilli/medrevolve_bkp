import React from 'react';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: 'What this policy covers',
    body: 'This policy applies to orders placed on the MedRevolve consumer storefront, including provider consultations, prescription and compounded medications dispensed by a licensed pharmacy, lab panels, and non-prescription supplies. Prices shown are cash-pay and exclude taxes.',
  },
  {
    title: 'Consultation fees',
    body: 'A consultation fee pays for a licensed provider to review your intake and determine whether treatment is appropriate. If a provider determines that no treatment is appropriate, you are not charged for medication. Consultation fees are refundable only where a provider was unable to complete a review, or where you cancel before the review begins.',
  },
  {
    title: 'Prescription and compounded medications',
    body: 'Once a pharmacy has dispensed and shipped a prescription or compounded medication, the order cannot be returned or refunded, because state and federal law prohibit the return of dispensed prescription drugs. This does not affect your rights where an item arrives damaged, is shipped in error, or does not match the prescription written by your provider; in those cases we arrange a replacement or refund.',
  },
  {
    title: 'Lab panels, devices and supplies',
    body: 'Unopened lab collection kits, devices and supplies may be returned within 30 days of delivery for a refund of the item price, less shipping. Kits that have been opened, used, or registered with the laboratory cannot be refunded. Digital products and completed lab draws are non-refundable.',
  },
  {
    title: 'Subscriptions and refills',
    body: 'Subscription pricing applies to recurring shipments only where a product offers a refill cadence. You can cancel a subscription at any time from your account or by contacting us before the next order is processed. Cancelling stops future shipments and charges; medication already dispensed and shipped is handled under the prescription section above.',
  },
  {
    title: 'Processing times',
    body: 'Approved refunds are issued to the original payment method within 5 to 10 business days. Your bank may take additional time to post the credit. Shipping charges are refunded only where the return results from our error.',
  },
  {
    title: 'How to request a refund',
    body: 'Contact support with your order number, the item concerned, and a short description of the issue. We may ask for photos where an item arrived damaged. Requests are reviewed in the order received.',
  },
  {
    title: 'Chargebacks',
    body: 'Please contact us before opening a dispute with your card issuer. A chargeback filed while an order is in review may pause fulfillment until the dispute is resolved.',
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl font-light text-[#2D3A2D]">Refund Policy</h1>
          </div>
          <p className="text-[#5A6B5A] mb-8">Last Updated: October 2026</p>

          <div className="prose prose-slate max-w-none space-y-8">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">{section.title}</h2>
                <p className="text-[#5A6B5A] leading-relaxed">{section.body}</p>
              </section>
            ))}

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Questions</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                For refund questions, email{' '}
                <a href="mailto:support@medrevolve.com" className="text-[#4A6741] underline">support@medrevolve.com</a>{' '}
                or use our{' '}
                <Link to="/Contact" className="text-[#4A6741] underline">contact page</Link>. This policy does not
                limit any right you have under applicable state consumer protection law.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}