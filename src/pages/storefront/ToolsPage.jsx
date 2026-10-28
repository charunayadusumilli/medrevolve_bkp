import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { applyStoreSeo } from '@/lib/storefront/seo';

const TOOL_META = {
  bmi: {
    title: 'BMI calculator — free body mass index tool | MedRevolve',
    description: 'Calculate your body mass index (BMI) in seconds. Educational only — a licensed provider determines treatment eligibility.',
    heading: 'BMI calculator',
    blurb: 'Body mass index is a rough screen, not a diagnosis. Enter your height and weight to see where you land.',
  },
  tdee: {
    title: 'TDEE calculator — daily calorie needs | MedRevolve',
    description: 'Estimate your total daily energy expenditure using the Mifflin-St Jeor equation, then see what a deficit looks like.',
    heading: 'TDEE calculator',
    blurb: 'Estimate the calories you burn in a day, and what a 500-calorie deficit looks like in practice.',
  },
  protein: {
    title: 'Protein target calculator — grams per day | MedRevolve',
    description: 'Calculate a daily protein target based on your bodyweight and goal: maintenance, fat loss or muscle gain.',
    heading: 'Protein target',
    blurb: 'Protein needs scale with bodyweight and goal. This gives you a practical daily range in grams.',
  },
  testosterone: {
    title: 'Testosterone level check — what your lab number means | MedRevolve',
    description: 'Enter a total testosterone result to see reference ranges and what low, normal or high values generally mean.',
    heading: 'Testosterone check',
    blurb: 'Reference ranges vary by lab and time of draw. Enter your total testosterone to see where it sits.',
  },
};

const field =
  'mt-1.5 w-full rounded-xl border border-sf-line bg-sf-paper px-3 py-2.5 text-[13px] outline-none focus:border-sf-ink';

function NumberField({ label, value, onChange, suffix, min = 0 }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={field}
        />
        {suffix && <span className="text-[12px] text-sf-muted">{suffix}</span>}
      </div>
    </label>
  );
}

function BmiTool() {
  const [weight, setWeight] = useState('180');
  const [height, setHeight] = useState('70');
  const bmi = useMemo(() => {
    const w = Number(weight);
    const h = Number(height);
    if (!w || !h) return null;
    return (703 * w) / (h * h);
  }, [weight, height]);
  const band = !bmi || bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obesity range';

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Weight" value={weight} onChange={setWeight} suffix="lb" />
        <NumberField label="Height" value={height} onChange={setHeight} suffix="in" />
      </div>
      <div className="mt-6 rounded-2xl bg-sf-paper p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sf-muted">Your BMI</p>
        <p className="mt-1 font-display text-[40px] leading-none">{bmi ? bmi.toFixed(1) : '—'}</p>
        <p className="mt-1 text-[13px] font-semibold text-sf-accent">{band}</p>
      </div>
    </>
  );
}

function TdeeTool() {
  const [weight, setWeight] = useState('180');
  const [height, setHeight] = useState('70');
  const [age, setAge] = useState('35');
  const [sex, setSex] = useState('male');
  const [activity, setActivity] = useState('1.375');

  const tdee = useMemo(() => {
    const w = Number(weight) * 0.45359237;
    const h = Number(height) * 2.54;
    const a = Number(age);
    if (!w || !h || !a) return null;
    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161);
    return bmr * Number(activity);
  }, [weight, height, age, sex, activity]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Weight" value={weight} onChange={setWeight} suffix="lb" />
        <NumberField label="Height" value={height} onChange={setHeight} suffix="in" />
        <NumberField label="Age" value={age} onChange={setAge} suffix="yrs" />
        <label className="block">
          <span className="text-[12px] font-semibold">Sex</span>
          <select value={sex} onChange={(e) => setSex(e.target.value)} className={field}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-semibold">Activity level</span>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={field}>
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly active</option>
            <option value="1.55">Moderately active</option>
            <option value="1.725">Very active</option>
          </select>
        </label>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Maintenance', value: tdee },
          { label: 'Fat loss (−500)', value: tdee ? tdee - 500 : null },
          { label: 'Muscle gain (+300)', value: tdee ? tdee + 300 : null },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-sf-paper p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-sf-muted">{item.label}</p>
            <p className="mt-1 font-display text-[26px] leading-none">
              {item.value ? Math.round(item.value).toLocaleString() : '—'}
            </p>
            <p className="text-[11px] text-sf-muted">cal / day</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ProteinTool() {
  const [weight, setWeight] = useState('180');
  const [goal, setGoal] = useState('1.8');
  const kg = Number(weight) * 0.45359237;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Weight" value={weight} onChange={setWeight} suffix="lb" />
        <label className="block">
          <span className="text-[12px] font-semibold">Goal</span>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={field}>
            <option value="1.6">Maintain</option>
            <option value="2.0">Fat loss (preserve muscle)</option>
            <option value="2.2">Muscle gain</option>
          </select>
        </label>
      </div>
      <div className="mt-6 rounded-2xl bg-sf-paper p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sf-muted">Daily protein</p>
        <p className="mt-1 font-display text-[40px] leading-none">
          {kg ? Math.round(kg * Number(goal)) : '—'}
          <span className="font-body text-base text-sf-muted"> g</span>
        </p>
        <p className="mt-1 text-[12px] text-sf-muted">{goal} g per kg of bodyweight</p>
      </div>
    </>
  );
}

function TestosteroneTool() {
  const [value, setValue] = useState('420');
  const total = Number(value);
  const band =
    !total ? '—' : total < 300 ? 'Below common reference range' : total <= 1000 ? 'Within common reference range' : 'Above common reference range';

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Total testosterone" value={value} onChange={setValue} suffix="ng/dL" />
      </div>
      <div className="mt-6 rounded-2xl bg-sf-paper p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sf-muted">Reading</p>
        <p className="mt-1 font-display text-[34px] leading-none">{total || '—'} <span className="font-body text-sm text-sf-muted">ng/dL</span></p>
        <p className="mt-1 text-[13px] font-semibold text-sf-accent">{band}</p>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-sf-muted">
        Typical adult male reference ranges run roughly 264–916 ng/dL and vary by lab, time of draw and age.
        Symptoms matter more than a single number. If you're concerned, start an intake for a lab-based review.
      </p>
    </>
  );
}

export default function ToolsPage() {
  const { slug } = useParams();
  const meta = TOOL_META[slug] || TOOL_META.bmi;

  useEffect(() => {
    applyStoreSeo({ title: meta.title, description: meta.description, path: `/tools/${slug}` });
  }, [slug, meta]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <nav className="flex items-center gap-2 text-[12px] text-sf-muted">
        <Link to="/" className="hover:text-sf-ink">Home</Link>
        <span>/</span>
        <span className="text-sf-ink">Free tools</span>
      </nav>

      <h1 className="mt-6 font-display text-[38px] leading-tight tracking-tight sm:text-[44px]">{meta.heading}</h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-sf-muted">{meta.blurb}</p>

      <div className="mt-8 rounded-2xl border border-sf-line bg-sf-surface p-6">
        {slug === 'tdee' ? <TdeeTool /> : slug === 'protein' ? <ProteinTool /> : slug === 'testosterone' ? <TestosteroneTool /> : <BmiTool />}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {Object.keys(TOOL_META).map((key) => (
          <Link
            key={key}
            to={`/tools/${key}`}
            className={`rounded-full border px-3 py-1.5 text-[12px] font-medium ${
              key === slug ? 'border-sf-ink bg-sf-ink text-white' : 'border-sf-line text-sf-muted hover:text-sf-ink'
            }`}
          >
            {TOOL_META[key].heading}
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sf-line bg-sf-paper p-5">
        <p className="text-[13px] font-semibold">Want a clinician's read on your numbers?</p>
        <p className="mt-1 text-[12px] text-sf-muted">
          Order a lab panel or start an intake — a licensed provider reviews your results with you.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/shop/labs" className="rounded-full bg-sf-ink px-5 py-2.5 text-[12px] font-semibold text-white">
            Shop labs
          </Link>
          <Link to="/intake/weight-loss" className="rounded-full border border-sf-ink px-5 py-2.5 text-[12px] font-semibold text-sf-ink">
            Start an intake
          </Link>
        </div>
      </div>

      <p className="mt-6 text-[11px] leading-relaxed text-sf-muted">
        These calculators are educational estimates and are not medical advice, diagnosis, or treatment.
        Always discuss results with a licensed provider.
      </p>
    </div>
  );
}