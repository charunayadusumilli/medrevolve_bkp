import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-light text-[#2D3A2D] mb-4">Terms of Service</h1>
          <p className="text-[#5A6B5A] mb-8">Last updated: February 2026</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Agreement to Terms</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                By accessing or using MedRevolve's telehealth and wellness platform, you agree to be bound by these Terms of Service and all applicable laws and regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Telehealth Services</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                MedRevolve provides access to licensed healthcare providers through secure video consultations. Our services are not for emergencies. If you have a medical emergency, call 911 immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">User Responsibilities</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Provide accurate and complete health information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform only for lawful purposes</li>
                <li>Respect the privacy and intellectual property rights of others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Prescriptions and Treatment</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                Healthcare providers on our platform may prescribe medications at their professional discretion. You are responsible for following all prescription instructions and informing your provider of any adverse reactions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Limitation of Liability</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-4">
                MedRevolve facilitates connections between patients and licensed healthcare providers but is not responsible for the medical advice, diagnosis, or treatment provided by individual practitioners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-4">Contact Information</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                For questions about these Terms of Service, contact us at legal@medrevolve.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}