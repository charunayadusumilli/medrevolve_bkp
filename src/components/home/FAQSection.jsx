import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'To create an account with MedRevolve, simply click the "Sign Up" button in the navigation bar. You will need to provide your name, address, email, and phone number to get started on your wellness journey.'
  },
  {
    question: 'What information is required to sign up?',
    answer: 'To create an account, you\'ll need to provide your full name, shipping address, email address, and phone number. This information helps us deliver your treatments safely and keep you updated on your orders.'
  },
  {
    question: 'Do I need a consultation before starting?',
    answer: 'Yes, medical providers require that you complete a health questionnaire before ordering. We recommend consulting your primary care physician to ensure our products are suitable for your health needs. Our licensed providers will review your information and determine eligibility.'
  },
  {
    question: 'Can I still order if I have a pre-existing medical condition?',
    answer: 'Yes, but you must disclose any pre-existing medical conditions and complete the medical intake form as accurately and thoroughly as possible. A licensed medical provider will review your information and determine if you are eligible for a prescription.'
  },
  {
    question: 'How do I update my shipping address?',
    answer: 'You can update your shipping address anytime through your account settings. Please note that if you\'ve already placed an order, it will be shipped to the address entered at checkout. Contact our customer service team to make changes to an existing order.'
  },
  {
    question: 'What is a Brand Partner?',
    answer: 'A Brand Partner is an independent contractor who promotes and sells MedRevolve products through a unique referral link. Brand Partners help connect customers with our products and may earn commissions on sales made through their link.'
  },
  {
    question: 'How do I become a Brand Partner?',
    answer: 'To become a Brand Partner, visit our "For Creators" page and click "Join Us." Our team will review your application and get back to you with details about the program, including commission structures and marketing support.'
  },
  {
    question: 'How do I contact support if I have questions?',
    answer: 'For any questions or assistance, you can reach our support team through the Contact page. We\'re available to help you with orders, account issues, medical questions, and any other concerns you may have.'
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
            Frequently Asked <span className="font-medium text-[#4A6741]">Questions</span>
          </h2>
          <p className="text-lg text-[#5A6B5A]">
            Find answers to common questions about MedRevolve
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-[#F5F0E8] rounded-2xl px-6 border-none"
              >
                <AccordionTrigger className="text-left text-[#2D3A2D] font-medium hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#5A6B5A] pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}