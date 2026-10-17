import React, { useEffect, useMemo, useState } from 'react';
import { BOOKING_URL } from '@/lib/contactConfig';
import { LAUNCH_CSS } from './launchStyles';
import { SOCIAL_GRAPHICS } from './socialGraphics';

// MedRevolve launch homepage, built from the Platform Walkthrough (Oct 2026).
// Every style is scoped under .mrx. Compliance rules baked in: no "LegitScript certified" claim,
// no partner names or logos without signed permission, example data always labeled.

const FONT_URL = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

const SWATCHES = [
  ['#4A6741', 'Moss'], ['#2F5D8A', 'Harbor blue'], ['#9B4F6B', 'Rosewood'], ['#A66B3C', 'Rust'], ['#1F2D27', 'Spine'],
];

const PROG = {
  weight: { label: 'Weight care', h: 'Weight care, guided by licensed providers.', s: 'Online visit, provider review and home delivery, all under one trusted name.', cards: [['Weight care', 'Provider-led plan'], ['Nutrition coaching', 'Weekly check-ins'], ['Lab panel', 'At-home kit']] },
  hormone: { label: 'Hormone health', h: 'Hormone health, on your schedule.', s: 'Assessment, provider consult and ongoing care from home.', cards: [['Hormone panel', 'Lab-backed'], ['Provider consult', 'Video or async'], ['Follow-up', 'Every 90 days']] },
  skin: { label: 'Skin & aesthetics', h: 'Skin care prescribed for you.', s: 'Photo-based intake, provider review and treatments shipped to your door.', cards: [['Acne care', 'Provider-reviewed'], ['Anti-aging', 'Personal plan'], ['Pigment care', 'Photo check-ins']] },
  wellness: { label: 'Wellness', h: 'Everyday wellness, guided by experts.', s: 'Personal plans, provider check-ins and refills that arrive on time.', cards: [['Energy & sleep', 'Personal plan'], ['Vitamin therapy', 'Provider-guided'], ['Check-ins', 'Monthly']] },
};

const DAYS = [
  ['Brand & discovery', 'Brand', ['Pick your brand name, logo, colors and domain', 'Choose your focus programs and target states'], ['Confirm eligibility for your programs and states', 'Set the compliance scope for your launch']],
  ['Storefront build', 'Site', ['Review the draft pages', 'Approve copy and imagery'], ['Build your site on your domain: homepage, program pages, intake, checkout and patient portal', 'Add terms and privacy pages']],
  ['Providers plugged in', 'Care', ['Choose visit types for each program', 'Review intake questions'], ['Connect the provider network', 'Configure visit types and intake questionnaires', 'Test the e-prescribing flow']],
  ['Pharmacy plugged in', 'Pharmacy', ['Set program pricing'], ['Test the 503A pharmacy integration end to end', 'Check prescription to fulfilment to shipping and tracking notifications']],
  ['Payments live', 'Payments', ['Send underwriting documents: business details, owner ID, bank account'], ['Get your merchant account approved and connected', 'Run test transactions, refunds, subscriptions and refills', 'Confirm the payout schedule']],
  ['Compliance check', 'Compliance', ['Approve any brand-facing wording changes'], ['HIPAA review and LegitScript readiness', 'State rules, claims and advertising review', 'Audit log check and fixes before launch']],
  ['Go live & announce', 'Launch', ['Send your announcement post, email and SMS', 'Share your program pages'], ['Switch on your CRM and contact center', 'Link first ads and posts to your demo and program pages', 'Hand you a launch-day checklist and a named support contact']],
];

const TABS = ['Homepage', 'Program page', 'Intake', 'Checkout', 'Owner dashboard'];
const TAB_PATHS = ['', 'programs', 'start-visit', 'checkout', 'dashboard'];
const NOTES = [
  ['Your brand and headline program up top', 'Trust strip: licensed providers, pharmacy, secure checkout', 'One clear "Start visit" button'],
  ['One page per treatment category', 'Who it is for and how it works', 'Pricing, eligibility and FAQs'],
  ['Online questionnaire', 'Provider review and secure messaging', 'Visit status the patient can see'],
  ['Payment and subscriptions or refills', 'Order tracking', 'A support contact on every order'],
  ['Orders, patients, revenue and payouts at a glance', 'Pricing and promotions you control', 'CRM view of every lead and patient', 'Compliance announcements in one inbox'],
];
const PINS = [
  [['92px', '16px'], ['268px', '16px'], ['226px', '60%']],
  [['92px', '16px'], ['150px', '60%'], ['260px', '16px']],
  [['96px', '16px'], ['250px', '55%'], ['292px', '16px']],
  [['140px', '16px'], ['196px', '60%'], ['232px', '16px']],
  [['118px', '16px'], ['222px', '60%'], ['256px', '16px']],
];

const JOURNEY = [
  ['Visitor', 'Lands on your program page', <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>],
  ['Intake', 'Online questionnaire', <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>],
  ['Provider review', "Licensed in the patient's state", <><path d="M6 3v6a6 6 0 0 0 12 0V3" /><circle cx="18" cy="17" r="3" /><path d="M12 15v2a4 4 0 0 0 4 4" /></>],
  ['Prescription', 'Only if clinically appropriate', <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M9 12l2 2 4-4" /></>],
  ['Pharmacy', 'Filled, checked, shipped', <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /></>],
  ['Follow-up & refill', 'Tracked in your CRM', <><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></>],
];

const LAYERS = [
  ['Provider network', 'Licensed providers, never hidden', "Intake review, consultations, prescribing within each state's rules, follow-up messaging.", 'States served, the credential standard for providers, and typical response time.'],
  ['Pharmacy', '503A pharmacy, end to end', 'Prescription receipt, fulfilment, quality checks, shipping, tracking and refills.', 'Pharmacy type, fulfilment steps, shipping areas and times, and how patients get updates.'],
  ['Partners', 'Labs and diagnostics when a program needs them', 'Lab, diagnostic and program partners, onboarded centrally.', 'Partner categories. Named partners appear only once agreements are signed.'],
  ['Platform', 'Hosting and patient data, handled', 'Hosting, security, backups, uptime monitoring and patient data controls.', 'A security summary, HIPAA safeguards and support hours.'],
];

const CYCLE = [
  ['Regular audit runs', 'Scheduled reviews of site claims, intake, privacy, prescribing and advertising.'],
  ['Change monitoring', 'Federal and state telehealth, pharmacy, privacy and advertising changes, tracked in one place.'],
  ['Announcements', 'What changed, what you must do, and by when.'],
  ['Remediation', 'We update pages and flows. You approve anything brand-facing.'],
  ['Record', 'Audit log and announcement history kept in your dashboard.'],
];

const INBOX = [
  ['var(--alert)', 'Program page wording', 'Remove "FDA-approved" from any compounded program page. Our template update is ready for your approval.', 'Action needed'],
  ['var(--brass)', 'State visit rules', 'A state you serve now requires a video visit for this program. Intake flow updated for that state.', 'Review'],
  ['var(--sage)', 'Quarterly audit complete', 'Site claims, intake and privacy notice checked. No changes needed.', 'Logged'],
  ['var(--sage)', 'LegitScript readiness', 'Policies, pharmacy details and provider disclosures in place for your application.', 'Ready'],
];

const BOARD = [
  ['New leads', [['J.R.', 'Weight care · NC', 'Asked about pricing via Instagram'], ['A.M.', 'Skin · FL', 'Started intake']]],
  ['In consult', [['K.T.', 'Hormone · TX', 'Provider review today']]],
  ['Active patients', [['S.P.', 'Weight care · GA', 'Shipped, tracking sent'], ['L.D.', 'Wellness · SC', 'Week 3 check-in']]],
  ['Due for refill', [['M.C.', 'Weight care · VA', 'Refill reminder queued']]],
  ['Win-back', [['R.B.', 'Skin · NC', 'No reply in 30 days']]],
];

const PLAN = [
  ['Platform build', [['Custom telehealth platform development', 'Built around your brand and programs'], ['Essential plugins & third-party integrations', 'Connected and tested'], ['Admin dashboard & patient management', 'Run day-to-day operations in one place']]],
  ['Care & patient experience', [['Doctor profiles & appointment booking', 'Patients review and book providers'], ['Secure video & audio consultations', 'Held inside the platform'], ['Patient dashboard & medical history', 'In one place'], ['Secure patient messaging', 'Private, patient to care team']]],
  ['Payments, security & readiness', [['Payment gateway integration', 'Connected to your checkout'], ['Security-focused, compliance-ready setup', 'Built with compliance readiness in mind'], ['LegitScript readiness guidance', 'Prepared for LegitScript review']]],
  ['Support that continues', [['Dedicated project manager', 'One named manager through the build'], ['Testing & quality assurance', 'Checked before launch'], ['Post-launch technical assistance', 'Help continues after go-live'], ['Ongoing growth & scalability support', 'As your business grows']]],
];

const BIZ = {
  clinic: ['Clinic', 'clinic', 'You already have patients and trust. Your launch adds programs they can start online.'],
  spa: ['Med spa', 'med spa', 'Your clients already come to you. Your launch turns in-person interest into online programs and refills.'],
  pharmacy: ['Pharmacy', 'pharmacy', 'You have fulfilment. Your launch adds the storefront, providers and compliant checkout.'],
  founder: ['Founder', 'founder', 'You have an audience. Your launch gives you the full stack in one place.'],
};
const PROG_CHOICES = ['Weight care', 'Hormone health', 'Skin & aesthetics', 'Wellness'];
const REACH = [['one', 'One state'], ['region', 'A region'], ['national', 'Nationwide']];

const CHECKLIST = ['Business name, logo and brand colors', 'A domain you own, or one to buy', 'Your programs and the states you want to serve', 'Business details for underwriting', 'Owner ID', 'Business bank account for payouts', 'Program pricing you want to charge', 'Website policies you want to keep, if any', 'Who answers patient messages and calls', 'Your launch announcement list: email, SMS and social'];
const CL_KEY = 'mr-launch-checklist-v1';

const FAQS = [
  ['Do I need my own doctors?', "No. Licensed providers in our network review intake, consult and prescribe within each state's rules. You can also bring your own providers."],
  ['Whose brand do patients see?', 'Yours: your name, logo, colors, domain and programs. MedRevolve runs behind the storefront.'],
  ['What does it cost?', 'Setup and ongoing costs are quoted on a short call, based on your programs, states and the services you choose. Our pricing is built to be competitive. Medication, provider visit fees, payment processing, LegitScript fees, labs, domain and ad spend are third-party costs, and we walk you through each one.'],
  ['What does setup include?', 'The 14 items in the Telehealth Plan above, from your custom platform and secure video visits to a dedicated project manager and post-launch help.'],
  ['Is it really about 7 days?', 'About 7 days from a signed agreement, with your brand assets and underwriting documents ready. The checklist above lists what to have on hand.'],
  ['Is MedRevolve LegitScript certified?', 'LegitScript certifies each merchant business itself. We prepare your site, policies, pharmacy and provider disclosures for your application and guide you through review.'],
  ['Can I offer compounded medications?', 'Only where a prescriber documents a patient-specific clinical need, through a licensed 503A pharmacy. Compounded products are never presented as FDA-approved, and our audits check your pages for that wording.'],
  ['Which states can I serve?', 'The provider network covers all 50 states. Visit types differ by state rules; we confirm each program\'s states during Day 1 scoping.'],
  ['What happens if a payment processor changes its rules?', 'A backup processor is lined up, and your payment flow, payout schedule and records move with you.'],
];

const slug = (n) => (n || 'yourbrand').toLowerCase().replace(/[^a-z0-9]/g, '') || 'yourbrand';

function Book({ children, className = 'btn btn-primary' }) {
  return <a className={className} href={BOOKING_URL} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function Row({ k, v }) {
  return <div className="mock-row"><span className="mock-k">{k}</span><b>{v}</b></div>;
}

function Screen({ tab, name, prog }) {
  const p = PROG[prog];
  if (tab === 0) return (<>
    <div className="sf-hero"><h4>{p.h}</h4><p>{p.s}</p><span className="sf-btn">Start your visit</span></div>
    <div className="sf-trust"><span>Licensed providers</span><span>Licensed pharmacy</span><span>Secure checkout</span></div>
  </>);
  if (tab === 1) return (<>
    <div className="sf-hero"><h4>{p.cards[0][0]}</h4><p>Who it is for: adults looking for provider-guided care. How it works: intake, provider review, then a personal plan.</p></div>
    <Row k="Program price" v="Set by you" /><Row k="Eligibility" v="Confirmed at provider review" /><Row k="FAQs" v="8 questions" />
  </>);
  if (tab === 2) return (<>
    <div className="mock-steps"><i className="on" /><i className="on" /><i /><i /></div>
    <b>Tell us about your health goals</b>
    <div className="mock-field">Current goal…</div><div className="mock-field">Medications you take now…</div>
    <Row k="Provider review" v="Within your state" /><Row k="Visit status" v="Under review" />
  </>);
  if (tab === 3) return (<>
    <b>Your order</b>
    <Row k={p.cards[0][0]} v="Program price" /><Row k="Billing" v="Monthly, with refills" /><Row k="Tracking" v="Sent by SMS and email" /><Row k="Support" v={`help@${slug(name)}.com`} />
    <span className="sf-btn">Pay securely</span>
  </>);
  return (<>
    <span className="ex">Example data</span>
    <div className="mock-kpis">{[['Orders', '128'], ['Patients', '94'], ['Revenue', '$18.4k'], ['Next payout', 'Fri']].map(([l, v]) => <div className="mock-kpi" key={l}><b>{v}</b><span>{l}</span></div>)}</div>
    <Row k="Promotions" v="2 active" /><Row k="CRM: due for refill" v="7 patients" /><Row k="Compliance inbox" v="1 action needed" />
  </>);
}

export default function LaunchHome() {
  const [name, setName] = useState('Lumen Aesthetics');
  const [color, setColor] = useState('#4A6741');
  const [prog, setProg] = useState('weight');
  const [day, setDay] = useState(0);
  const [tab, setTab] = useState(0);
  const [biz, setBiz] = useState('clinic');
  const [progs, setProgs] = useState(['Weight care']);
  const [reach, setReach] = useState('one');
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CL_KEY) || '{}') || {}; } catch { return {}; }
  });

  useEffect(() => {
    if (!document.getElementById('mrx-fonts')) {
      const l = document.createElement('link');
      l.id = 'mrx-fonts'; l.rel = 'stylesheet'; l.href = FONT_URL;
      document.head.appendChild(l);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CL_KEY, JSON.stringify(checked)); } catch { /* storage unavailable */ }
  }, [checked]);

  const brand = name.trim() || 'Your Brand';
  const domain = `${slug(name)}.com`;
  const p = PROG[prog];
  const d = DAYS[day];
  const doneCount = CHECKLIST.filter((_, i) => checked[i]).length;

  const plan = useMemo(() => {
    const b = BIZ[biz];
    const n = progs.length || 1;
    return {
      title: `A branded ${progs.length ? progs.join(', ').toLowerCase() : 'telehealth'} business for your ${b[1]}.`,
      intro: b[2],
      items: [
        `Your site with ${n} program page${n > 1 ? 's' : ''}, intake, checkout and patient portal`,
        reach === 'national' ? 'Providers connected for patients nationwide, with visit types set per state' : reach === 'region' ? 'Providers connected across your region, with visit types set per state' : 'Providers connected in your state',
        biz === 'pharmacy' ? 'Your pharmacy connected, or our 503A pharmacy partner' : '503A pharmacy fulfilment with shipping and tracking',
        'A healthcare-ready merchant account with refills and payouts',
        'CRM, contact center and audience boards switched on',
      ],
      flag: progs.includes('Weight care') ? 'Weight care programs get extra review on Day 6: claims wording, pharmacy disclosures and LegitScript readiness.' : 'Every program gets a claims and advertising review on Day 6.',
    };
  }, [biz, progs, reach]);

  const toggleProg = (v) => setProgs((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const onDayKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = (day + (e.key === 'ArrowRight' ? 1 : DAYS.length - 1)) % DAYS.length;
      setDay(next);
      const btn = document.getElementById(`mrx-day-${next}`); if (btn) btn.focus();
    }
  };

  return (
    <div className="mrx" style={{ '--brand': color }}>
      <style>{LAUNCH_CSS}</style>

      <section className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <span className="eyebrow">White-label telehealth infrastructure</span>
            <h1>Your brand.<br />Your telehealth business.<br /><em className="i">Live in about 7 days.</em></h1>
            <p className="lead">For clinic, med spa and pharmacy owners who want a new revenue line under their own name. We plug in the site, providers, pharmacy, payments and compliance, so you sell from day one.</p>
            <div className="for"><span>Clinics</span><span>Med spas</span><span>Pharmacies</span><span>Founders</span></div>
            <div className="hero-cta">
              <Book>Book a 20-min demo <span className="arrow">→</span></Book>
              <a className="btn btn-ghost" href="#checklist">Get the launch checklist</a>
            </div>
            <div className="stats">
              <div className="stat"><b>~7 days</b><span>signed agreement to live storefront</span></div>
              <div className="stat"><b>14 items</b><span>in every launch, listed below</span></div>
              <div className="stat"><b>50 states</b><span>provider network coverage</span></div>
            </div>
          </div>

          <div className="studio" aria-label="Live storefront preview">
            <div className="controls">
              <label htmlFor="mrx-brand">Your brand</label>
              <input id="mrx-brand" type="text" value={name} maxLength={28} autoComplete="off" onChange={(e) => setName(e.target.value)} />
              <div className="swatches" role="group" aria-label="Brand color">
                {SWATCHES.map(([c, label]) => (
                  <button key={c} type="button" className="swatch" style={{ background: c }} aria-label={label} aria-pressed={color === c} onClick={() => setColor(c)} />
                ))}
              </div>
              <select id="mrx-program" aria-label="Headline program" value={prog} onChange={(e) => setProg(e.target.value)}>
                {Object.entries(PROG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="browser">
              <div className="bar"><i /><i /><i /><div className="url">{domain}</div></div>
              <div className="sf">
                <div className="sf-nav"><div className="sf-brand"><span className="sf-dot" /><span>{brand}</span></div><div className="sf-links"><span>Programs</span><span>How it works</span><span>Sign in</span></div></div>
                <div className="sf-hero"><h4>{p.h}</h4><p>{p.s}</p><span className="sf-btn">Start your visit</span></div>
                <div className="sf-trust"><span>Licensed providers</span><span>Licensed pharmacy</span><span>Secure checkout</span></div>
                <div className="sf-cards">{p.cards.map(([t, s]) => <div className="sf-card" key={t}><b>{t}</b><span>{s}</span></div>)}</div>
              </div>
            </div>
            <p className="studio-note">Type a brand name and pick a color. This is the storefront your patients see. MedRevolve stays invisible.</p>
          </div>
        </div>
      </section>

      <section className="qband" aria-label="Five questions owners ask">
        <div className="wrap qgrid">
          {[['#walkthrough', 'Can I launch fast?', 'A dated Day 1 to Day 7 plan.'], ['#site', 'Will it look like mine?', 'Your logo, colors, domain and programs.'], ['#care', 'Who treats my patients?', 'Licensed providers, named and explained.'], ['#payments', 'How do orders and money work?', 'Fulfilment, payouts and a healthcare-ready merchant account.'], ['#compliance', 'Am I compliant?', 'Audits, rule changes and fixes, ongoing.']].map(([href, q, a], i) => (
            <a className="q" href={href} key={href}><span className="n">0{i + 1}</span><b>{q}</b><span>{a}</span></a>
          ))}
        </div>
      </section>

      <section id="walkthrough">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">The walkthrough</span>
            <h2>Seven days, and you always know <em className="i">whose turn it is.</em></h2>
            <p className="lead">Owners fear hidden work more than price. Every day shows what you do and what we do.</p>
          </div>
          <div className="days" role="tablist" aria-label="Launch days">
            <span className="fill" style={{ width: `${(day / (DAYS.length - 1)) * 92}%` }} />
            {DAYS.map((x, i) => (
              <button key={x[0]} id={`mrx-day-${i}`} type="button" role="tab" className={`day${i < day ? ' done' : ''}`} aria-selected={i === day} tabIndex={i === day ? 0 : -1} onClick={() => setDay(i)} onKeyDown={onDayKey}>
                <span className="dot">{i + 1}</span><span className="lbl">{x[1]}</span>
              </button>
            ))}
          </div>
          <div className="daypanel" role="tabpanel" aria-live="polite">
            <div className="daytitle"><h3>Day {day + 1} — {d[0]}</h3><span className="time">{day === 6 ? 'Launch day' : `Day ${day + 1} of 7`}</span></div>
            <div className="col you"><span className="who">You do</span><ul>{d[2].map((t) => <li key={t}>{t}</li>)}</ul></div>
            <div className="col we"><span className="who">MedRevolve does</span><ul>{d[3].map((t) => <li key={t}>{t}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section id="site" className="alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How your site looks</span>
            <h2>Patients never feel they've <em className="i">left your brand.</em></h2>
            <p className="lead">Five screens make up the business: four your patients use, one you run it from. The preview follows the brand you typed above.</p>
          </div>
          <div className="tabs" role="tablist" aria-label="Site screens">
            {TABS.map((t, i) => <button key={t} type="button" role="tab" className="tab" aria-selected={i === tab} onClick={() => setTab(i)}>{t}</button>)}
          </div>
          <div className="anat">
            <div className="browser screen">
              <div className="bar"><i /><i /><i /><div className="url">{domain}/{TAB_PATHS[tab]}</div></div>
              <div className="sf">
                <div className="sf-nav"><div className="sf-brand"><span className="sf-dot" /><span>{brand}</span></div></div>
                <Screen tab={tab} name={name} prog={prog} />
              </div>
              {PINS[tab].map(([top, left], i) => <span key={i} className="pin" style={{ top, left }}>{i + 1}</span>)}
            </div>
            <div className="notes"><ul>{NOTES[tab].map((t) => <li key={t}>{t}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section id="care">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Behind the storefront</span>
            <h2>One journey explains <em className="i">the whole business.</em></h2>
            <p className="lead">You sell under your brand. MedRevolve connects the regulated pieces you can't easily build alone.</p>
          </div>
          <div className="journey" aria-label="Patient journey">
            {JOURNEY.map(([t, s, icon]) => (
              <div className="jstep" key={t}>
                <div className="ico"><svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg></div>
                <span className="pulse" /><b>{t}</b><span>{s}</span>
              </div>
            ))}
          </div>
          <div className="layers">
            {LAYERS.map(([tag, h, conn, pub]) => (
              <div className="layer" key={tag}><span className="tag">{tag}</span><h3>{h}</h3>
                <dl><dt>Connected</dt><dd>{conn}</dd><dt>We publish</dt><dd>{pub}</dd></dl></div>
            ))}
          </div>
        </div>
      </section>

      <section id="payments" className="alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Payments</span>
            <h2>A merchant account that won't freeze <em className="i">because you're healthcare.</em></h2>
            <p className="lead">Many processors class telehealth as high-risk and close accounts when they see subscriptions or pharmacy sales. We source accounts from vendors with a long healthcare track record who understand telehealth underwriting.</p>
          </div>
          <div className="pay">
            <div className="flowbox">
              <span className="eyebrow" style={{ color: 'var(--sage)' }}>How money moves</span>
              <div className="pflow">
                {[['Checkout', "On your brand's site"], ['Authorization', 'Card approved'], ['Settlement', 'Funds clear'], ['Payout', 'To your bank, on schedule']].map(([t, s], i, arr) => (
                  <React.Fragment key={t}><div className="pnode"><b>{t}</b><span>{s}</span></div>{i < arr.length - 1 && <span className="parrow">→</span>}</React.Fragment>
                ))}
              </div>
              <div className="branches">
                <div className="branch"><b>Subscriptions &amp; refills</b>Billed automatically as refills are approved.</div>
                <div className="branch"><b>Refunds</b>Issued from your dashboard, tracked per order.</div>
                <div className="branch"><b>Chargebacks</b>A defined dispute process with records ready.</div>
              </div>
              <div className="box inset"><b>Fees, stated plainly</b><p className="muted">Processing rate, gateway fee, chargeback fee and any monthly fee are each listed in your agreement before you sign. No hidden line.</p></div>
            </div>
            <div className="side">
              <div className="box"><b>What underwriting asks for</b>
                <ul className="checks">{['Business details', 'Owner ID', 'Business bank account', 'Your program list', 'Website and policies review'].map((t) => <li key={t}>{t}</li>)}</ul></div>
              <div className="box"><b>If a processor changes its rules</b><p className="muted">A backup processor is lined up so a policy change doesn't stop your sales.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="compliance">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Compliance</span>
            <h2>Compliance is a service, <em className="i">not a launch checkbox.</em></h2>
            <p className="lead">Rules on telehealth, pharmacy, privacy and advertising change often. We track them centrally, tell you what changed, and fix the templates for you.</p>
          </div>
          <div className="comp">
            <div>
              {CYCLE.map(([t, s], i) => <div className="cyc" key={t}><span className="k">0{i + 1}</span><div><b>{t}</b><span>{s}</span></div></div>)}
            </div>
            <div className="inbox">
              <div className="inbox-h"><b>Compliance inbox</b><span className="exd">Example notices</span></div>
              {INBOX.map(([c, t, s, st]) => (
                <div className="msg" key={t}><i className="sev" style={{ background: c }} /><div><b>{t}</b><span>{s}</span></div><span className="st">{st}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="growth" className="alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Growth, CRM &amp; contact center</span>
            <h2>Reply fast. Follow up automatically. <em className="i">Never make a patient repeat their story.</em></h2>
            <p className="lead">Every lead, patient, order and refill lives in one record. Audience boards show who needs attention today.</p>
          </div>
          <div className="board" aria-label="Audience board, example">
            {BOARD.map(([lane, cards], li) => (
              <div className="lane" key={lane}><div className="lane-h">{lane}{li === 0 && <span>Example</span>}</div>
                {cards.map(([who, what, note]) => <div className="ticket" key={who}><b>{who}</b><i>{what}</i><i>{note}</i></div>)}
              </div>
            ))}
          </div>
          <div className="chans" aria-label="Channels in one inbox">{['Phone', 'SMS', 'Email', 'Live chat', 'Facebook DMs', 'Instagram DMs', 'Threads DMs'].map((c) => <span key={c}>{c}</span>)}</div>
          <div className="grow2">
            <div className="box"><b>Network</b><p className="muted">Introductions to complementary clinics, creators, affiliates and local partners. Co-marketing and referrals, plus a founder community where owners share what's working.</p></div>
            <div className="box"><b>Marketing</b><p className="muted">Launch announcement kit, social templates, ad-ready landing pages, email and SMS campaigns, and tracking pixels installed correctly and compliantly.</p></div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Telehealth Plan</span>
            <h2>Everything included, <em className="i">listed in full.</em></h2>
            <p className="lead">No vague promises. Here is every item in the launch, what's separate, and how support continues after go-live.</p>
          </div>
          <div className="price">
            <div className="pcard">
              <span className="eyebrow" style={{ color: 'var(--sage)' }}>Setup &amp; costs</span>
              <div className="amount">Your quote</div>
              <p className="muted">One branded telehealth platform, live in about 7 days, with all 14 items in the plan. Setup and ongoing costs are quoted on a short call, based on your programs, states and services. Our pricing is built to be competitive.</p>
              <Book>Get my setup quote <span className="arrow">→</span></Book>
              <a className="btn btn-ghost" href="#builder">Build your launch plan</a>
            </div>
            <div className="plan">
              {(() => { let n = 0; return PLAN.map(([g, items]) => (
                <div className="pgroup" key={g}><h3>{g}</h3><ol>
                  {items.map(([t, s]) => { n += 1; return <li key={t} data-n={String(n).padStart(2, '0')}><div><b>{t}</b><span>{s}</span></div></li>; })}
                </ol></div>
              )); })()}
              <div className="sep">
                <div><b>Third-party costs we walk you through</b><ul>{['Medication and pharmacy fulfilment', 'Provider visit fees', 'Payment processing fees', 'LegitScript certification fees, paid to LegitScript', 'Labs, domain and ad spend'].map((t) => <li key={t}>{t}</li>)}</ul></div>
                <div><b>After launch</b><ul>{['Ongoing platform and support terms are set out in your quote', 'Post-launch help comes from your named support contact', 'Compliance updates arrive in your dashboard inbox'].map((t) => <li key={t}>{t}</li>)}</ul></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="builder" className="alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Build your launch plan</span>
            <h2>See what your day 7 <em className="i">looks like.</em></h2>
            <p className="lead">Pick your business and programs. We'll show what goes live and what to prepare before the demo.</p>
          </div>
          <div className="build">
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="fset"><legend>Your business</legend><div className="chips">
                {Object.entries(BIZ).map(([k, v]) => <label className="chip" key={k}><input type="radio" name="mrx-biz" value={k} checked={biz === k} onChange={() => setBiz(k)} /><span>{v[0]}</span></label>)}
              </div></fieldset>
              <fieldset className="fset"><legend>Programs</legend><div className="chips">
                {PROG_CHOICES.map((v) => <label className="chip" key={v}><input type="checkbox" checked={progs.includes(v)} onChange={() => toggleProg(v)} /><span>{v}</span></label>)}
              </div></fieldset>
              <fieldset className="fset"><legend>Where your patients are</legend><div className="chips">
                {REACH.map(([k, v]) => <label className="chip" key={k}><input type="radio" name="mrx-reach" value={k} checked={reach === k} onChange={() => setReach(k)} /><span>{v}</span></label>)}
              </div></fieldset>
            </form>
            <div className="out" aria-live="polite">
              <span className="eyebrow">Your day 7</span>
              <h3>{plan.title}</h3>
              <p className="muted">{plan.intro}</p>
              <ul>{plan.items.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="flag">{plan.flag}</p>
              <Book>Book a demo with this plan →</Book>
            </div>
          </div>

          <div id="checklist" className="build" style={{ marginTop: 56 }}>
            <div className="sec-head" style={{ margin: 0 }}>
              <span className="eyebrow">Launch checklist</span>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.4rem)' }}>The white-label launch checklist</h2>
              <p className="lead">Everything to have ready before Day 1. Tick items as you go; your progress stays in this browser.</p>
              <div className="progress" aria-hidden="true"><i style={{ width: `${(100 * doneCount) / CHECKLIST.length}%` }} /></div>
              <p className="muted clcount">{doneCount} of {CHECKLIST.length} ready</p>
            </div>
            <div className="form"><div className="cl">
              {CHECKLIST.map((t, i) => (
                <label key={t}><input type="checkbox" id={`mrx-cl-${i}`} checked={!!checked[i]} onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))} /><span>{t}</span></label>
              ))}
            </div></div>
          </div>
        </div>
      </section>

      <section id="pictures">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">In pictures</span>
            <h2>The whole platform, <em className="i">one graphic at a time.</em></h2>
            <p className="lead">Share-ready graphics with captions. Every one links back to the part of this page it explains.</p>
          </div>
          <div className="gallery">
            {SOCIAL_GRAPHICS.map((g) => (
              <a key={g.id} className="gtile" href={`/SocialKit#${g.id}`}>
                <img src={`/social/${g.id}.png`} alt={g.alt} width="1080" height="1080" loading="lazy" />
                <span>{g.title}</span>
              </a>
            ))}
          </div>
          <p style={{ marginTop: 18 }}><a className="btn btn-ghost" href="/SocialKit">Open the graphics library <span className="arrow">→</span></a></p>
        </div>
      </section>

      <section id="learn" className="alt">
        <div className="wrap">
          <div className="sec-head"><span className="eyebrow">Learn</span><h2>Straight answers <em className="i">before you buy.</em></h2></div>
          <div className="arts">
            <article className="art"><span className="tg">Guide · coming soon</span><h3>How to launch a telehealth brand in 7 days</h3><p>The day-by-day plan, what to prepare, and where launches usually stall.</p></article>
            <article className="art"><span className="tg">Checklist · coming soon</span><h3>The telehealth compliance checklist for owners</h3><p>HIPAA, LegitScript, state rules and advertising claims, in plain language.</p></article>
            <article className="art"><span className="tg">Explainer · coming soon</span><h3>503A pharmacies, explained</h3><p>What a 503A pharmacy is, how fulfilment works, and what you can say about it.</p></article>
          </div>
          <div className="faq">
            {FAQS.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <div className="final-copy">
            <span className="eyebrow">Next step</span>
            <h2>Book a free 20-minute call with your <em className="i">onboarding specialist.</em></h2>
            <p className="lead">Walk through the platform, your programs and your states. The Google Meet link arrives as soon as you book.</p>
            <div className="hero-cta"><Book>Pick a time <span className="arrow">→</span></Book><a className="btn btn-ghost" href="#checklist">Start the checklist</a></div>
          </div>
          <div className="final-card">
            <div className="row"><span className="muted">Call</span><b>MedRevolve intro call</b></div>
            <div className="row"><span className="muted">Length</span><b>15, 20 or 30 minutes</b></div>
            <div className="row"><span className="muted">Where</span><b>Google Meet</b></div>
            <div className="row"><span className="muted">For</span><b>Brands, clinics, med spas, pharmacies, providers</b></div>
          </div>
        </div>
      </section>

      <section className="discband">
        <div className="wrap">
          <p className="disc">MedRevolve is a technology and services platform for healthcare businesses. It does not provide medical care. Clinical services are provided by independent licensed providers, and prescriptions are issued only when a provider determines they are clinically appropriate. Medications are dispensed by licensed pharmacies. Compounded medications are not FDA-approved.</p>
        </div>
      </section>
    </div>
  );
}
