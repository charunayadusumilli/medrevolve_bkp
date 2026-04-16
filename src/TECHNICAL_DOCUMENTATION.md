# MedRevolve — Complete Technical Documentation
### Last Updated: April 2026
### Platform: Base44 (React + Vite + Tailwind CSS + Deno serverless backend)

---

## TABLE OF CONTENTS
1. [Product Overview](#1-product-overview)
2. [All Pages & Screens](#2-all-pages--screens)
3. [Data Models / Database Schema](#3-data-models--database-schema)
4. [All Features & User Flows](#4-all-features--user-flows)
5. [API Endpoints / Backend Functions](#5-api-endpoints--backend-functions)
6. [AI / Automation Features](#6-ai--automation-features)
7. [Authentication & User Roles](#7-authentication--user-roles)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Business Logic & Rules](#9-business-logic--rules)
10. [Current State & Known Gaps](#10-current-state--known-gaps)

---

## 1. PRODUCT OVERVIEW

### What is MedRevolve?
MedRevolve is a **direct-to-consumer telehealth and prescription wellness platform** — similar to Hims, Ro, or UpScript. It connects patients with licensed medical providers for telehealth consultations, then fulfills compounded prescription medications through partner pharmacies, shipped directly to patients' doors.

### Problem It Solves
- Eliminates friction in accessing prescription wellness treatments (weight loss, hormone therapy, longevity, sexual health)
- Removes the need for in-person doctor visits for routine prescription wellness protocols
- Provides a marketplace for compounded medications at transparent pricing
- Creates a multi-sided platform connecting patients, providers, pharmacies, business partners, and content creators

### Core User Personas

| Role | Description |
|------|-------------|
| **Patient (user)** | End consumer. Browses products, completes intake forms, books telehealth consultations, receives prescriptions, orders medications |
| **Provider (provider)** | Licensed physician (MD/DO/NP/PA). Conducts telehealth consultations, writes prescriptions, manages patient care plans |
| **Pharmacy (pharmacy)** | Compounding pharmacy partner. Receives prescriptions, fills orders, ships medications |
| **Partner (partner)** | Business partner (gym, spa, wellness center, clinic). White-labels MedRevolve products under their own brand, earns referral revenue |
| **Creator (creator)** | Social media influencer/content creator. Promotes MedRevolve products via referral links, earns commissions |
| **Admin (admin)** | Platform operator. Manages all intake applications, compliance, contracts, analytics, and partner relationships |

### Core Modules
1. **Product Catalog & E-Commerce** — Browse treatments, product detail pages, cart, checkout via Stripe
2. **Telehealth Consultations** — Book appointments, video/phone/chat consultations via Twilio, AI clinical assistance
3. **Prescription Management** — E-prescribing, pharmacy routing, refill tracking, AutoRx recurring plans
4. **Patient Portal** — Appointments, prescriptions, consultation summaries, messages, AI health coach
5. **Provider Dashboard** — Onboarding journey, patient management, schedule management, clinical AI
6. **Partner/Creator Programs** — White-label portal, referral tracking, commission tiers, analytics
7. **Admin Command Center** — All intake management, compliance, contracts, analytics, integrations
8. **AI Assistant ("Rev Bot")** — Context-aware chatbot on every page, voice call capability, persona-based responses
9. **Beluga Health Integration** — External telehealth visit routing via Beluga Health API
10. **Compliance & Contracts** — License verification, document management, partner compliance workflows

---

## 2. ALL PAGES & SCREENS

### Public / Marketing Pages

| Page | Route | Purpose | Key Actions |
|------|-------|---------|-------------|
| **Home** | `/` or `/Home` | Landing page. Hero slider, product tabs, programs tab, testimonials, FAQ, CTA sections | Browse categories, view programs, navigate to consultations/products |
| **Products** | `/Products?category=X` | Full product catalog. 7 category tiles (Weight Loss, Longevity, Hormones, Men's, Women's, Hair & Skin [coming soon], Sexual Health [coming soon]). 22 products with filtering by form, benefit, and sorting | Select category, filter products, sort by price/popularity, click through to detail |
| **ProductDetail** | `/ProductDetail?id=X` | Single product deep-dive. Benefits, mechanism of action, pricing, AI-generated product images | Add to cart, book consultation, view related products |
| **Programs** | `/Programs` | Health programs overview. 4-step patient journey, treatment categories with pricing, FAQ | Start a program, book consultation |
| **Consultations** | `/Consultations` | Telehealth services landing. Service types (weight loss, hormone, longevity, etc.), how it works steps, provider directory | Book consultation, view upcoming appointments (if logged in) |
| **HowItWorks** | `/HowItWorks` | Explainer page for the telehealth process | Navigate to booking |
| **Contact** | `/Contact` | Contact form, business hours, communication channels | Submit contact request |
| **Privacy** | `/Privacy` | Privacy policy | Read-only |
| **Terms** | `/Terms` | Terms of service | Read-only |

### Partner/Creator/Business Landing Pages

| Page | Route | Purpose |
|------|-------|---------|
| **PartnerProgram** | `/PartnerProgram` | White-label partner program marketing. Benefits, earnings projections, medication catalog, pricing tiers, compliance info, FAQ |
| **ForCreators** | `/ForCreators` | Creator/influencer program. Commission tiers (Bronze 10%, Silver 12%, Gold 15%, Platinum 18%), earnings calculator, application CTA. If logged in as creator, shows dashboard with metrics |
| **ForBusiness** | `/ForBusiness` | Enterprise B2B landing. White-label, wholesale, corporate wellness models. Integration capabilities, case studies |

### Intake / Application Forms

| Page | Route | Purpose | Data Created |
|------|-------|---------|--------------|
| **PatientOnboarding** | `/PatientOnboarding` | 5-step wizard: Welcome → Profile → Document Upload → Tutorial → Done | `PatientIntake` entity |
| **CustomerIntake** | `/CustomerIntake` | Customer registration form. Collects personal info, primary interest, insurance, referral source | `CustomerIntake` entity |
| **Questionnaire** | `/Questionnaire` | Medical questionnaire for patients. Age, weight, height, goal weight, medical conditions, medications, allergies, lifestyle | `PatientIntake` entity |
| **ProviderIntake** | `/ProviderIntake` | 4-step provider application: Personal → Credentials → Experience → Availability | `ProviderIntake` entity |
| **PharmacyIntake** | `/PharmacyIntake` | Pharmacy partnership application. License, NPI, services, shipping capabilities | `PharmacyIntake` entity |
| **CreatorApplication** | `/CreatorApplication` | Creator program application. Platform, handle, followers, niche | `CreatorApplication` entity |
| **BusinessInquiry** | `/BusinessInquiry` | B2B inquiry form. Company, industry, interest type | `BusinessInquiry` entity |
| **PartnerSignup** | `/PartnerSignup` | Business partner registration. Business details, branding preferences | `Partner` entity |

### Patient Portal (Authenticated)

| Page | Route | Purpose |
|------|-------|---------|
| **PatientPortal** | `/PatientPortal` | Main patient dashboard. Tabs: Appointments, Consultation Notes, Prescriptions, AutoRx Plans, Messages. Includes AI Health Coach widget at top |
| **BookAppointment** | `/BookAppointment` | Appointment booking flow. Select provider, date/time, consultation type, reason |
| **MyAppointments** | `/MyAppointments` | View/manage all appointments |
| **Messages** | `/Messages` | Secure messaging with providers |
| **Cart** | `/Cart` | Shopping cart for product orders |
| **Checkout** | `/Checkout` | Stripe-powered checkout flow |
| **OrderSuccess** | `/OrderSuccess` | Post-purchase confirmation |
| **AccountSettings** | `/AccountSettings` | Profile settings, display name, phone |
| **AutoRxFollowup** | `/AutoRxFollowup` | Monthly follow-up form for AutoRx recurring prescription plans |

### Provider Portal (Authenticated)

| Page | Route | Purpose |
|------|-------|---------|
| **ProviderDashboard** | `/ProviderDashboard` | Provider onboarding journey (5-step timeline). Shows application status. FAQ section |
| **ProviderOnboarding** | `/ProviderOnboarding` | Extended onboarding flow |
| **ProviderProfile** | `/ProviderProfile` | Public-facing provider profile |
| **QualiphyConsult** | `/QualiphyConsult` | Qualiphy.me medical qualification exam integration |

### Telehealth / Video

| Page | Route | Purpose |
|------|-------|---------|
| **TelehealthPlatform** | `/TelehealthPlatform` | Telehealth session management |
| **VideoCall** | `/VideoCall` | Twilio-powered video consultation room |
| **WaitingRoom** | `/WaitingRoom` | Pre-consultation waiting room |

### Partner Portal (Authenticated)

| Page | Route | Purpose |
|------|-------|---------|
| **PartnerPortal** | `/PartnerPortal` | Partner dashboard. Branding, enabled products, referral tracking, earnings |
| **PartnerCompliance** | `/PartnerCompliance` | Partner-facing compliance document management |

### Admin Pages (admin role required)

| Page | Route | Purpose |
|------|-------|---------|
| **AdminDashboard** | `/AdminDashboard` | Master admin panel. Stats cards (9 metrics). Tabs: Analytics, AutoRx, Customers, Providers, Pharmacies, Businesses, Creators, Contacts, Partners, Referrals. Each tab shows entity list with status badges |
| **ComplianceDashboard** | `/ComplianceDashboard` | Compliance management across all partner types |
| **PharmacyContracts** | `/PharmacyContracts` | Manage pharmacy partnership contracts |
| **ProviderContracts** | `/ProviderContracts` | Manage provider contracts and compensation |
| **ProviderOutreach** | `/ProviderOutreach` | Provider recruitment pipeline management |
| **PartnershipHub** | `/PartnershipHub` | Partnership outreach management (pharmacy, telehealth, marketing, compliance services) |
| **PaymentsDashboard** | `/PaymentsDashboard` | Payment tracking, invoices, Stripe integration |
| **EmailAudit** | `/EmailAudit` | Email delivery audit trail |
| **BelugaIntegration** | `/BelugaIntegration` | Beluga Health API integration management |
| **VisitTypeSelector** | `/VisitTypeSelector` | Configure visit types (Beluga-routed vs. whitelabel) |
| **IntegrationsDashboard** | `/IntegrationsDashboard` | Overview of all third-party integrations |
| **MDIntegrationsDashboard** | `/MDIntegrationsDashboard` | Medical director integration management |

---

## 3. DATA MODELS / DATABASE SCHEMA

All entities use Base44's built-in fields: `id`, `created_date`, `updated_date`, `created_by` (email).

### 3.1 User (Built-in + Extended)
Built-in read-only: `id`, `created_date`, `full_name`, `email`

| Field | Type | Description |
|-------|------|-------------|
| role | enum: `admin`, `user`, `provider`, `pharmacy`, `partner`, `creator` | User role (default: `user`) |
| display_name | string | Preferred display name |
| phone | string | Phone number |

### 3.2 Provider
Represents a credentialed medical provider on the platform.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Full name |
| title | string | ✅ | Medical title (MD, NP, PA, etc.) |
| specialty | string | ✅ | Medical specialty |
| bio | string | | Short biography |
| philosophy | string | | Practice philosophy / "About Me" |
| photo | string | | Headshot URL |
| license_number | string | | Medical license number |
| states_licensed | string[] | | States where licensed |
| areas_of_expertise | string[] | | Specific conditions & treatment areas |
| availability | object | | Weekly schedule |
| rating | number | | Average patient rating |
| total_consultations | integer | | Lifetime consultation count |
| years_experience | integer | | Years of experience |
| education | string[] | | Educational background |
| testimonials | object[] | | Patient reviews (initials, rating, comment, date, verified) |
| is_active | boolean | | Currently accepting patients (default: true) |

### 3.3 Appointment
**Relationships:** `provider_id` → Provider, `patient_email` → User

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| provider_id | string | | FK to Provider |
| patient_email | string | ✅ | Patient's email |
| appointment_date | datetime | ✅ | Scheduled date/time |
| duration_minutes | integer | | Default: 30 |
| type | enum | ✅ | `initial_consultation`, `follow_up`, `dosage_adjustment`, `general_inquiry` |
| status | enum | | `pending`, `scheduled`, `confirmed`, `in_progress`, `completed`, `cancelled` |
| reason | string | | Reason for visit |
| notes | string | | Patient notes |
| provider_notes | string | | Private clinical notes |
| consultation_notes | string | | Notes from during/after appointment |
| ai_summary | string | | AI-generated clinical summary |
| follow_up_instructions | string | | AI-drafted follow-up instructions |
| diagnosis_codes | string[] | | ICD-10 codes |
| video_room_id | string | | Video call room ID |
| session_url | string | | Video call URL |
| prescription_provided | boolean | | Default: false |

### 3.4 Prescription
**Relationships:** `provider_id` → Provider, `patient_email` → User, `appointment_id` → Appointment, `pharmacy_id` → PharmacyContract

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| patient_email | string | ✅ | |
| provider_id | string | ✅ | |
| provider_name | string | | |
| appointment_id | string | | |
| medication_name | string | ✅ | |
| dosage | string | ✅ | e.g., "0.5mg" |
| frequency | string | | e.g., "Once weekly" |
| quantity | string | | e.g., "4 vials" |
| days_supply | integer | | |
| refills | integer | | Default: 0 |
| refills_used | integer | | Default: 0 |
| instructions | string | | Sig / special instructions |
| diagnosis_code | string | | ICD-10 |
| start_date | date | | |
| expiry_date | date | | Usually 1 year |
| status | enum | | `draft`, `active`, `sent_to_pharmacy`, `dispensed`, `completed`, `cancelled`, `refill_requested` |
| pharmacy_id | string | | FK to PharmacyContract |
| pharmacy_name | string | | |
| pharmacy_email | string | | |
| rx_number | string | | Unique Rx number |
| sent_to_pharmacy_at | datetime | | |
| dispensed_at | datetime | | |
| refill_requested_at | datetime | | |
| refill_request_notes | string | | |
| is_controlled_substance | boolean | | Default: false |
| notes | string | | Internal notes |

### 3.5 ConsultationSummary
**Relationships:** `appointment_id` → Appointment, `patient_email` → User, `provider_id` → Provider

| Field | Type | Required |
|-------|------|----------|
| appointment_id | string | ✅ |
| patient_email | string | ✅ |
| provider_id | string | ✅ |
| chief_complaint | string | |
| diagnosis | string | |
| treatment_plan | string | |
| medications_prescribed | string[] | |
| follow_up_instructions | string | |
| next_appointment_recommended | string | |
| provider_notes | string | |

### 3.6 Message
**Relationships:** `provider_id` → Provider, `patient_email` → User, `appointment_id` → Appointment

| Field | Type | Required |
|-------|------|----------|
| appointment_id | string | |
| provider_id | string | ✅ |
| patient_email | string | ✅ |
| sender_type | enum: `patient`, `provider` | ✅ |
| message_text | string | ✅ |
| attachment_url | string | |
| is_read | boolean | Default: false |
| read_at | datetime | |

### 3.7 Order
**Relationships:** `customer_email` → User

| Field | Type | Required |
|-------|------|----------|
| customer_email | string | ✅ |
| customer_name | string | ✅ |
| items | object[] | ✅ | Array of {product_id, product_name, price, quantity} |
| shipping_address | string | ✅ |
| shipping_city | string | |
| shipping_state | string | |
| shipping_zip | string | |
| shipping_phone | string | |
| subtotal | number | |
| tax | number | |
| total | number | ✅ |
| stripe_session_id | string | |
| stripe_payment_intent | string | |
| status | enum | | `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled` |
| tracking_number | string | |
| notes | string | |

### 3.8 Product

| Field | Type | Required |
|-------|------|----------|
| product_id | string | ✅ |
| name | string | ✅ |
| category | enum | ✅ | `weight_loss`, `mens_health`, `womens_health`, `hair_loss`, `longevity`, `hormone`, `peptides` |
| description | string | |
| subtitle | string | |
| minimum_price | number | ✅ |
| suggested_retail_price | number | |
| benefits | string[] | |
| how_it_works | string | |
| dosage_info | string | |
| side_effects | string[] | |
| form | enum | | `tablet`, `capsule`, `injection`, `topical`, `patch`, `cream`, `gel`, `nasal_spray` |
| prescription_required | boolean | Default: true |
| available | boolean | Default: true |
| image_url | string | |
| requires_lab_work | boolean | Default: false |

**NOTE:** The Products page has a **hardcoded product catalog** of 22 products defined inline in the React component. The `Product` entity exists in the database but the frontend primarily uses the hardcoded array. This is a gap.

### 3.9 AutoRxPlan
6-month recurring prescription plan with monthly follow-ups.
**Relationships:** `patient_email` → User, `prescription_id` → Prescription

| Field | Type | Required |
|-------|------|----------|
| patient_email | string | ✅ |
| patient_name | string | |
| prescription_id | string | |
| medication_name | string | ✅ |
| dosage | string | |
| beluga_visit_id | string | |
| beluga_med_id | string | |
| pharmacy_id | string | |
| stripe_subscription_id | string | |
| stripe_customer_id | string | |
| plan_start_date | date | ✅ |
| plan_end_date | date | |
| total_months | integer | Default: 6 |
| current_month | integer | Default: 1 |
| status | enum | | `active`, `paused`, `completed`, `cancelled`, `failed` |
| next_followup_due | date | |
| followup_reminder_sent | boolean | Default: false |
| followup_reminder_sent_at | datetime | |
| cycles | object[] | | Monthly cycle history (month, due_date, submitted_at, prescription_renewed, etc.) |
| pause_reason | string | |
| cancel_reason | string | |
| notes | string | |

### 3.10 ConsultationBooking
**Relationships:** `patient_email` → User, `provider_id` → Provider, `appointment_id` → Appointment

| Field | Type | Required |
|-------|------|----------|
| patient_email | string | ✅ |
| provider_id | string | |
| consultation_type | enum | ✅ | `video`, `phone`, `chat`, `in_person` |
| preferred_date | date | |
| preferred_time | string | |
| reason | string | ✅ |
| payment_status | enum | | `pending`, `paid`, `failed`, `refunded` |
| payment_amount | number | |
| stripe_payment_intent | string | |
| booking_status | enum | | `pending`, `confirmed`, `completed`, `cancelled` |
| appointment_id | string | |
| communication_platform | enum | | `twilio_video`, `twilio_voice`, `chat`, `in_person` |
| session_url | string | |
| participant_state | string | | Patient's state for compliance |
| provider_state | string | | |
| compliance_verified | boolean | Default: false |
| compliance_notes | string | |
| recording_consent | boolean | Default: false |
| recording_url | string | |

### 3.11 ConsultationPayment
**Relationships:** `booking_id` → ConsultationBooking

| Field | Type | Required |
|-------|------|----------|
| booking_id | string | |
| patient_email | string | ✅ |
| provider_id | string | |
| provider_name | string | |
| consultation_type | string | |
| amount | number | ✅ |
| currency | string | Default: usd |
| status | enum | | `pending`, `paid`, `failed`, `refunded`, `waived` |
| payment_timing | enum | | `before`, `after` |
| stripe_session_id | string | |
| stripe_payment_intent | string | |
| invoice_number | string | |
| paid_at | datetime | |
| appointment_date | datetime | |
| notes | string | |

### 3.12 ProviderRate
Per-provider consultation pricing.

| Field | Type | Required |
|-------|------|----------|
| provider_id | string | ✅ |
| provider_name | string | ✅ |
| video_rate | number | Default: $99 |
| phone_rate | number | Default: $79 |
| chat_rate | number | Default: $49 |
| in_person_rate | number | Default: $149 |
| payment_timing | enum | | `before`, `after`, `either` |
| is_active | boolean | Default: true |

### 3.13 ProviderSchedule
**Relationships:** `provider_id` → Provider

| Field | Type | Required |
|-------|------|----------|
| provider_id | string | ✅ |
| day_of_week | integer | ✅ | 0=Sunday, 6=Saturday |
| start_time | string | ✅ | HH:MM |
| end_time | string | ✅ | HH:MM |
| is_available | boolean | Default: true |
| slot_duration_minutes | integer | Default: 30 |

### 3.14 BlockedTime
**Relationships:** `provider_id` → Provider

| Field | Type | Required |
|-------|------|----------|
| provider_id | string | ✅ |
| start_datetime | datetime | ✅ |
| end_datetime | datetime | ✅ |
| reason | string | |
| is_recurring | boolean | Default: false |

### 3.15 RecurringAppointment
**Relationships:** `provider_id` → Provider, `patient_email` → User

| Field | Type | Required |
|-------|------|----------|
| provider_id | string | ✅ |
| patient_email | string | ✅ |
| appointment_type | enum | | Same as Appointment.type |
| frequency | enum | ✅ | `weekly`, `biweekly`, `monthly` |
| day_of_week | integer | |
| preferred_time | string | |
| start_date | date | ✅ |
| end_date | date | |
| is_active | boolean | Default: true |
| notes | string | |

### 3.16 Partner

| Field | Type | Required |
|-------|------|----------|
| business_name | string | ✅ |
| contact_name | string | ✅ |
| email | string | ✅ |
| phone | string | |
| business_type | enum | | `Gym`, `Spa`, `Wellness Center`, `Clinic`, `Fitness Studio`, `Chiropractic`, `Nutrition Practice`, `Other` |
| partner_code | string | ✅ | Unique referral code |
| subscription_status | enum | | `trial`, `active`, `cancelled`, `past_due` |
| branding_logo_url | string | |
| branding_primary_color | string | Default: #4A6741 |
| branding_secondary_color | string | Default: #6B8F5E |
| enabled_products | string[] | |
| pricing_markup_percentage | number | Default: 30 |
| total_referrals | integer | Default: 0 |
| total_earnings | number | Default: 0 |
| monthly_fee | number | Default: $299 |
| status | enum | | `pending`, `active`, `suspended`, `cancelled` |

### 3.17 PartnerReferral
**Relationships:** `partner_id` → Partner

| Field | Type | Required |
|-------|------|----------|
| partner_id | string | ✅ |
| customer_email | string | ✅ |
| product_id | string | ✅ |
| order_value | number | ✅ |
| partner_earnings | number | |
| status | enum | | `pending`, `qualified`, `paid`, `cancelled` |
| qualified_date | datetime | |
| paid_date | datetime | |

### 3.18 CreatorApplication

| Field | Type | Required |
|-------|------|----------|
| full_name | string | ✅ |
| email | string | ✅ |
| phone | string | |
| platform | enum | ✅ | `Instagram`, `TikTok`, `YouTube`, `Blog`, `Podcast`, `Other` |
| platform_handle | string | |
| followers_count | string | ✅ |
| audience_niche | string | |
| why_partner | string | |
| status | enum | | `pending`, `approved`, `rejected` |
| zapier_status | enum | | `success`, `failed`, `pending` |
| zapier_error | string | |
| zapier_sent_at | datetime | |

### 3.19 CreatorMetrics
**Relationships:** `creator_email` → User

| Field | Type | Required |
|-------|------|----------|
| creator_email | string | ✅ |
| referral_code | string | ✅ |
| total_clicks | integer | Default: 0 |
| total_conversions | integer | Default: 0 |
| total_revenue_generated | number | Default: 0 |
| total_commission_earned | number | Default: 0 |
| current_tier | enum | | `bronze`, `silver`, `gold`, `platinum` |
| monthly_clicks | integer | Default: 0 |
| monthly_conversions | integer | Default: 0 |
| monthly_revenue | number | Default: 0 |
| monthly_commission | number | Default: 0 |
| top_products | object[] | |

### 3.20-3.28 Remaining Entities

**CustomerIntake** — Full name, email, phone, DOB, address, primary interest, insurance, referral source, status pipeline
**PatientIntake** — Email, age, weight, height, goal weight, medical conditions, medications, allergies, previous treatments, lifestyle, answers_json (full questionnaire as JSON blob)
**ProviderIntake** — Full name, email, phone, title (MD/DO/NP/PA/etc.), specialty, license number, states licensed, years experience, practice type, bio, status pipeline
**PharmacyIntake** — Pharmacy name, contact name, license, NPI, address, type, services, shipping capabilities, status pipeline
**BusinessInquiry** — Company, contact, email, industry, interest type (White Label/Wholesale/Partnership/General), status pipeline
**ContactRequest** — Name, email, subject, message, status pipeline
**BrowsingHistory** — user_email, product_id, product_name, product_category, view_count
**ProviderContract** — Provider name, license, states, specialties, contract type (per_consultation/monthly_retainer/revenue_share), rates, dates, status, totals
**PharmacyContract** — Pharmacy name, license, NPI, states serviced, type, contract type, products available, discount, fulfillment days, shipping, status, totals
**ComplianceRecord** — Partner ID/type, compliance status, verification method (LegitScript/manual/license board/document review), license details, documents required, compliance checks, risk score (0-100), issues tracker
**ComplianceMessage** — Threaded messaging for compliance workflows between admin and partners
**PartnershipOutreach** — CRM for tracking potential partnerships (pharmacy, telehealth, marketing, etc.) with status pipeline
**ProviderConsultation** — Internal credentialing consultations with providers during onboarding
**Analytics** — Event tracking (page_view, button_click, form_submit, signup, booking) with session/referrer data
**ChatLog** — AI chatbot conversation logs (session_id, page, user message, AI response)
**DriveFolder** — Google Drive folder structure mapping
**BelugaVisitType** — Visit type configuration mapping products to Beluga Health visit types, with intake questions and contraindications
**BelugaVisitLog** — Audit log for Beluga Health API submissions

---

## 4. ALL FEATURES & USER FLOWS

### 4.1 Patient Journey: Signup → Consultation → Prescription → Medication

```
1. Patient visits Home page
2. Browses Products or Programs
3. Clicks "Get Started" → PatientOnboarding page
   a. Step 1: Welcome screen
   b. Step 2: Profile (name, DOB, phone, email, address)
   c. Step 3: Document upload (Government ID required, insurance card optional)
   d. Step 4: Tutorial on how MedRevolve works
   e. Step 5: Completion → triggers notifyOnboardingComplete backend function
4. OR fills out CustomerIntake form directly
5. Navigates to Consultations page → selects consultation type
6. BookAppointment page:
   a. Select provider (filtered by specialty/availability)
   b. Choose date/time slot
   c. Select consultation type (video/phone/chat)
   d. Enter reason for visit
   e. Pay consultation fee via Stripe
7. Receives booking confirmation (email + in-app)
8. At appointment time → joins from PatientPortal → VideoCall or WaitingRoom
9. Provider conducts consultation → writes notes → provides prescription
10. Prescription created → routed to pharmacy
11. Patient views prescription in PatientPortal → Prescriptions tab
12. Medication shipped → tracking number updated on Order
13. For ongoing treatment: Provider creates AutoRxPlan (6-month cycle)
    a. Monthly follow-up reminders sent
    b. Patient completes AutoRxFollowup form each month
    c. Prescription auto-renewed if follow-up is satisfactory
```

### 4.2 Provider Journey: Application → Credentialing → Practice

```
1. Provider visits ProviderIntake page
2. Completes 4-step form (Personal → Credentials → Experience → Availability)
3. Submission triggers:
   a. workflowNotifications → admin email
   b. syncToHubspot → CRM sync
   c. driveUploadIntakeForm → document storage
4. Admin reviews in AdminDashboard → Providers tab
5. Admin schedules credentialing consultation (ProviderConsultation entity)
6. Provider redirected to QualiphyConsult for medical qualification exam
7. Live credentialing call via video
8. Admin approves/rejects → ProviderContract created if approved
9. Provider accesses ProviderDashboard → sees onboarding journey progress
10. Provider schedule configured via ProviderScheduleManager component
11. Provider starts seeing patients via telehealth
```

### 4.3 E-Commerce Flow: Browse → Cart → Checkout → Order

```
1. Products page → select category → browse products
2. ProductDetail page → view details → "Add to Cart"
3. Cart page → adjust quantities → proceed to checkout
4. Checkout page → enter shipping info → pay via Stripe
5. createCheckout backend function → creates Stripe session
6. Stripe webhook (stripeWebhook function) → updates Order status
7. OrderSuccess page shown
8. Order entity updated: pending → paid → processing → shipped → delivered
```

### 4.4 Partner White-Label Flow

```
1. Business visits PartnerProgram page → clicks "Apply"
2. PartnerSignup form → submits business details
3. Partner entity created with unique partner_code
4. Admin reviews → approves → sets up branding/products
5. Partner accesses PartnerPortal:
   a. Customize branding (logo, colors)
   b. Enable specific products
   c. Set pricing markup
   d. View referral analytics
6. Partner shares branded link with partner_code
7. Customer uses link → PartnerReferral tracked
8. processPartnerReferral backend function → calculates earnings
```

### 4.5 Creator/Influencer Flow

```
1. Creator visits ForCreators page → clicks "Apply"
2. CreatorApplication form → submits social media details
3. Admin reviews → approves
4. CreatorMetrics entity created with unique referral_code
5. Creator logs into ForCreators page → sees dashboard:
   a. Referral link
   b. Click/conversion/revenue metrics
   c. Commission tier (Bronze→Platinum based on conversions)
   d. Top performing products
6. processCreatorCommission backend function handles payouts
```

### 4.6 Compliance Workflow

```
1. For each partner/provider/pharmacy → ComplianceRecord created
2. Admin assigns required documents (license, insurance, certifications)
3. Partner uploads documents via PartnerCompliance page
4. Admin reviews in ComplianceDashboard:
   a. Runs compliance checks (manual or LegitScript)
   b. Sets risk score (0-100)
   c. Creates/resolves issues
5. ComplianceMessage entity enables threaded communication
6. Status pipeline: pending → in_review → compliant / non_compliant
```

### 4.7 AutoRx Recurring Prescription Flow

```
1. Provider creates AutoRxPlan after initial consultation
2. Plan configured: medication, dosage, 6 months, linked to Beluga/Stripe
3. Each month:
   a. sendAutoRxFollowupReminders scheduled function checks due dates
   b. Patient receives email reminder
   c. Patient completes AutoRxFollowup form (side effects, weight, satisfaction)
   d. submitAutoRxFollowup function processes responses
   e. If no adverse events → auto-renew prescription via Beluga API
   f. triggerAutoRxBilling → charges via Stripe subscription
4. If adverse event flagged → plan paused → provider review required
5. After 6 months → plan completed or renewed
```

---

## 5. API ENDPOINTS / BACKEND FUNCTIONS

All backend functions are Deno serverless functions. Currently **inaccessible** due to subscription downgrade (Builder+ required).

### Intake Submission Functions

| Function | Method | Input | Output | Description |
|----------|--------|-------|--------|-------------|
| `submitCustomerIntake` | POST | Customer form data | Success/error | Creates CustomerIntake entity, sends confirmation email (Gmail), SMS (Twilio), syncs to HubSpot, uploads to Google Drive |
| `submitProviderIntake` | POST | Provider form data | Success/error | Creates ProviderIntake, sends emails, SMS, Drive upload, HubSpot sync |
| `submitPharmacyIntake` | POST | Pharmacy form data | Success/error | Creates PharmacyIntake, sends emails, SMS, Drive upload, HubSpot sync |
| `submitCreatorApplication` | POST | Creator form data | Success/error | Creates CreatorApplication, notifications |
| `submitBusinessInquiry` | POST | Business form data | Success/error | Creates BusinessInquiry, emails, HubSpot sync, Drive upload |
| `submitContactRequest` | POST | Contact form data | Success/error | Creates ContactRequest, sends confirmation email, SMS |
| `notifyOnboardingComplete` | POST | {email, full_name, phone, state} | Success/error | Sends welcome email to patient + admin notification via Zoho Mail |
| `submitQuestionnaire` | POST | Questionnaire answers | Success/error | Creates PatientIntake with medical questionnaire data |

### Appointment & Consultation Functions

| Function | Input | Description |
|----------|-------|-------------|
| `bookConsultation` | Booking details | Creates Appointment + ConsultationBooking, sends notifications |
| `getProviderAvailability` | {provider_id, date} | Returns available time slots based on ProviderSchedule and BlockedTime |
| `sendAppointmentReminder` | {appointment_id} | Sends SMS/email reminder before appointment |
| `notifyAppointmentBooked` | Appointment data | Sends booking confirmation emails |
| `completeConsultation` | {appointment_id, notes, diagnosis, prescription} | Creates ConsultationSummary, updates Appointment status, creates Prescription if needed |
| `assignToProvider` | {booking_id, provider_id} | Assigns a consultation booking to a specific provider |
| `scheduleProviderConsultation` | Provider data | Creates ProviderConsultation for internal credentialing |

### Telehealth / Video Functions

| Function | Input | Description |
|----------|-------|-------------|
| `initializeTwilioVideoSession` | {appointment_id} | Creates Twilio video room, returns session URL |
| `initializeCommunicationSession` | {booking_id, type} | Creates Twilio video or voice session |

### Payment Functions

| Function | Input | Description |
|----------|-------|-------------|
| `createCheckout` | {items, customer_email, shipping} | Creates Stripe Checkout Session for product orders |
| `createConsultationCheckout` | {booking_id, amount, consultation_type} | Creates Stripe session for consultation payments |
| `processConsultationPayment` | {booking_id, payment_intent} | Updates ConsultationPayment status |
| `stripeWebhook` | Stripe webhook payload | Handles checkout.session.completed, invoice.paid, subscription events |
| `getStripePublishableKey` | None | Returns Stripe publishable key for frontend |
| `generateInvoice` | {payment_id} | Generates PDF invoice |
| `triggerAutoRxBilling` | {plan_id, month} | Charges Stripe subscription for AutoRx monthly cycle |

### AutoRx Functions

| Function | Input | Description |
|----------|-------|-------------|
| `submitAutoRxFollowup` | {plan_id, responses} | Processes monthly follow-up, checks for adverse events, renews prescription |
| `sendAutoRxFollowupReminders` | (scheduled) | Checks all active plans, sends reminders for due follow-ups |

### Beluga Health Integration

| Function | Input | Description |
|----------|-------|-------------|
| `belugaSubmitVisit` | {patient_data, visit_type, answers} | Submits visit to Beluga Health API |
| `belugaGetPatient` | {patient_email} | Retrieves patient from Beluga system |
| `belugaSyncStatus` | {visit_id} | Syncs visit status from Beluga |

### CRM & Integration Functions

| Function | Input | Description |
|----------|-------|-------------|
| `syncToHubspot` | {source, data} | Syncs contact data to HubSpot CRM (supports: customer_intake, business_inquiry, creator_application, provider_intake, pharmacy_intake, contact_request, patient_onboarding) |
| `syncToZohoCRM` | Contact data | Syncs to Zoho CRM |
| `syncCreatorToZoho` | Creator data | Syncs creator to Zoho |
| `syncBusinessToZoho` | Business data | Syncs business inquiry to Zoho |
| `syncGoogleCalendar` | Appointment data | Syncs appointments to Google Calendar |
| `zohoAuth` / `zohoGetRefreshToken` / `getZohoClientId` | Auth tokens | Zoho OAuth flow helpers |

### Communication Functions

| Function | Input | Description |
|----------|-------|-------------|
| `sendSMS` | {to, message} | Sends SMS via Twilio |
| `testAllSMS` | None | Tests all SMS templates |
| `checkTwilioStatus` | None | Verifies Twilio service status |
| `sendGmailNotification` | {to, subject, body} | Sends email via Gmail API |
| `testEmail` | None | Tests email delivery |
| `sendActivityNotification` | {type, data} | General activity notification dispatcher |
| `workflowNotifications` | Entity event data | Unified notification handler triggered by entity automations |

### Analytics & AI Functions

| Function | Input | Description |
|----------|-------|-------------|
| `trackEvent` | {eventType, pageName, action, metadata} | Records analytics event |
| `trackProductView` | {product_id, user_email} | Records BrowsingHistory |
| `getAnalytics` | Date range | Returns aggregated analytics |
| `getAIRecommendations` | {user_email, context} | AI-powered product recommendations |
| `getAIProductMatch` | {symptoms, preferences} | AI product matching |
| `getPersonalizedRecommendations` | {user_email} | Personalized product suggestions based on browsing history |
| `testChat` | {message} | Tests AI chat functionality |

### Partnership & Compliance Functions

| Function | Input | Description |
|----------|-------|-------------|
| `analyzePartnerWebsite` | {url} | AI scrapes and analyzes potential partner websites |
| `generatePartnershipDoc` | {partner_id, doc_type} | Generates partnership agreements |
| `sendPartnershipEmail` | {partner_id, email_content} | Sends outreach emails to potential partners |
| `generateComplianceDoc` | {record_id, doc_type} | Generates compliance documents |
| `verifyCompliance` | {record_id} | Runs compliance verification checks |
| `verifyPartnerCompliance` | {partner_id} | Verifies partner compliance status |
| `updateComplianceCheck` | {record_id, check_data} | Updates individual compliance check |
| `uploadComplianceDocument` | {record_id, file} | Uploads compliance document |
| `processPartnerReferral` | {partner_code, order_data} | Processes and attributes partner referrals |
| `processCreatorCommission` | {creator_email, order_data} | Calculates and records creator commissions |
| `sendProviderOutreach` | {provider_data} | Sends recruitment outreach to potential providers |

### Product & Content Functions

| Function | Input | Description |
|----------|-------|-------------|
| `generateProductContent` | {product_id} | AI-generates product descriptions and marketing copy |
| `generateProductVisual` | {productName, form, category} | AI-generates product imagery |
| `generatePharmaceuticalImage` | {product_data} | Generates pharmaceutical-style product visuals |

### Google Drive Functions

| Function | Input | Description |
|----------|-------|-------------|
| `setupDriveFolders` | None | Creates MedRevolve folder structure in Google Drive |
| `driveUploadIntakeForm` | {form_data, folder_path} | Uploads intake form data as document to Drive |

### Qualiphy Functions

| Function | Input | Description |
|----------|-------|-------------|
| `qualiphySendInvite` | {provider_email} | Sends Qualiphy.me exam invitation |
| `qualiphyGetExams` | {provider_email} | Gets exam results |
| `qualiphyWebhook` | Webhook payload | Handles Qualiphy exam completion events |

### Misc Functions

| Function | Input | Description |
|----------|-------|-------------|
| `createOrder` | Order data | Creates Order entity |
| `logError` | {error, context} | Logs errors for debugging |
| `mdIntegrations` | Various | Medical director integration utilities |
| `testZapierWebhook` | Test data | Tests Zapier webhook connectivity |

---

## 6. AI / AUTOMATION FEATURES

### 6.1 Rev Bot — AI Chat Assistant

**Location:** Floating on every page via `components/chat/AIAssistant`
**Branding:** "Rev Bot" with custom hexagon + ECG heartbeat SVG logo
**Trigger:** Floating Action Button (PersonaFAB) in bottom-right corner

**Architecture:**
- Uses `Base44.integrations.Core.InvokeLLM` (OpenAI GPT-4o-mini default)
- **Context-aware persona system** defined in `chatConfig.js`:
  - Different personas based on current page (Patient, Creator, Provider, Business, General)
  - Each persona has unique greeting, tone, visual branding (gradient colors), and system prompt
  - Persona automatically switches when user navigates between pages
- Conversation history maintained (last 16 messages sent as context)
- All conversations logged to `ChatLog` entity

**Features:**
- Text chat with markdown rendering
- **Voice Call mode** using Web Speech API (SpeechRecognition + SpeechSynthesis)
  - Continuous listening loop
  - Female voice preference (Samantha, Karen, Moira, Zira)
  - Pause/resume microphone
  - Full voice transcript display
- FAQ chips (context-specific common questions per audience)
- Chat reset
- Minimizable window

**Persona Keys & Audiences:**
- `customer` → Patient-facing pages (Products, Consultations, PatientPortal)
- `creator` → Creator pages (ForCreators, CreatorApplication)
- `provider` → Provider pages (ProviderIntake, ProviderDashboard)
- `business` → Business pages (ForBusiness, BusinessInquiry)
- `partner` → Partner pages (PartnerProgram, PartnerPortal)
- `general` → All other pages

### 6.2 AI Health Coach
**Location:** PatientPortal (top of dashboard)
**Component:** `components/coach/AIHealthCoach`
**Purpose:** Provides personalized health insights based on patient's prescriptions, appointments, and consultation history

### 6.3 AI Clinical Assistant
**Component:** `components/provider/AIClinicalAssistant`
**Purpose:** Assists providers during consultations with:
- AI-generated clinical summaries
- Suggested diagnosis codes (ICD-10)
- Follow-up instruction drafting
- Treatment plan suggestions

### 6.4 AI Product Recommendations
**Functions:** `getAIRecommendations`, `getAIProductMatch`, `getPersonalizedRecommendations`
**Component:** `components/recommendations/PersonalizedRecommendations`
**Purpose:** Analyzes browsing history and patient profile to suggest relevant products

### 6.5 AI Product Image Generation
**Function:** `generateProductVisual`
**Used by:** ProductCard component on Products page
**Behavior:** Generates pharmaceutical-style product imagery on-the-fly, caches in sessionStorage

### 6.6 Partnership Outreach Agent
**File:** `agents/partnership_outreach.json`
**Type:** Base44 AI Agent with entity tools
**Capabilities:**
- Research potential partners
- Generate personalized outreach emails
- Create partnership agreements
- Track outreach status
- Suggest API integration strategies
**Entity Access:** Partner (CRU), PharmacyContract (CRU), ProviderContract (CRU)

### 6.7 Entity Automations (Event-Triggered)

| Automation | Trigger | Function | Status |
|-----------|---------|----------|--------|
| Sync Customer Intake to HubSpot | CustomerIntake.create | syncToHubspot | ⚠️ Failing (4/4 failed) |
| Sync Business Inquiry to HubSpot | BusinessInquiry.create | syncToHubspot | ⚠️ Failing (3/3 failed) |
| Sync Provider Intake to HubSpot | ProviderIntake.create | syncToHubspot | ⚠️ Failing (2/2 failed) |
| Sync Creator Application to HubSpot | CreatorApplication.create | syncToHubspot | Never fired |
| Notify: Appointments | Appointment.create/update | workflowNotifications | Never fired |
| Notify: Prescriptions | Prescription.create/update | workflowNotifications | Never fired |
| Notify: Customer Intake | CustomerIntake.create | workflowNotifications | ✅ Working (4/4 success) |
| Notify: Provider Applications | ProviderIntake.create/update | workflowNotifications | ✅ Working (2/2 success) |
| Notify: Pharmacy Applications | PharmacyIntake.create | workflowNotifications | Never fired |
| Notify: Business Inquiries | BusinessInquiry.create | workflowNotifications | ✅ Working (3/3 success) |
| Notify: Creator Applications | CreatorApplication.create | workflowNotifications | Never fired |
| Notify: Contact Requests | ContactRequest.create | workflowNotifications | ✅ Working (2/2 success) |
| Notify: Consultation Bookings | ConsultationBooking.create | workflowNotifications | ✅ Working (9/9 success) |

**Scheduled automations:** sendAutoRxFollowupReminders (configured but currently inaccessible due to plan)

---

## 7. AUTHENTICATION & USER ROLES

### Authentication
- Handled by Base44 platform (OAuth/email-based)
- Login/signup is built-in; no custom login page
- `base44.auth.me()` returns current user
- `base44.auth.isAuthenticated()` checks auth state
- `base44.auth.redirectToLogin(nextUrl)` redirects to login
- `base44.auth.logout(redirectUrl)` logs out

### Role-Based Access

| Role | Can See | Can Do |
|------|---------|--------|
| **user** (patient) | Home, Products, Consultations, PatientPortal, PatientOnboarding, Cart, Checkout, Messages, BookAppointment, MyAppointments, AutoRxFollowup, AccountSettings | Browse products, book consultations, view prescriptions, send messages, complete follow-ups |
| **provider** | ProviderDashboard, ProviderOnboarding, ProviderProfile, QualiphyConsult | View onboarding progress, manage schedule (when approved), conduct consultations, write prescriptions |
| **pharmacy** | (No dedicated portal in current build) | — |
| **partner** | PartnerPortal, PartnerCompliance | View/edit branding, track referrals, manage compliance documents |
| **creator** | ForCreators (dashboard mode when logged in) | View metrics, copy referral link, track commissions |
| **admin** | All pages + AdminDashboard, ComplianceDashboard, PharmacyContracts, ProviderContracts, ProviderOutreach, PartnershipHub, PaymentsDashboard, EmailAudit, BelugaIntegration, VisitTypeSelector, IntegrationsDashboard, MDIntegrationsDashboard | Full CRUD on all entities, approve/reject applications, manage contracts, view analytics |

### Access Control Implementation
- `RequireAuth` component wraps authenticated pages (checks `base44.auth.me()`)
- `RequireAuth` accepts `requiredRole` prop (e.g., `requiredRole="admin"`)
- Admin nav items conditionally rendered: `{user?.role === 'admin' && ...}`
- Layout header shows Admin dropdown only for admin users

---

## 8. THIRD-PARTY INTEGRATIONS

### Authorized OAuth Connectors

| Service | Scopes | Usage |
|---------|--------|-------|
| **HubSpot** | contacts.read, contacts.write, deals.read, deals.write | CRM sync for all intake forms (customers, providers, pharmacies, creators, businesses, contacts) |
| **Gmail** | gmail.send, gmail.readonly | Transactional email delivery (confirmations, notifications, admin alerts) |
| **Google Drive** | drive.file | Document storage (intake forms, compliance documents, partnership agreements) |
| **Google Calendar** | calendar, calendar.events | Appointment sync (syncGoogleCalendar function) |

### Payment Processing
- **Stripe** — Checkout sessions for product orders and consultation payments, subscription billing for AutoRx plans, webhook handling

### Communication
- **Twilio** — Video (telehealth video calls), Voice (phone consultations), SMS (appointment reminders, status notifications)

### External APIs
- **Beluga Health** — External telehealth visit routing API. Submits patient visits, retrieves patient data, syncs visit status. Used for visit types that are routed through Beluga's provider network
- **Qualiphy.me** — Provider credentialing exam platform. Sends exam invites, retrieves results via webhook
- **Zoho Mail** — Used in `notifyOnboardingComplete` for email delivery (OAuth2 refresh token flow)
- **Zoho CRM** — Alternative CRM sync (syncToZohoCRM, syncCreatorToZoho, syncBusinessToZoho)
- **Zapier** — Webhook integration for creator applications (testZapierWebhook)
- **LegitScript** — Pharmacy/provider compliance verification service (referenced in ComplianceRecord)

### Analytics
- **Google Analytics** (GA4: G-BZTEFSTDPL) — Injected via Layout component
- **Cookiebot** — Cookie consent management (ID: f872245e-106f-4258-bb1a-084567404e79)
- **Base44 Analytics** — Custom event tracking via `base44.analytics.track()`

### AI
- **Base44 Core.InvokeLLM** — GPT-4o-mini (default) for chat, clinical summaries, product recommendations, content generation
- **Base44 Core.GenerateImage** — AI image generation for product visuals

---

## 9. BUSINESS LOGIC & RULES

### Prescription Rules
- All products are marked `prescription_required: true`
- Products are marked `Rx` with badge overlay
- Prescription entity tracks full lifecycle: `draft → active → sent_to_pharmacy → dispensed → completed`
- Refill tracking: `refills` (allowed) vs `refills_used`
- `is_controlled_substance` flag for additional compliance

### Geographic Compliance
- ConsultationBooking tracks `participant_state` and `provider_state`
- Provider `states_licensed` must include patient's state
- `compliance_verified` boolean gate on ConsultationBooking

### AutoRx Plan Rules
- 6-month cycle by default
- Monthly follow-up required before prescription renewal
- Adverse event flagging pauses the plan (requires provider review)
- Stripe subscription billing tied to each cycle
- Plan statuses: `active → paused → completed/cancelled/failed`

### Partner Pricing
- `minimum_price` on Product entity = floor price
- Partners set `pricing_markup_percentage` (default 30%)
- Partner earnings calculated on referral order value

### Creator Commission Tiers
- Bronze: 10% (default)
- Silver: 12% (>50 conversions)
- Gold: 15% (>200 conversions)
- Platinum: 18% (>500 conversions)

### Compliance Scoring
- Risk score: 0 (lowest) to 100 (highest risk)
- Required documents per partner type
- Status pipeline: `pending → in_review → compliant / non_compliant / expired / suspended`
- Issue severity levels: `low`, `medium`, `high`, `critical`

### Consultation Pricing
- Default rates: Video $99, Phone $79, Chat $49, In-Person $149
- Per-provider customization via ProviderRate entity
- Payment timing: `before` (default) or `after` consultation

### Product Catalog
- 22 products across 5 active categories + 2 coming soon
- Categories: Weight Loss (5 products), Longevity (4), Hormones (4), Men's Health (4), Women's Health (4)
- Coming Soon: Hair & Skin, Sexual Health
- All prices are "from $X/mo" (includes consult + Rx + shipping)
- Price range: $49 (Finasteride + Minoxidil) to $449 (Testosterone + Semaglutide Stack, Tirzepatide + B12)

---

## 10. CURRENT STATE & KNOWN GAPS

### ✅ Fully Built & Working

| Feature | Status |
|---------|--------|
| Full marketing website (Home, Products, Programs, Consultations, HowItWorks, Contact, Privacy, Terms) | ✅ Complete |
| Product catalog with 22 products, filtering, sorting | ✅ Complete |
| All intake forms (Customer, Provider, Pharmacy, Creator, Business, Contact) | ✅ Complete |
| Patient onboarding wizard (5 steps with validation) | ✅ Complete |
| Patient Portal with tabs (Appointments, Notes, Prescriptions, AutoRx, Messages) | ✅ Complete |
| Admin Dashboard with all entity management tabs | ✅ Complete |
| Rev Bot AI Assistant (text + voice) on every page | ✅ Complete |
| Partner Program and Creator Program landing pages | ✅ Complete |
| Layout with responsive header, mega menu, mobile nav, footer | ✅ Complete |
| Google Analytics and Cookiebot integration | ✅ Complete |
| Role-based navigation and access control | ✅ Complete |
| Entity automation notifications (workflowNotifications) | ✅ Partially working |

### ⚠️ Built but Currently Non-Functional (Subscription Downgrade)

All backend functions exist but are **inaccessible** because the app's subscription was downgraded below Builder+ tier. This affects:

| Feature | Impact |
|---------|--------|
| All 65+ backend functions | Cannot execute |
| Stripe payment processing | Checkout sessions won't create |
| Twilio video/voice/SMS | Telehealth consultations non-functional |
| HubSpot CRM sync | All entity automations failing (0% success on HubSpot syncs) |
| Gmail notifications | No transactional emails |
| Google Drive uploads | No document storage |
| Beluga Health integration | No external visit routing |
| Qualiphy exams | No credentialing exams |
| AutoRx automation | No follow-up reminders or billing |
| AI product image generation | Product cards fall back to stock photos |

### 🔴 Known Gaps & Incomplete Features

| Gap | Description |
|-----|-------------|
| **Product catalog is hardcoded** | The 22 products are defined as a static array in `pages/Products.jsx`, not fetched from the Product entity. The Product entity schema exists but isn't the source of truth for the storefront |
| **No pharmacy-facing portal** | Pharmacies have intake forms and contract management but no dedicated pharmacy dashboard/portal for viewing prescriptions to fill |
| **Provider dashboard is only onboarding** | ProviderDashboard shows the onboarding journey but lacks a full clinical workspace (patient list, active consultations, schedule view, prescription writing). Some components exist (AppointmentCalendar, EPrescribeModal, etc.) but aren't wired into a complete provider experience |
| **Cart/Checkout flow incomplete** | Cart and Checkout pages exist but the full flow depends on backend functions (createCheckout, stripeWebhook) which are inaccessible |
| **Video call page exists but untested** | VideoCall and WaitingRoom pages exist, Twilio integration functions exist, but the end-to-end telehealth experience hasn't been validated |
| **No order management for admin** | Admin can view intake applications but there's no order management/fulfillment dashboard |
| **PartnerPortal partially built** | Portal exists but white-label product customization and storefront branding aren't fully implemented |
| **Email delivery fragmented** | Multiple email providers (Gmail API, Zoho Mail, Base44 SendEmail) used across different functions — no unified email service |
| **Zoho CRM integration unclear** | Both HubSpot and Zoho CRM integrations exist; unclear which is primary. Zoho functions may be legacy |
| **Analytics component exists but limited** | AnalyticsDashboard component exists but relies on backend functions for data aggregation |
| **AutoRx Beluga integration incomplete** | AutoRxPlan references Beluga visit IDs but the full renewal → Beluga submission → pharmacy fulfillment loop isn't fully validated |
| **Hair & Skin / Sexual Health categories** | Listed as "Coming Soon" with no products |
| **No patient-facing order history** | PatientPortal shows prescriptions but not product orders |
| **No real-time messaging** | Messages entity exists but there's no WebSocket/real-time chat — messages are fetched on page load |
| **Mobile app readiness** | Responsive design is in place but no PWA manifest or native-specific optimizations |

### 📁 Component Inventory (Not Documented Above)

Key reusable components that exist:
- `components/auth/RequireAuth` — Auth gate wrapper
- `components/auth/RequireAuthGate` — Alternative auth gate
- `components/video/VideoCallInitiator` — Initiates Twilio video
- `components/video/DocumentSharePanel` — Share documents during video call
- `components/provider/EPrescribeModal` — E-prescribing modal
- `components/provider/AppointmentCalendar` — Calendar view
- `components/provider/AppointmentDetailPanel` — Appointment details
- `components/provider/PatientFeedback` — Feedback collection
- `components/provider/PrescriptionHistory` — Rx history view
- `components/provider/ProviderScheduleManager` — Schedule configuration
- `components/provider/ProviderStatsCards` — Provider metrics
- `components/provider/ScheduleAppointmentModal` — Scheduling modal
- `components/provider/ProviderNotifications` — Notification center
- `components/autorx/AutoRxPlanCard` — AutoRx plan card display
- `components/coach/AIHealthCoach` — AI health insights
- `components/product/RxProductVisual` — SVG product visuals
- `components/product/RotatingProductCard` — 3D product card
- `components/product/MRPharmaceuticalVisuals` — Pharmaceutical imagery
- `components/product/AIGeneratedFAQ` — AI-generated product FAQs
- `components/recommendations/PersonalizedRecommendations` — AI recommendations
- `components/compliance/*` — ComplianceOverview, ComplianceDocuments, ComplianceMessaging
- `components/creator/*` — AnalyticsDashboard, CommissionTiers
- `components/payments/ProviderRateSettings` — Rate configuration
- `components/navigation/SmartNavigation` — Context-aware nav
- `components/home/*` — 15+ home page section components

---

## ARCHITECTURE NOTES FOR REBUILD

### Frontend Stack
- **React 18** (Vite bundler)
- **Tailwind CSS** with CSS custom properties for theming
- **shadcn/ui** component library (all components installed)
- **Framer Motion** for animations
- **TanStack React Query** for data fetching/caching
- **React Router v6** for routing
- **Recharts** for analytics charts
- **React Leaflet** for maps
- **jsPDF + html2canvas** for PDF generation
- **Three.js** for 3D product visuals

### Backend Stack (to rebuild)
- 65+ serverless functions (currently Deno on Base44)
- **Recommended rebuild:** Node.js/Express or FastAPI + PostgreSQL
- External API integrations: Stripe, Twilio, HubSpot, Gmail API, Google Drive API, Google Calendar API, Beluga Health API, Qualiphy API, Zoho CRM

### Database (to rebuild)
- 28 entity types → PostgreSQL tables
- All relationships are via string ID references (no enforced foreign keys in current system)
- Recommended: proper foreign keys, indexes on email fields, status fields

### Key Design Decisions
- Color palette: Forest green (#2D3A2D primary, #4A6741 accent), cream (#FDFBF7 background)
- Typography: System fonts, clean/minimal
- Brand identity: "MR" logo in gradient square, "MedRevolve" wordmark
- Mobile-first responsive design throughout