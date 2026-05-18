# MedRevolve — Platform Gap Analysis & Action Plan
### Source: Developer Kickoff (May 10–12, 2026) | Action Plan XLSX + Meeting Notes
### Prepared: May 18, 2026
### Purpose: Cross-reference what's built vs. what the team aligned on building

---

## EXECUTIVE SUMMARY

The May 12, 2026 kickoff call and accompanying action plan reveal a **significant strategic pivot** from the original MedRevolve DTC telehealth platform. The team is now building a **B2B SaaS merchant platform** — a modular dashboard that serves peptide/GLP merchants as clients, providing them with compliance tools, inventory management, payment processing, domain/website provisioning, and telehealth infrastructure as **toggle-based add-on modules**.

**Bottom Line:**
- What's currently built = a polished DTC patient-facing telehealth platform (Hims/Ro clone)
- What the team wants to build = a B2B operator platform for other merchants to run their own telehealth businesses
- **These are two different products.** The existing build is ~60% reusable as the "white-label storefront" module. The new B2B merchant dashboard layer is ~5% built.

---

## SECTION 1: WHAT THE ACTION PLAN CALLS FOR (New Vision)

### The Core Product: "MedAssist UI" — Merchant Dashboard Platform

The platform is a **federated SaaS portal** where merchants (peptide sellers, GLP clinics, wellness operators) sign up, get a website + domain + compliance tools, and operate their telehealth business under MedRevolve infrastructure.

### Three Primary "Hooks" to Attract Clients (Noel's framing):
1. **Inventory issues** — merchants can't track or manage product stock
2. **PEPMD compliance** — merchants are exposed on compliance; MedRevolve provides the shield
3. **Credit card processing** — peptide/GLP merchants struggle to get merchant accounts; Card Group Intl provides processing

### Module Architecture (Toggle-Based)
Each module is purchased separately by the merchant client:

| # | Module | Status in Current Build |
|---|--------|------------------------|
| 1 | **Platform Entry** (domain + website + product catalog) | ⚠️ Partially built (DTC site exists; no multi-tenant provisioning) |
| 2 | **Domain Hosting & Purchasing** (GoDaddy/Namecheap API) | 🔴 NOT BUILT |
| 3 | **Website Builder** (25 themes, 5 checkout themes, product/compliance control) | 🔴 NOT BUILT |
| 4 | **Card Group Intl – Credit Card Processing** (merchant account onboarding API) | 🔴 NOT BUILT |
| 5 | **Card Group Intl – Crypto Processing** | 🔴 NOT BUILT |
| 6 | **Inventory Management** (stock tracking, reorder alerts, expiry mgmt, external sales) | 🔴 NOT BUILT |
| 7 | **Compliance / PEPMD** (automated compliance crawlers, LegitScript alt, MasterCard cert) | ⚠️ Partial (ComplianceDashboard exists for internal use; not merchant-facing) |
| 8 | **Pharmacy Integration** (Karthik's pharmacy API, prescription routing) | ⚠️ Partial (Beluga integration exists; Karthik-specific API not yet integrated) |
| 9 | **Provider Integration / Telehealth** (patient questionnaire, GLP↔RUO toggle, video) | ⚠️ Partial (consultation flow exists; GLP/RUO toggle not built) |
| 10 | **Marketing Module** (SEO tools, ad tracking, Facebook/IG pixel) | 🔴 NOT BUILT |
| 11 | **Peptide University (LMS)** | 🔴 NOT BUILT |
| 12 | **LLC/Business Formation** | 🔴 NOT BUILT |
| 13 | **Billing System** (SaaS subscriptions for module access) | 🔴 NOT BUILT (Stripe exists for DTC orders; not for SaaS billing) |
| 14 | **Web Crawler / Compliance Monitoring** | 🔴 NOT BUILT |
| 15 | **ACH/Bank Processing** | 🔴 NOT BUILT |

---

## SECTION 2: BUILT vs. NEEDED — DETAILED BREAKDOWN

### 2A. MERCHANT ONBOARDING (Priority: 🔴 CRITICAL — Sprint 1)

**What's needed (from action plan):**
- "Start Here" / merchant onboarding flow
- Fields: LLC name, EIN, SSN, URL choice, product category selection
- Auto-provision domain on signup (GoDaddy or Namecheap API)
- Auto-provision hosted website with selected theme
- Toggle access to modules purchased

**What's built:**
- ✅ `PartnerSignup` page — collects business name, contact, partner code (minimal)
- ✅ `Partner` entity — has business info, branding colors, enabled_products, status
- ❌ No LLC/EIN/SSN collection
- ❌ No domain availability check or auto-purchase
- ❌ No website auto-provisioning
- ❌ No module toggle system

**Gap:** The Partner entity and PartnerSignup page are a skeleton. Need full merchant onboarding wizard with legal entity info, domain selection, and module activation.

---

### 2B. MERCHANT DASHBOARD (Priority: 🔴 CRITICAL — Sprint 1–2)

**What's needed:**
- Central dashboard with sidebar nav: Dashboard, Products, Clients, Marketing, Peptide U, Add-Ons
- Grid layout showing purchased modules as cards (toggle on/off)
- Sales overview, inventory snapshot, compliance status, pending orders

**What's built:**
- ✅ `PartnerPortal` page — shows branding, enabled products, referral tracking (minimal)
- ✅ `AdminDashboard` — full admin view (not merchant-facing)
- ❌ No module grid with toggle activation
- ❌ No sales/revenue dashboard for merchants
- ❌ No sidebar nav for merchant portal

**Gap:** PartnerPortal needs to be completely rebuilt as a full merchant dashboard with the sidebar nav and module cards the team described. Currently it's a basic partner branding page.

---

### 2C. INVENTORY MANAGEMENT MODULE (Priority: 🔴 CRITICAL — Sprint 2–3)

**What's needed (from meeting notes):**
- Track stock levels per product per merchant
- Manual stock adjustments (damaged, removed)
- Expiry date tracking
- Automated/manual reorder triggers based on delivery times
- External sales input (sales made outside the platform)
- Reports: when/where/why failures, stock levels over time
- Prevent orders for out-of-stock items
- Backup product mapping (every product needs a backup SKU)

**What's built:**
- ❌ Zero inventory management — no entity, no page, no logic

**Gap:** Entire module needs to be built from scratch. Needs new entity: `MerchantInventory`.

**Proposed Entity: `MerchantInventory`**
```
merchant_id (FK: Partner)
product_id
product_name
current_stock (integer)
min_stock_threshold (integer) — triggers reorder alert
reorder_quantity (integer)
backup_product_id (string)
expiry_date (date)
last_restocked (datetime)
notes (string)
```

---

### 2D. DOMAIN & HOSTING MODULE (Priority: 🔴 CRITICAL — Sprint 1)

**What's needed:**
- Domain availability checker (GoDaddy or Namecheap API)
- Auto-purchase domain on merchant signup confirmation
- Auto-provision hosting (multi-tenant subdomains or custom domains)
- Option for client to bring existing domain
- Platform control over subdomain space (client.medrevolve.com model)

**What's built:**
- ❌ Zero domain management
- ❌ No hosting API integration
- ❌ No multi-tenant architecture

**Gap:** Pehuen owns this. Requires external infrastructure work entirely separate from the current Base44 React frontend. This is a **backend infrastructure task** not achievable in current Base44 environment without custom hosting.

---

### 2E. WEBSITE BUILDER MODULE (Priority: 🔴 HIGH — Sprint 2)

**What's needed:**
- 25 themes for the merchant storefront
- 5 themes for the checkout
- Product catalog control (which GLP/peptide products appear)
- Compliance-controlled content (AI bot builds compliant website automatically)
- GLP ↔ RUO product toggle per merchant

**What's built:**
- ✅ The MedRevolve DTC site itself can serve as **Theme 1** (the white-label template)
- ✅ `Products` page with filtering and categories
- ✅ Product entity with pricing, categories, availability flags
- ❌ No multi-theme system
- ❌ No per-merchant product catalog customization (beyond Partner.enabled_products array)
- ❌ No GLP/RUO toggle (this is a compliance distinction — GLP = FDA-regulated, RUO = research use only)

**Gap:** The Partner entity has `enabled_products[]` — this is the right foundation. Need UI for merchants to toggle products on/off and configure their storefront. Theme system requires significant new work.

---

### 2F. PAYMENT PROCESSING MODULE — Card Group Intl (Priority: 🔴 CRITICAL — Noel)

**What's needed:**
- Merchant account auto-boarding via Card Group Intl API
- MasterCard/Visa certification compliance (Noel's responsibility)
- Crypto payment processing option
- ACH processing
- Buy rate confirmation
- Facebook merchant certification (for ad platform compliance)

**What's built:**
- ✅ Stripe integration (for DTC patient orders and consultation payments)
- ❌ No Card Group Intl integration
- ❌ No merchant account onboarding flow
- ❌ No crypto processing
- ❌ No ACH

**Gap:** Stripe is for MedRevolve's own transactions. Card Group Intl is for enabling merchant clients to process payments through their own merchant accounts. These are separate systems. Noel needs to confirm API specs from Card Group Intl.

---

### 2G. COMPLIANCE MODULE (Priority: 🔴 CRITICAL)

**What's needed:**
- PEPMD compliance tooling (the core "hook")
- Web crawler that monitors merchant sites for compliance violations
- LegitScript alternative (Karthik's cert or LegitScript fallback)
- MasterCard/Visa merchant category certification
- Automated compliance document generation
- SOC2 compliance for the platform itself

**What's built:**
- ✅ `ComplianceDashboard` page (internal admin tool)
- ✅ `ComplianceRecord` entity with risk scoring
- ✅ `ComplianceMessage` entity for threaded communication
- ✅ `ComplianceDocuments`, `ComplianceMessaging`, `ComplianceOverview` components
- ✅ `generateComplianceDoc`, `verifyCompliance`, `uploadComplianceDocument` functions (inaccessible due to plan)
- ❌ No web crawler for automated compliance monitoring
- ❌ No merchant-facing compliance portal (only admin-facing)
- ❌ No LegitScript API integration built
- ❌ SOC2 certification = organizational/process work, not a code task

**Gap:** The compliance infrastructure exists for internal admin use. It needs to be exposed as a merchant-facing module, and automated crawling/monitoring needs to be built separately.

---

### 2H. PHARMACY INTEGRATION — Karthik's API (Priority: 🔴 HIGH — Sprint 3)

**What's needed:**
- Exclusive agreement with Karthik (pharmacy partner)
- Karthik pharmacy API integration for prescription routing
- Patient questionnaire flow connected to pharmacy
- Prescription fulfillment status syncing

**What's built:**
- ✅ Beluga Health integration (belugaSubmitVisit, belugaGetPatient, belugaSyncStatus)
- ✅ Prescription entity with full lifecycle tracking
- ✅ `submitPrescriptionToPharmacy` function
- ✅ PharmacyContract entity
- ❌ No Karthik-specific API integration (Beluga is the current pharmacy routing layer)
- ❌ Beluga functions inaccessible (subscription issue)

**Gap:** Beluga Health is the current pharmacy routing mechanism. Whether Karthik's pharmacy replaces or supplements Beluga needs clarification. Once Noel gets the API specs from Karthik, the Beluga functions can be adapted.

---

### 2I. TELEHEALTH / PROVIDER INTEGRATION (Priority: 🔴 HIGH — Sprint 2–3)

**What's needed (from action plan):**
- GLP ↔ RUO product toggle
- Patient questionnaire connected to consultation booking
- Provider assignment logic
- Video consultation flow

**What's built:**
- ✅ Consultation booking flow (ConsultationBooking entity, BookAppointment page)
- ✅ Questionnaire page (PatientIntake entity)
- ✅ Video call infrastructure (Twilio functions, VideoCall page, WaitingRoom)
- ✅ Provider management (Provider entity, ProviderSchedule, ProviderDashboard)
- ❌ GLP/RUO toggle not built
- ❌ Provider assignment to merchant clients not built
- ❌ Telehealth functions inaccessible (subscription issue)

**Gap:** The telehealth infrastructure is the most complete of all the "new" modules. Main gaps: GLP/RUO toggle, subscription restoration, and wiring merchant clients to their designated providers.

---

### 2J. MARKETING MODULE (Priority: 🟡 MEDIUM — Sprint 4)

**What's needed:**
- SEO tools for merchant storefronts
- Ad tracking (Facebook pixel, Google Ads)
- Facebook merchant certification support
- Analytics dashboard per merchant

**What's built:**
- ✅ Google Analytics (GA4) injected globally
- ✅ Cookiebot
- ✅ Base44 analytics tracking
- ✅ `trackEvent`, `getAnalytics` functions
- ❌ No per-merchant analytics isolation
- ❌ No Facebook pixel management
- ❌ No SEO tooling for merchant sites

**Gap:** Analytics infrastructure exists but is platform-wide, not merchant-segmented.

---

### 2K. BILLING SYSTEM — SaaS Module Subscriptions (Priority: 🔴 CRITICAL — Sprint 4)

**What's needed:**
- Merchants pay for each module separately
- Entry fee: $99–$199 one-time
- Monthly platform fee (TBD)
- Per-module pricing (e.g., compliance module $X/mo, pharmacy integration $Y/mo)
- Billing dashboard for admin

**What's built:**
- ✅ Stripe integration (for DTC order checkout)
- ✅ AutoRx Stripe subscription billing
- ✅ `createCheckout`, `stripeWebhook` functions
- ❌ No SaaS subscription billing for merchant module access
- ❌ No pricing/billing management UI for admin
- ❌ `PaymentsDashboard` exists but is for patient/consultation payments, not SaaS billing

**Gap:** Stripe is partially built for transactions. Need to extend it for SaaS subscription billing (per-merchant, per-module billing). Stripe already supports this use case natively.

---

### 2L. PEPTIDE UNIVERSITY (LMS) (Priority: 🟡 MEDIUM — Sprint 4)

**What's needed:**
- Learning management system for peptide education
- Course content, certifications for merchants

**What's built:**
- ❌ Nothing

**Gap:** Full build required. Low priority until core modules are live.

---

## SECTION 3: SPRINT-BY-SPRINT ALIGNMENT

### WEEK 1 (Immediate)
| Task | Owner | Built? | Gap |
|------|-------|--------|-----|
| UI framework decision | Raj | ✅ React/Base44 already chosen | None — continue in Base44 |
| Onboarding flow wireframe | Raj | ⚠️ PartnerSignup exists | Needs full merchant onboarding wizard redesign |
| Domain API research | Raj/Pehuen | ❌ | Research GoDaddy/Namecheap APIs |
| MedRevolve site cleanup | Raj | ✅ Site is clean and functional | Minor cosmetic updates only |
| Sign Karthik exclusive | Noel | ❌ | Legal work, not code |
| Processor meeting | Noel | ❌ | Business dev, not code |
| Hosting platform selected | Pehuen | ❌ | Infrastructure decision needed |
| DB architecture designed | Pehuen | ⚠️ Base44 DB in use | Need to evaluate if Base44 scales or need custom DB |
| Dev/staging env up | Pehuen | ✅ Base44 has test/prod environments | Available now |

### WEEK 2 (Sprint 1 Build)
| Task | Built? | Notes |
|------|--------|-------|
| Merchant onboarding flow (code) | ❌ | Build new MerchantOnboarding page with LLC/EIN/domain fields |
| Domain purchase automation | ❌ | Requires Builder+ (backend functions) |
| AI website builder agent | ❌ | Partnership Outreach agent exists; needs website builder capability |
| Product catalog system | ⚠️ | Products hardcoded; need DB-driven per-merchant catalog |

### WEEK 3 (Sprint 2)
| Task | Built? | Notes |
|------|--------|-------|
| Merchant dashboard (clients, orders) | ⚠️ | AdminDashboard + PartnerPortal exist; need full merchant-facing rebuild |
| GLP ↔ RUO toggle | ❌ | Need product classification + per-merchant toggle |
| Pharmacy API integration | ⚠️ | Beluga exists; Karthik API pending specs from Noel |
| Patient questionnaire flow | ✅ | Questionnaire page + PatientIntake entity complete |

### WEEK 4 (Sprint 3)
| Task | Built? | Notes |
|------|--------|-------|
| Module architecture | ❌ | Core missing piece — toggle system for merchant module access |
| Marketing module v1 | ❌ | GA4 exists globally; per-merchant isolation needed |
| Peptide U LMS | ❌ | Full build |
| Billing system | ⚠️ | Stripe exists for DTC; SaaS billing layer needed |
| Web crawler v1 | ❌ | New build; needs Builder+ for backend function |

---

## SECTION 4: CRITICAL BLOCKERS

### 🔴 BLOCKER 1: Backend Functions Inaccessible
**All 65+ backend functions are locked** due to subscription downgrade. This blocks:
- Stripe payment processing (createCheckout, stripeWebhook)
- Twilio communications (SMS, video calls)
- HubSpot CRM sync (all automations failing)
- Gmail email delivery
- All new module functions that need to be built

**Resolution:** Upgrade to Builder+ plan IMMEDIATELY. Nothing in Sprint 1+ is buildable without it.

### 🔴 BLOCKER 2: No Multi-Tenant Architecture
The current app is a single-tenant React app serving one brand (MedRevolve). The pivot requires:
- Multiple merchants each with their own portal login
- Per-merchant data isolation
- Per-merchant storefront configuration
- Per-merchant module access control

**Resolution:** Pehuen needs to architect the hosting layer. In Base44, this can be approximated with per-merchant `Partner` records and role-based data filtering. True multi-tenant subdomain provisioning requires external hosting infrastructure.

### 🔴 BLOCKER 3: Card Group Intl API Specs Needed
The entire payment processing module depends on Card Group Intl's API. Noel needs to:
- Get API documentation from Card Group Intl
- Confirm auto-boarding API is available
- Get certified as compliance-controlling ISO
- Confirm support for peptide merchants

### 🔴 BLOCKER 4: Karthik Exclusive Agreement + API
The pharmacy integration module depends on:
- Exclusive agreement with Karthik (Noel scheduling Monday)
- Karthik's pharmacy API specifications
- Determining if Karthik replaces or supplements Beluga Health

### 🔴 BLOCKER 5: Legal/Compliance Prerequisites
Before building compliance tooling:
- LegitScript alternative plan confirmed with processor
- MasterCard/Visa merchant category certification in progress
- Peptide attorney retained (brand name ruling)

---

## SECTION 5: WHAT TO BUILD NEXT (Prioritized)

### Tier 1: Build Now (Unblocked, High Value)

| # | What | Est. Effort | Notes |
|---|------|-------------|-------|
| 1 | **Merchant Onboarding Wizard** (new) | 2–3 days | Full replacement of PartnerSignup. LLC info, EIN, domain choice, module selection. Build on existing Partner entity. |
| 2 | **Merchant Dashboard** (rebuild PartnerPortal) | 3–4 days | Sidebar nav, module grid cards, sales snapshot. Wire to existing Partner entity. |
| 3 | **Module Toggle System** (new entity + UI) | 2 days | `MerchantModule` entity. Admin enables modules per merchant. Merchant sees locked/unlocked modules. |
| 4 | **Inventory Management Module** (new) | 3–4 days | New `MerchantInventory` entity + dashboard. Stock levels, alerts, expiry tracking. |
| 5 | **Per-Merchant Product Catalog** (refactor) | 2 days | Move Products off hardcoded array → DB-driven, filtered by merchant's `enabled_products[]` |
| 6 | **GLP / RUO Product Toggle** (new) | 1 day | Add `product_type: GLP | RUO | Both` to Product entity. Per-merchant toggle in dashboard. |
| 7 | **Admin Merchant Management** (extend AdminDashboard) | 1–2 days | Add "Merchants" tab to admin with full CRUD, module management, billing status |

### Tier 2: Build After Subscription Upgrade (Needs Backend Functions)

| # | What | Notes |
|---|------|-------|
| 1 | **SaaS Billing** (Stripe subscriptions per merchant) | New backend function `createMerchantSubscription` |
| 2 | **Card Group Intl Integration** | New backend functions; need API specs first |
| 3 | **Domain Auto-Purchase** | GoDaddy/Namecheap API; new backend function |
| 4 | **Compliance Web Crawler** | New scheduled backend function |
| 5 | **Karthik Pharmacy API** | Once specs received from Noel |
| 6 | **Merchant Email Notifications** | Fix HubSpot sync failures; unify email delivery |

### Tier 3: Later Sprints

| # | What | Notes |
|---|------|-------|
| 1 | Peptide University (LMS) | After core modules stable |
| 2 | Marketing Module v1 | Per-merchant analytics, pixel management |
| 3 | Multi-tenant subdomain hosting | Infrastructure, Pehuen's domain |
| 4 | ACH / crypto processing | After Card Group Intl credit card API is live |
| 5 | Facebook merchant certification tools | After marketing module |

---

## SECTION 6: NEW ENTITIES NEEDED

### `MerchantModule` — Controls which modules are active per merchant
```json
{
  "merchant_id": "FK: Partner",
  "module_key": "enum: domain_hosting | website_builder | card_processing | crypto_processing | inventory | compliance | pharmacy | telehealth | marketing | lms | llc_formation | billing",
  "is_active": "boolean",
  "activated_at": "datetime",
  "stripe_subscription_id": "string",
  "monthly_fee": "number",
  "trial_ends_at": "datetime"
}
```

### `MerchantInventory` — Per-merchant product stock tracking
```json
{
  "merchant_id": "FK: Partner",
  "product_id": "string",
  "product_name": "string",
  "product_type": "enum: GLP | RUO",
  "current_stock": "integer",
  "min_stock_threshold": "integer",
  "reorder_quantity": "integer",
  "backup_product_id": "string",
  "expiry_date": "date",
  "last_restocked": "datetime",
  "supplier_id": "string",
  "avg_delivery_days": "integer",
  "notes": "string"
}
```

### `MerchantOrder` — Orders placed by merchants (for inventory restocking)
```json
{
  "merchant_id": "FK: Partner",
  "supplier_id": "string",
  "items": "array of {product_id, quantity, unit_cost}",
  "total_cost": "number",
  "status": "enum: pending | ordered | in_transit | received | cancelled",
  "ordered_at": "datetime",
  "expected_delivery": "date",
  "received_at": "datetime",
  "tracking_number": "string",
  "notes": "string"
}
```

### `MerchantDomain` — Domain management per merchant
```json
{
  "merchant_id": "FK: Partner",
  "domain": "string",
  "registrar": "enum: godaddy | namecheap | existing",
  "status": "enum: checking | purchasing | provisioning | active | failed",
  "dns_configured": "boolean",
  "ssl_active": "boolean",
  "auto_renew": "boolean",
  "expires_at": "date",
  "registrar_domain_id": "string",
  "notes": "string"
}
```

### Update `Product` entity — Add product_type field
```
product_type: enum: GLP | RUO | supplement | device
```

---

## SECTION 7: WHAT'S ALREADY BUILT THAT CARRIES FORWARD

The existing MedRevolve platform is not throwaway — it's the **foundation of "Module 1"** (website builder / white-label storefront). Here's the asset inventory:

### 🟢 Fully Reusable As-Is
- Entire marketing website (Home, Products, Programs, Consultations, HowItWorks) → **DTC storefront template**
- Product catalog system (22 products, filtering, categories) → **merchant product catalog**
- Patient onboarding wizard → **end-customer onboarding for merchant's patients**
- Intake forms (Provider, Pharmacy, Creator, Business, Contact) → **reusable for merchant's own applications**
- Telehealth booking + video (once subscription restored) → **telehealth module**
- Prescription management flow → **pharmacy integration module**
- AutoRx recurring plans → **subscription medication module**
- Compliance infrastructure (ComplianceDashboard, ComplianceRecord) → **compliance module**
- AI Rev Bot assistant → **white-label AI assistant per merchant storefront**
- Role-based auth system → **merchant + their patient roles**
- HubSpot integration → **CRM module**

### 🟡 Needs Refactoring to Serve B2B Use Case
- `PartnerPortal` → Full rebuild as merchant dashboard
- `PartnerSignup` → Full rebuild as merchant onboarding wizard
- `AdminDashboard` → Add merchant management tabs
- `Products` page → Move from hardcoded to DB-driven, per-merchant filtered
- All existing automations → Add merchant_id scoping to all entity automations

### 🔴 New Builds Only (No Existing Foundation)
- Inventory management module
- Domain purchase automation
- Multi-tenant hosting provisioning
- Card Group Intl payment processing
- SaaS subscription billing
- Web compliance crawler
- GLP/RUO toggle system
- Peptide University LMS
- Marketing module (per-merchant)

---

## SECTION 8: IMMEDIATE RECOMMENDED ACTIONS

### This Week (Unblocked Work):

1. **Upgrade subscription to Builder+** — Unlocks all 65 backend functions. Nothing else matters until this is done.

2. **Build MerchantOnboarding wizard** — Replace PartnerSignup with full merchant registration flow (LLC info, EIN, domain selection, module picker)

3. **Create MerchantModule entity** — The toggle system is the architectural core of the new product

4. **Build MerchantInventory entity + basic UI** — This is Hook #1 (inventory issues) and can demo immediately

5. **Rebuild PartnerPortal as merchant dashboard** — Sidebar nav + module grid cards + sales/inventory snapshot

6. **Add `product_type: GLP | RUO`** to Product entity and build the toggle

### Next Week (After Subscription Restored):

7. **Fix all HubSpot automation failures** — 0% success rate on all HubSpot syncs

8. **Build `createMerchantSubscription` backend function** — SaaS billing foundation

9. **Get Card Group Intl API specs from Noel** → Build merchant account onboarding function

10. **Get Karthik pharmacy API specs from Noel** → Adapt/extend Beluga integration

---

## SECTION 9: OPEN QUESTIONS FOR TEAM

| Question | Stakeholder | Priority |
|----------|-------------|----------|
| Is Beluga Health being replaced by Karthik or supplemented? | Noel | 🔴 CRITICAL |
| What are the Card Group Intl API endpoints/auth model? | Noel | 🔴 CRITICAL |
| What hosting provider is Pehuen recommending? AWS? GCP? | Pehuen | 🔴 CRITICAL |
| Will MedRevolve control merchant domains (subdomain model) or just offer domain purchase? | All | 🔴 CRITICAL |
| What is the entry pricing confirmed? ($99–$199 one-time mentioned, monthly TBD) | Noel | 🔴 HIGH |
| Which is the primary CRM — HubSpot or Zoho? (both have integrations, both failing) | Raj/Noel | 🟡 MEDIUM |
| Is the existing MedRevolve DTC storefront staying live, or pivoting entirely to B2B? | Noel | 🟡 MEDIUM |
| Who is "Mike" — the first beta merchant client? What does he need specifically? | Noel | 🟡 MEDIUM |
| What LMS platform for Peptide U? Build from scratch or integrate existing? | Raj | 🟢 LOW |
| SOC2 Type II — engaging a compliance firm or using a tool like Vanta/Drata? | Noel | 🟡 MEDIUM |

---

*This document should be updated after each sprint. See also: TECHNICAL_DOCUMENTATION.md for current build inventory.*