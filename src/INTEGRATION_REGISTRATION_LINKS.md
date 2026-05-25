# 🔗 Integration Registration Links

## ✅ **Already Connected** (No Action Needed)

### **Stripe** ✅
- **Status:** Live & Processing Payments
- **Dashboard:** https://dashboard.stripe.com/
- **Products:** GLP-1 ($399/mo), Consultations ($199), B2B ($2,999/mo)

### **Twilio** ⚠️
- **Status:** Trial Account ($15 credit)
- **Dashboard:** https://console.twilio.com/
- **Upgrade:** https://console.twilio.com/upgrade
- **Issue:** Can only send to verified numbers on trial

### **Instagram/Facebook** ✅
- **Status:** Auto-posting active
- **Managed via:** Base44 connectors

### **HubSpot** ✅
- **Status:** CRM syncing
- **Dashboard:** https://app.hubspot.com/

### **Google Suite** ✅
- **Gmail, Drive, Calendar, Analytics** - All connected

### **TikTok** ✅
- **Status:** Analytics syncing

### **Slack Bot** ✅
- **Status:** Team notifications

### **Qualiphy** ✅
- **Status:** Compliance docs
- **Dashboard:** https://qualiphy.com/

### **Beluga Health** ✅
- **Status:** Patient management

### **PureRx** ✅
- **Status:** Pharmacy fulfillment

### **Zoho CRM** ⚠️
- **Status:** Connected (may need token refresh)
- **Dashboard:** https://crm.zoho.com/

---

## 🆕 **Ready to Register** (Free Tiers)

### **1. SendGrid** - Transactional Email
**Function:** `sendTransactionalEmail`
- **Free Tier:** 100 emails/day forever
- **Setup Time:** 10 minutes
- **Registration:** https://signup.sendgrid.com/
- **Login:** https://app.sendgrid.com/
- **API Key Setup:** https://app.sendgrid.com/settings/api_keys
- **Verify Sender:** https://app.sendgrid.com/settings/sender_auth

**Steps:**
1. Sign up (free account)
2. Verify your email (noreply@medrevolve.com)
3. Create API key (Full Access)
4. Copy API key
5. Add to Base44 secrets: `SENDGRID_API_KEY`

**After Setup:**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@medrevolve.com
SENDGRID_FROM_NAME=MedRevolve
```

---

### **2. Calendly** - Meeting Scheduling
**Function:** `createCalendlyEvent`
- **Free Tier:** 1 event type, unlimited meetings
- **Setup Time:** 10 minutes
- **Registration:** https://calendly.com/signup
- **Login:** https://calendly.com/
- **API Token:** https://calendly.com/integrations/api_and_webhooks
- **Profile URI:** https://api.calendly.com/users/me (auto-fetched)

**Steps:**
1. Sign up (free plan)
2. Set up 1 event type (e.g., "GLP-1 Consultation")
3. Go to Integrations → API & Webhooks
4. Generate personal access token
5. Copy token
6. Add to Base44 secrets: `CALENDLY_API_KEY`

**After Setup:**
```bash
CALENDLY_API_KEY=your_personal_access_token
```

---

### **3. ID.me** - Identity Verification
**Function:** `verifyIdentityIDme`
- **Free Tier:** Sandbox mode (testing)
- **Setup Time:** 15 minutes
- **Registration:** https://api.id.me/register
- **Login:** https://api.id.me/
- **Sandbox Dashboard:** https://api.id.me/sandbox
- **OAuth Apps:** https://api.id.me/teams/<team_id>/applications

**Steps:**
1. Register for ID.me developer account (free)
2. Create new OAuth app
3. Select "Sandbox" environment
4. Set redirect URI: `https://medrevolve.com/identity-verified`
5. Copy Client ID and Client Secret
6. Add to Base44 secrets

**After Setup:**
```bash
IDME_CLIENT_ID=your_sandbox_client_id
IDME_CLIENT_SECRET=your_sandbox_client_secret
IDME_SANDBOX=true
IDME_REDIRECT_URI=https://medrevolve.com/identity-verified
```

**Production (Later):**
- Requires business verification
- HIPAA BAA available
- Custom pricing

---

### **4. ShipEngine** - Shipping Labels
**Function:** `createShippingLabel`
- **Free Tier:** 50 labels/month
- **Setup Time:** 15 minutes
- **Registration:** https://www.shipengine.com/signup
- **Login:** https://portal.shipengine.com/
- **API Key:** https://portal.shipengine.com/settings/api
- **Carriers:** https://portal.shipengine.com/carriers

**Steps:**
1. Sign up (free account)
2. Verify email
3. Connect carrier account (USPS, UPS, or FedEx)
   - For USPS: Free priority mail account
4. Generate API key
5. Copy API key
6. Add to Base44 secrets

**After Setup:**
```bash
SHIPENGINE_API_KEY=your_api_key
SHIPENGINE_CARRIER_ID=usps  # or ups, fedex
```

**Carrier Setup:**
- **USPS:** https://www.usps.com/business/pricing/business-indicators.htm (free)
- **UPS:** https://www.ups.com/upsdeveloperkit/ (free)
- **FedEx:** https://www.fedex.com/en-us/shipping/business.html (free)

---

### **5. Twilio Upgrade** - Production SMS/Video
**Current Status:** Trial account
- **Upgrade:** https://console.twilio.com/upgrade
- **Cost:** $15/month + usage fees
- **HIPAA BAA:** Available (contact support)

**Steps to Upgrade:**
1. Add credit card to Twilio
2. Upgrade from trial
3. Verify business information
4. Request HIPAA BAA (if needed for patient SMS)
5. Purchase phone number (or keep current)

**After Upgrade:**
- Can send SMS to any number
- Video rooms fully functional
- HIPAA-compliant with BAA

---

## 📋 **Quick Registration Checklist**

### **Today (30 minutes):**
- [ ] **SendGrid** - https://signup.sendgrid.com/
  - Takes 10 minutes
  - Free 100 emails/day
  - Need: Email verification

- [ ] **Calendly** - https://calendly.com/signup
  - Takes 10 minutes
  - Free 1 event type
  - Need: Event type setup

### **This Week (1 hour):**
- [ ] **ID.me** - https://api.id.me/register
  - Takes 15 minutes
  - Free sandbox
  - Need: Business info (can use personal for testing)

- [ ] **ShipEngine** - https://www.shipengine.com/signup
  - Takes 15 minutes
  - Free 50 labels/mo
  - Need: Carrier account (USPS free)

### **When Ready for Production:**
- [ ] **Twilio Upgrade** - https://console.twilio.com/upgrade
  - Takes 5 minutes
  - $15/month
  - Need: Credit card, business info

---

## 🔐 **Base44 Secrets Setup**

After registering, add secrets in Base44 dashboard:
**Settings → Secrets → Add Secret**

```bash
# SendGrid
Name: SENDGRID_API_KEY
Value: SG.xxxxxxxxxxxxx

# Calendly
Name: CALENDLY_API_KEY
Value: your_personal_access_token

# ID.me (Sandbox)
Name: IDME_CLIENT_ID
Value: your_sandbox_client_id

Name: IDME_CLIENT_SECRET
Value: your_sandbox_client_secret

Name: IDME_SANDBOX
Value: true

Name: IDME_REDIRECT_URI
Value: https://medrevolve.com/identity-verified

# ShipEngine
Name: SHIPENGINE_API_KEY
Value: your_api_key

Name: SHIPENGINE_CARRIER_ID
Value: usps
```

---

## 🧪 **Test After Setup**

### **Test SendGrid:**
```javascript
await base44.functions.invoke('sendTransactionalEmail', {
  to: 'admin@medrevolve.com',
  subject: 'Test Email',
  html: '<h1>Success!</h1>'
});
```

### **Test Calendly:**
```javascript
await base44.functions.invoke('createCalendlyEvent', {
  title: 'Test Meeting',
  startTime: '2026-05-26T10:00:00-04:00',
  attendeeEmails: ['test@example.com']
});
```

### **Test ID.me:**
```javascript
await base44.functions.invoke('verifyIdentityIDme', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});
```

### **Test ShipEngine:**
```javascript
await base44.functions.invoke('createShippingLabel', {
  toName: 'John Doe',
  toAddress: '123 Main St',
  toCity: 'Gaithersburg',
  toState: 'MD',
  toZip: '20878',
  weight: 8
});
```

---

## 💰 **Cost Summary**

| Service | Free Tier | Paid (if upgrade) |
|---------|-----------|-------------------|
| SendGrid | 100 emails/day | $15/mo (HIPAA) |
| Calendly | 1 event type | $10/mo (Pro) |
| ID.me | Sandbox free | Custom (production) |
| ShipEngine | 50 labels/mo | $0.05/label |
| Twilio | $15 credit | $15/mo + usage |

**Total Monthly:** $0/month (free tiers) or ~$30-50/month (with HIPAA)

---

## 📞 **Support Links**

### **Documentation:**
- [SendGrid Docs](https://docs.sendgrid.com/)
- [Calendly API Docs](https://developer.calendly.com/)
- [ID.me Developer](https://developer.id.me/)
- [ShipEngine Docs](https://www.shipengine.com/docs/)
- [Twilio Docs](https://www.twilio.com/docs)

### **Support:**
- SendGrid: https://support.sendgrid.com/
- Calendly: https://help.calendly.com/
- ID.me: https://api.id.me/support
- ShipEngine: https://www.shipengine.com/support/
- Twilio: https://support.twilio.com/

---

## 🎯 **Registration Order**

**Fastest to Slowest:**
1. SendGrid (5-10 min) ⚡
2. Calendly (5-10 min) ⚡
3. ShipEngine (10-15 min)
4. ID.me (15-20 min)
5. Twilio Upgrade (5 min)

**Start with SendGrid → Calendly (20 min total, both free!)**

---

*Last updated: 2026-05-25*
*All links verified and working*