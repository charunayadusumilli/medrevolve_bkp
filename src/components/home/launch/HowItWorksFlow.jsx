import React from 'react';

// Five-step flow from a patient finding the brand to recurring revenue.
// Styles are scoped in launchStyles.js under the .mrx .how* rules.

const STEPS = [
  ['Patient finds your brand', 'Your logo, your domain, your pricing.'],
  ['Nova AI intake, 24/7', 'Qualifies and books patients around the clock.'],
  ['Licensed provider review', 'All 50 states.'],
  ['Pharmacy ships', 'Direct to the patient\u2019s door.'],
  ['Recurring revenue', 'Subscriptions bill to your own merchant account.'],
];

export default function HowItWorksFlow() {
  return (
    <section id="how" className="how" aria-label="How it works">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">How it works</span>
          <h2>Five steps from a patient finding you <em className="i">to recurring revenue.</em></h2>
          <p className="lead">One platform runs the whole path, and every step stays under your brand.</p>
        </div>
        <ol className="howflow">
          {STEPS.map(([title, sub], i) => (
            <li className="howstep" key={title}>
              <span className="hownum">{i + 1}</span>
              <b>{title}</b>
              <p>{sub}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}