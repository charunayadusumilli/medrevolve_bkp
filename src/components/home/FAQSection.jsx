import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, User, Sparkles, Briefcase, Stethoscope, FlaskConical } from 'lucide-react';

const TABS = [
  { key: 'customer',  label: 'Patients',   icon: User,         color: 'text-[#4A6741]', bg: 'bg-[#4A6741]' },
  { key: 'creator',   label: 'Creators',   icon: Sparkles,     color: 'text-purple-600', bg: 'bg-purple-600' },
  { key: 'partner',   label: 'Partners',   icon: Briefcase,    color: 'text-amber-600', bg: 'bg-amber-600' },
  { key: 'provider',  label: 'Providers',  icon: Stethoscope,  color: 'text-teal-600', bg: 'bg-teal-600' },
  { key: 'pharmacy',  label: 'Pharmacies', icon: FlaskConical, color: 'text-indigo-600', bg: 'bg-indigo-600' },
];

const FAQS = {
  customer: [
    { q: 'How does MedRevolve work?', a: 'You complete a short health intake form online. A licensed provider reviews your information and conducts a telehealth consultation (video, phone, or chat). If approved, your prescription is sent to one of our partner pharmacies and delivered to your door in 24-48 hours.' },
    { q: 'What treatments do you offer?', a: 'We offer weight loss injections (Semaglutide, Tirzepatide), hormone therapy (testosterone, estrogen), longevity protocols (NAD+, Sermorelin, Glutathione, B12), hair loss treatments (Minoxidil, Finasteride), and cognitive support (Synapsin Spray) — all requiring a licensed provider consultation.' },
    { q: 'Do I need a consultation before ordering?', a: 'Yes. All our products require a prescription from a licensed provider. Our telehealth consultation process is quick (usually 15-30 min) and can be done from your phone or computer.' },
    { q: 'How much do treatments cost?', a: 'Pricing includes the clinical consultation, prescription, and discreet shipping. Plans start at $79/mo for B12 injections, $149/mo for Glutathione, and $299/mo for Semaglutide weight loss programs — all inclusive.' },
    { q: 'How fast is delivery?', a: 'Once your provider approves your prescription, medications are dispensed and delivered to your door within 24-48 hours through our partner pharmacy network.' },
    { q: 'Can I get treatment with a pre-existing condition?', a: 'Yes, but you must disclose all conditions on your intake form. Our licensed providers will review your medical history and determine the safest, most appropriate treatment plan for you.' },
    { q: 'Are the providers licensed?', a: 'Absolutely. All providers in our network are licensed MDs, DOs, NPs, or PAs, credentialed in their respective states. Your safety is our top priority.' },
    { q: 'How do refills work?', a: "Refills are managed through your patient portal. You'll receive reminders before your prescription runs out, and you can request a refill with a quick follow-up review — no need to go through the full intake again." },
  ],
  creator: [
    { q: 'How do creator commissions work?', a: 'You earn 10-25% monthly recurring commission on every subscription your referrals generate. As your total referral revenue grows, you automatically move up tiers: Bronze (10%), Silver (15%), Gold (20%), Platinum (25%).' },
    { q: 'What are the requirements to apply?', a: 'We look for creators with 10K+ followers on Instagram, TikTok, or YouTube, or an actively engaged blog/podcast audience in wellness, health, or lifestyle niches. We review applications within 24 hours.' },
    { q: 'What promotional tools do I get?', a: "You'll receive a unique tracking link, branded content templates, professional graphics, email swipe copy, and access to a private creator community for strategy sharing and support." },
    { q: 'When and how do I get paid?', a: 'Commissions are paid monthly via ACH direct deposit. You can track all clicks, conversions, and earnings in real-time through your creator portal.' },
    { q: 'Are there restrictions on how I promote?', a: "Yes — you cannot make specific medical claims, guarantee weight loss results, or imply our products are FDA-approved medications. We provide compliant content templates so you never have to guess what's acceptable." },
  ],
  partner: [
    { q: 'How does the partner business model work?', a: "You refer clients to MedRevolve using your branded link or in-store kiosk. Our licensed physicians handle all consultations and prescriptions. Our pharmacies fulfill and ship medications. You earn the markup above our minimum pricing on every qualified client — no inventory, no medical risk." },
    { q: 'What does "white-label" mean exactly?', a: 'White-labeling means your clients see your brand, not MedRevolve. You get a branded portal with your logo, a custom domain, and co-branded marketing materials. Clients experience your business offering a telehealth program.' },
    { q: 'How much does it cost to join?', a: 'The partner program costs $199/month (month-to-month) or $167/month billed annually. Annual plans include a free iPad and kiosk stand. No inventory to purchase, no upfront medication costs ever.' },
    { q: 'Is this legally compliant?', a: "Yes. Our model is designed by licensed pharmacists and healthcare attorneys. Partners never handle medical payments, never access patient data, and never prescribe. It's a pure referral structure — completely CPOM-safe and HIPAA-compliant." },
    { q: 'How quickly can I go live?', a: 'Same day. Self-register, set up your branded portal, and start sharing your links immediately. Payment onboarding is completed within 48 hours.' },
    { q: 'How much can I earn?', a: 'Earnings depend on pricing strategy and client volume. Partners with 50 active clients typically earn $6,000-$10,000/month. Partners with 100 active clients earn $12,000-$20,000/month. You set your own prices above our minimums and keep the entire markup.' },
  ],
  provider: [
    { q: 'How are providers compensated?', a: 'We offer three models: per-consultation (fixed fee per completed consult), monthly retainer (steady income regardless of volume), and revenue share (percentage of revenue generated). Your contract terms will reflect your specialty and availability.' },
    { q: 'What is the credentialing process?', a: 'Complete the provider intake form → background check and license verification → contract review → platform onboarding and training → go live. The entire process typically takes 3-7 business days.' },
    { q: 'Do I need to be licensed in multiple states?', a: "No — you practice only in states where you hold an active license. Our platform automatically routes patients to providers licensed in their state, so you're always protected." },
    { q: 'How does e-prescribing work?', a: "After a consultation, you use our built-in e-prescribing tool to approve and send prescriptions directly to our partner pharmacy network. The pharmacy handles fulfillment, shipping, and patient communication — you just focus on the clinical decision." },
    { q: 'What patient volume can I expect?', a: 'Volume depends on your specialty, states licensed, and availability. Providers typically see 5-30 consultations per week in their first month, growing as the platform scales. You control your schedule and availability at all times.' },
    { q: 'Does MedRevolve provide malpractice coverage?', a: 'Providers maintain their own malpractice insurance. MedRevolve provides additional umbrella coverage as outlined in your provider contract. We recommend discussing specifics during the credentialing process.' },
  ],
  pharmacy: [
    { q: 'What types of pharmacy partnerships do you offer?', a: 'We offer wholesale pricing contracts, per-prescription fee structures, and hybrid models. The right model depends on your pharmacy type, volume capacity, and geographic reach. We work with compounding, specialty, and mail-order pharmacies.' },
    { q: 'How does prescription routing work?', a: "Once a licensed provider approves a prescription in our platform, it's automatically routed to the appropriate partner pharmacy based on patient location, medication type, and pharmacy licensure. You receive a structured order with all required information." },
    { q: 'What documents are required to onboard?', a: 'State pharmacy board license, DEA registration (if applicable), NPI number, proof of NABP accreditation (for mail-order), and a signed business associate agreement (BAA) for HIPAA compliance. Our compliance team guides you through every step.' },
    { q: 'What are the fulfillment speed expectations?', a: 'Our standard SLA is 24-48 hours from prescription receipt to shipment. We prioritize pharmacies with national shipping capability and temperature-controlled logistics for compounded medications.' },
    { q: 'What compliance standards must we meet?', a: 'Pharmacy partners must maintain state board licensure, comply with USP 795/797 standards for compounding (where applicable), pass a LegitScript-aligned compliance review, and maintain HIPAA-compliant data practices.' },
  ],
};

function FAQItem({ q, a, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E0D5] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-5 text-left gap-4 group"
      >
        <span className="font-medium text-[#2D3A2D] group-hover:text-[#4A6741] transition-colors text-sm md:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 ${color} shrink-0 mt-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#5A6B5A] leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState('customer');
  const faqs = FAQS[activeTab] || [];
  const tab = TABS.find(t => t.key === activeTab);

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-3">
            Frequently Asked <span className="font-semibold text-[#4A6741]">Questions</span>
          </h2>
          <p className="text-lg text-[#5A6B5A]">
            Find answers tailored to who you are in our ecosystem
          </p>
        </motion.div>

        {/* Audience Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  isActive
                    ? `${t.bg} text-white border-transparent shadow-md`
                    : 'bg-white text-[#5A6B5A] border-[#E8E0D5] hover:border-[#4A6741]/30 hover:text-[#2D3A2D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-[#FDFBF7] rounded-2xl px-6 border border-[#E8E0D5]"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} color={tab?.color || 'text-[#4A6741]'} />
          ))}
        </motion.div>

        <p className="text-center text-sm text-[#5A6B5A] mt-8">
          Still have questions? Your dedicated{' '}
          <span className={`font-semibold ${tab?.color}`}>
            {tab?.label.slice(0, -1)} Specialist
          </span>{' '}
          is available in the chat widget below 👇
        </p>
      </div>
    </section>
  );
}