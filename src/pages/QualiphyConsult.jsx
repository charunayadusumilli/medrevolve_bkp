import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Shield, Clock, Star } from 'lucide-react';

export default function QualiphyConsult() {
  useEffect(() => {
    // Inject Qualiphy stylesheet
    if (!document.getElementById('qualiphy-style')) {
      const link = document.createElement('link');
      link.id = 'qualiphy-style';
      link.rel = 'stylesheet';
      link.href = 'https://firebasestorage.googleapis.com/v0/b/qualiphy-web-d918b.appspot.com/o/style-v4.css?alt=media&token=34735782-16e8-4a2f-9eaa-426d65af48b2';
      document.head.appendChild(link);
    }

    // Inject moment.js if not already present
    const loadScript = (id, src, onload) => {
      if (!document.getElementById(id)) {
        const s = document.createElement('script');
        s.id = id;
        s.src = src;
        s.onload = onload;
        document.body.appendChild(s);
      } else {
        onload && onload();
      }
    };

    loadScript('moment-js', 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js', () => {
      // Inject Qualiphy Quidget script
      if (!document.getElementById('qualiphy-script')) {
        const script = document.createElement('script');
        script.id = 'qualiphy-script';
        script.type = 'text/javascript';
        script.src = 'https://app.qualiphy.me/scripts/quidget_disclosure.js';
        script.setAttribute('data-formsrc', 'https://app.qualiphy.me/qualiphy-widget?clinic=Med Revolve&clinicId=6191&first_name=&last_name=&email=&phone_number=&gender=&exams=selectable&tele_state_required=true&token=ed075bd3b6b8adafb90dbe584feecd0d69c007e0');
        script.setAttribute('data-timezone', '-4');
        script.setAttribute('data-examhours', '[{"SUN":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"MON":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"TUE":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"WED":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"THU":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"FRI":{"FROM":"00:00","TO":"23:59","isDaySelected":true}},{"SAT":{"FROM":"00:00","TO":"23:59","isDaySelected":true}}]');
        document.body.appendChild(script);
      }
    });

    return () => {
      // Cleanup on unmount
      const s = document.getElementById('qualiphy-script');
      if (s) s.remove();
    };
  }, []);

  const features = [
    { icon: Video, label: 'Instant Video Consultation', desc: 'Connect with a licensed provider in minutes' },
    { icon: Shield, label: 'State-Licensed Providers', desc: 'All providers verified and credentialed' },
    { icon: Clock, label: '24/7 Availability', desc: 'Access care whenever you need it' },
    { icon: Star, label: '$27.99 Per Exam', desc: 'No hidden fees, no subscription required' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFBF7] to-[#F5F0E8]">
      {/* Hero */}
      <div className="bg-[#2D3A2D] text-white py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Video className="w-4 h-4" />
            Powered by Qualiphy Telehealth
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4">
            On-Demand <span className="font-bold">Medical Consultations</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Good faith exams, GLP-1 prescriptions, IV therapy clearances, and more — 
            instantly connect with a licensed provider from the comfort of your home.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 text-center shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-[#4A6741]" />
                </div>
                <p className="font-semibold text-[#2D3A2D] text-sm">{f.label}</p>
                <p className="text-xs text-[#5A6B5A] mt-1">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quidget Widget Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-10 text-center"
        >
          <h2 className="text-2xl font-semibold text-[#2D3A2D] mb-2">Start Your Consultation</h2>
          <p className="text-[#5A6B5A] mb-8">Click below to connect with a licensed provider now</p>

          {/* Qualiphy Quidget Button mounts here */}
          <div className="flex justify-center">
            <div id="main-qualiphy-widget">
              <div
                id="loadFormButton"
                style={{
                  width: '200px',
                  height: '50px',
                  cursor: 'pointer',
                  backgroundColor: '#4A6741',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#3D5636'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#4A6741'; }}
                onClick={() => window.showDisclosureModal && window.showDisclosureModal()}
              >
                <Video className="w-4 h-4" />
                Start Exam
              </div>
            </div>
            <p style={{ display: 'none' }} id="not-available">Not available at this time</p>
          </div>

          <p className="text-xs text-[#5A6B5A] mt-6">
            By proceeding, you agree to Qualiphy's{' '}
            <a href="https://qualiphy.me/qualiphy-terms-of-use/qualiphy-patient-telehealth-consent-and-liability-release/" 
               target="_blank" rel="noopener noreferrer" className="text-[#4A6741] underline">
              Telehealth Consent
            </a>
            . Please be in a private space before starting.
          </p>
        </motion.div>

        {/* What to Expect */}
        <div className="mt-10 bg-[#2D3A2D] rounded-3xl p-8 text-white">
          <h3 className="text-xl font-semibold mb-6 text-center">What to Expect</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Click Start Exam', desc: 'Accept the telehealth consent and select your exam type' },
              { step: '2', title: 'Video Consultation', desc: 'Connect instantly with a licensed provider via video call' },
              { step: '3', title: 'Receive Results', desc: 'Get your exam results and prescriptions in real-time' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#4A6741] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-white/60 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}