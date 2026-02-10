import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, Phone, MapPin, Clock, Send, MessageCircle, 
  HelpCircle, Package, ArrowRight
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us a message anytime',
    value: 'support@medrevolve.com',
    action: 'mailto:support@medrevolve.com'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 8am to 6pm',
    value: '1-800-MED-REVO',
    action: 'tel:1-800-633-7386'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available 24/7',
    value: 'Start a conversation',
    action: '#'
  }
];

const quickLinks = [
  { icon: HelpCircle, title: 'FAQs', description: 'Find quick answers to common questions' },
  { icon: Package, title: 'Track Order', description: 'Check the status of your shipment' }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero */}
      <section className="pt-12 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-light text-[#2D3A2D] mb-4">
              Get in <span className="font-medium text-[#4A6741]">Touch</span>
            </h1>
            <p className="text-lg text-[#5A6B5A]">
              Have questions? We're here to help. Reach out through any of the methods below.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={method.title}
                  href={method.action}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A6741] transition-colors">
                    <Icon className="w-7 h-7 text-[#4A6741] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2D3A2D] mb-1">{method.title}</h3>
                  <p className="text-sm text-[#5A6B5A] mb-3">{method.description}</p>
                  <p className="text-[#4A6741] font-medium">{method.value}</p>
                </motion.a>
              );
            })}
          </div>

          {/* Form and Info */}
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-medium text-[#2D3A2D] mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#D4E5D7] flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-[#4A6741]" />
                    </div>
                    <h3 className="text-xl font-medium text-[#2D3A2D] mb-2">Message Sent!</h3>
                    <p className="text-[#5A6B5A]">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[#2D3A2D]">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-2 rounded-xl border-[#E8E0D5]"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#2D3A2D]">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="mt-2 rounded-xl border-[#E8E0D5]"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-[#2D3A2D]">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="mt-2 rounded-xl border-[#E8E0D5]"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-[#2D3A2D]">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="mt-2 rounded-xl border-[#E8E0D5] min-h-[150px]"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#4A6741] hover:bg-[#3D5636] text-white rounded-full py-6"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Side Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Quick Links */}
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <div 
                    key={link.title}
                    className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#4A6741]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#4A6741]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2D3A2D]">{link.title}</h3>
                      <p className="text-sm text-[#5A6B5A]">{link.description}</p>
                    </div>
                  </div>
                );
              })}

              {/* Hours */}
              <div className="bg-[#4A6741] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-medium">Business Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#4A6741]" />
                  <h3 className="font-medium text-[#2D3A2D]">Our Location</h3>
                </div>
                <p className="text-[#5A6B5A]">
                  Los Angeles, California<br />
                  United States
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}