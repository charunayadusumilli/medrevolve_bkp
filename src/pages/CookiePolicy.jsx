import React from 'react';
import { motion } from 'framer-motion';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-light text-[#2D3A2D] mb-4">Cookie Policy</h1>
          <p className="text-[#5A6B5A] mb-8">Last Updated: May 2026</p>

          <div className="prose prose-slate max-w-none space-y-8">

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">What Are Cookies?</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work efficiently, provide analytics data, and deliver personalized advertising. We use Cookiebot to manage your cookie preferences in compliance with GDPR (EU) and CCPA (California).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Categories of Cookies We Use</h2>

              <div className="space-y-4">
                <div className="bg-white border border-[#E8E0D5] rounded-xl p-5">
                  <h3 className="font-semibold text-[#2D3A2D] mb-1">Strictly Necessary Cookies</h3>
                  <p className="text-sm text-[#5A6B5A]">Essential for the website to function. Cannot be disabled. These include session authentication, security tokens, and load-balancing cookies. No personal data is used for marketing purposes.</p>
                </div>
                <div className="bg-white border border-[#E8E0D5] rounded-xl p-5">
                  <h3 className="font-semibold text-[#2D3A2D] mb-1">Analytics & Performance Cookies</h3>
                  <p className="text-sm text-[#5A6B5A]">Help us understand how visitors interact with our site. We use Google Analytics (GA4) to measure traffic, page views, and user journeys. Data is anonymized where possible. You may opt out via Cookiebot or Google Analytics Opt-Out.</p>
                  <p className="text-xs text-[#9A8B7A] mt-2">Provider: Google LLC | Duration: Up to 2 years | ID: _ga, _gid, _gat_UA-*</p>
                </div>
                <div className="bg-white border border-[#E8E0D5] rounded-xl p-5">
                  <h3 className="font-semibold text-[#2D3A2D] mb-1">Marketing & Targeting Cookies</h3>
                  <p className="text-sm text-[#5A6B5A]">Used to display relevant ads based on your interests. We use Facebook Pixel (Meta) for advertising measurement on Meta platforms. These cookies track browsing behavior across websites.</p>
                  <p className="text-xs text-[#9A8B7A] mt-2">Provider: Meta Platforms, Inc. | Duration: Up to 90 days | ID: _fbp, _fbc</p>
                </div>
                <div className="bg-white border border-[#E8E0D5] rounded-xl p-5">
                  <h3 className="font-semibold text-[#2D3A2D] mb-1">Functional Cookies</h3>
                  <p className="text-sm text-[#5A6B5A]">Remember your preferences such as language, region, and form data. Enable features like live chat and appointment booking auto-fill.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Managing Your Cookie Preferences</h2>
              <p className="text-[#5A6B5A] leading-relaxed mb-3">
                You can control cookie preferences at any time through our Cookiebot consent banner, which appears on your first visit. You can also:
              </p>
              <ul className="list-disc pl-6 text-[#5A6B5A] space-y-2">
                <li>Adjust browser settings to block or delete cookies (note: this may affect website functionality)</li>
                <li>Opt out of Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="text-[#4A6741] underline">tools.google.com/dlpage/gaoptout</a></li>
                <li>Opt out of Meta advertising: <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noreferrer" className="text-[#4A6741] underline">facebook.com/settings?tab=ads</a></li>
                <li>Use the Digital Advertising Alliance opt-out: <a href="https://optout.aboutads.info" target="_blank" rel="noreferrer" className="text-[#4A6741] underline">optout.aboutads.info</a></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">CCPA — California Residents</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                California residents have the right to opt out of the "sale" of personal information under CCPA. We do not sell personal information. Cookie data used for targeted advertising may constitute a "share" of personal information under California law. To exercise your opt-out rights, use the Cookiebot consent banner or email <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">GDPR — EU/EEA Residents</h2>
              <p className="text-[#5A6B5A] leading-relaxed">
                For users in the EU/EEA, we rely on your explicit consent as the legal basis for non-essential cookies (Art. 6(1)(a) GDPR). You may withdraw consent at any time without affecting the lawfulness of processing prior to withdrawal. Our Cookiebot integration ensures consent is recorded with timestamps.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-[#2D3A2D] mb-3">Contact</h2>
              <p className="text-[#5A6B5A]">
                For cookie-related questions: <a href="mailto:privacy@medrevolve.com" className="text-[#4A6741] underline">privacy@medrevolve.com</a>
              </p>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}