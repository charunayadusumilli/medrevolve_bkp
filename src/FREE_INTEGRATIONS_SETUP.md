# 🔌 Free Proxy Integrations Setup Guide

## ✅ Already Configured

### **Twilio** (SMS & Video) - PARTIAL ✅
- **Status:** Credentials set, functions exist
- **Free Tier:** $15 credit (trial account)
- **What works:**
  - ✅ Send SMS (`sendSMS`)
  - ✅ Check status (`checkTwilioStatus`)
  - ⚠️ Video sessions (needs API key setup)
- **Secrets Set:**
  - `TWILIO_ACCOUNT_SID` ✅
  - `TWILIO_AUTH_TOKEN` ✅
  - `TWILIO_PHONE_NUMBER` ✅
- **Next Steps:**
  - Upgrade from trial to send to non-verified numbers
  - Add HIPAA-compliant messaging templates

---

## 🆕 New Integrations (Free Tiers)

### **1. ID.me** - Identity Verification
**Function:** `verifyIdentityIDme`
- **Free Tier:** Sandbox mode free, production pricing after
- **Use Case:** Verify patient identity before prescribing controlled substances
- **Setup:**
  1. Register at https://api.id.me/ (free sandbox)
  2. Create OAuth app
  3. Set secrets:
     ```
     IDME_CLIENT_ID=your_client_id
     IDME_CLIENT_SECRET=your_client_secret
     IDME_REDIRECT_URI=https://medrevolve.com/identity-verified
     IDME_SANDBOX=true  # Set to false in production
     ```
- **HIPAA:** BAA available for paid plans

---

### **2. SendGrid** - Transactional Email
**Function:** `sendTransactionalEmail`
- **Free Tier:** 100 emails/day forever
- **Use Case:** Appointment confirmations, prescription notifications
- **Setup:**
  1. Sign up at https://sendgrid.com (free account)
  2. Verify sender email (noreply@medrevolve.com)
  3. Generate API key
  4. Set secrets:
     ```
     SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
     SENDGRID_FROM_EMAIL=noreply@medrevolve.com
     SENDGRID_FROM_NAME=MedRevolve
     ```
- **HIPAA:** Requires paid plan for BAA ($15/mo)

---

### **3. Calendly** - Meeting Scheduling
**Function:** `createCalendlyEvent`
- **Free Tier:** 1 event type, unlimited meetings
- **Use Case:** Schedule provider consultations, B2B demos
- **Setup:**
  1. Sign up at https://calendly.com (free plan)
  2. Go to Integrations → API
  3. Generate personal access token
  4. Set secrets:
     ```
     CALENDLY_API_KEY=your_token_here
     CALENDLY_USER_URI=https://api.calendly.com/users/xxxxx (auto-fetched if not set)
     ```
- **HIPAA:** Not HIPAA-compliant (use for B2B only, not patient appointments)

---

### **4. ShipEngine** - Shipping Labels
**Function:** `createShippingLabel`
- **Free Tier:** 50 labels/month
- **Use Case:** Ship GLP-1 vials, RUO compounds, supplements
- **Setup:**
  1. Sign up at https://www.shipengine.com (free account)
  2. Connect carrier accounts (USPS, UPS, FedEx)
  3. Generate API key
  4. Set secrets:
     ```
     SHIPENGINE_API_KEY=your_api_key
     SHIPENGINE_CARRIER_ID=usps  # or ups, fedex
     ```
- **HIPAA:** N/A (shipping only)

---

## 📋 Secret Setup Commands

Run these in Base44 dashboard → Settings → Secrets:

```bash
# ID.me (sandbox)
IDME_CLIENT_ID=your_sandbox_client_id
IDME_CLIENT_SECRET=your_sandbox_client_secret
IDME_SANDBOX=true

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@medrevolve.com
SENDGRID_FROM_NAME=MedRevolve

# Calendly
CALENDLY_API_KEY=your_personal_access_token

# ShipEngine
SHIPENGINE_API_KEY=your_api_key
SHIPENGINE_CARRIER_ID=usps
```

---

## 🧪 Testing Functions

### Test Twilio SMS:
```javascript
await base44.functions.invoke('sendSMS', {
  to: '+12403875224',
  message: 'Test SMS from MedRevolve!'
});
```

### Test SendGrid Email:
```javascript
await base44.functions.invoke('sendTransactionalEmail', {
  to: 'admin@medrevolve.com',
  subject: 'Test Email',
  html: '<h1>Hello from MedRevolve!</h1>',
  text: 'Hello from MedRevolve!'
});
```

### Test ID.me Verification:
```javascript
await base44.functions.invoke('verifyIdentityIDme', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+12403875224'
});
```

### Test Calendly Event:
```javascript
await base44.functions.invoke('createCalendlyEvent', {
  title: 'GLP-1 Consultation',
  startTime: '2026-05-26T10:00:00-04:00',
  endTime: '2026-05-26T10:30:00-04:00',
  attendeeEmails: ['patient@example.com']
});
```

### Test ShipEngine Label:
```javascript
await base44.functions.invoke('createShippingLabel', {
  toName: 'John Doe',
  toAddress: '123 Main St',
  toCity: 'Gaithersburg',
  toState: 'MD',
  toZip: '20878',
  weight: 8, // ounces
  length: 10,
  width: 8,
  height: 4,
  orderId: 'order_123' // optional
});
```

---

## 🎯 Priority Implementation Order

### **Week 1: Complete Twilio**
- ✅ SMS already works
- ⚠️ Upgrade from trial ($15 credit)
- ⚠️ Add HIPAA-compliant templates
- ⚠️ Complete video room setup

### **Week 2: SendGrid Email**
- ✅ Function ready
- ⚠️ Sign up for free account
- ⚠️ Verify sender domain
- ⚠️ Replace Gmail sending with SendGrid

### **Week 3: Calendly Scheduling**
- ✅ Function ready
- ⚠️ Sign up for free account
- ⚠️ Create event types (GLP-1 consult, B2B demo)
- ⚠️ Integrate with booking flow

### **Week 4: ID.me Verification**
- ✅ Function ready
- ⚠️ Register for sandbox account
- ⚠️ Test identity verification flow
- ⚠️ Add to patient onboarding

### **Month 2: ShipEngine Shipping**
- ✅ Function ready
- ⚠️ Sign up when ready to ship products
- ⚠️ Connect USPS account
- ⚠️ Test label generation

---

## 💰 Cost Summary

| Service | Free Tier | Paid Plan (if needed) |
|---------|-----------|----------------------|
| **Twilio** | $15 credit | $0.0075/SMS, $0.0085/min video |
| **SendGrid** | 100 emails/day | $15/mo (HIPAA BAA) |
| **Calendly** | 1 event type | $10/mo (multiple event types) |
| **ShipEngine** | 50 labels/mo | $0.05/label after free tier |
| **ID.me** | Sandbox free | Custom pricing (BAA) |

**Total Monthly Cost:** $0/month (using free tiers only)  
**With HIPAA Compliance:** ~$30-50/month

---

## 🔒 HIPAA Compliance Notes

### **Currently HIPAA-Ready:**
- ✅ Twilio (with BAA - $15/mo add-on)
- ✅ SendGrid (with BAA - $15/mo add-on)
- ✅ Qualiphy (already integrated)
- ✅ Beluga Health (already integrated)

### **NOT HIPAA-Compliant (Free Tiers):**
- ❌ Calendly (use for B2B only)
- ❌ ID.me (requires paid plan for BAA)
- ❌ ShipEngine (shipping only, no PHI)

### **Recommendation:**
Upgrade Twilio and SendGrid to HIPAA plans ($30/mo total) before handling patient data.

---

## 🚀 Next Steps

1. **Sign up for services** (all free, 10 minutes each)
2. **Add secrets** to Base44 dashboard
3. **Test functions** with sample data
4. **Integrate into frontend** forms
5. **Upgrade to HIPAA** plans when ready for production

**All functions are ready to use once secrets are configured!** 🎉

---

*Last updated: 2026-05-25*
*Total setup time: ~1 hour*