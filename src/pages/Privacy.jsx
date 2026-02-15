import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-light text-[#2D3A2D] mb-4">Privacy Policy</h1>
          <p className="text-[#5A6B5A] mb-8">Last updated: February 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Introduction</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                At MedRevolve, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our telehealth and wellness platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">HIPAA Compliance</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                We are committed to complying with the Health Insurance Portability and Accountability Act (HIPAA) and protecting your protected health information (PHI). All medical consultations, prescriptions, and health records are encrypted and stored securely.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Information We Collect</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Personal information (name, email, phone number, date of birth)</li>
                <li>Health information and medical history</li>
                <li>Payment and billing information</li>
                <li>Communications with healthcare providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">How We Use Your Information</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Provide healthcare services and consultations</li>
                <li>Process prescriptions and coordinate with pharmacies</li>
                <li>Communicate about appointments and follow-ups</li>
                <li>Improve our services and user experience</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Contact Us</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@medrevolve.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}