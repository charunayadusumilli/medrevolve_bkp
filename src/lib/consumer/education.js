/**
 * Consumer education content — the evidence spine of medrevolve.com.
 * Every claim here is written to be defensible: named trials, named journals,
 * paraphrased consensus positions (never invented quotes), and honest limits.
 */

export const SAFETY_SLIDES = [
  {
    title: "What is actually in the vial",
    body:
      "A prescription is only as good as what was filled. Compounded medication is prepared by a state-licensed 503A pharmacy under your prescriber's order, and the active ingredient is identified and measured before release.",
    points: [
      "Identity and strength confirmed by HPLC against a reference standard",
      "Sterility and endotoxin testing on injectable lots",
      "Lot number printed on the vial, certificate of analysis kept on file",
      "A 503A pharmacy compounds for a named patient — it is not mass-manufactured",
    ],
    source: "Compounded medicines are not FDA-approved as finished products. Release testing is how quality is verified.",
  },
  {
    title: "Who should not take it",
    body:
      "The most important safety step happens before your first dose: a licensed clinician reads your history and rules you out if the risk is wrong for you. These are the answers that change a prescription.",
    points: [
      "Personal or family history of medullary thyroid carcinoma or MEN2 (GLP-1 therapy)",
      "History of pancreatitis, severe gastroparesis or active gallbladder disease",
      "Pregnancy, breastfeeding or trying to conceive",
      "Type 1 diabetes, or kidney disease requiring dialysis",
      "Any allergy to the active ingredient or an excipient in the formulation",
    ],
    source: "Screened in the intake and again on the provider review before anything ships.",
  },
  {
    title: "What to expect, and what to report",
    body:
      "Most people feel something in the first two weeks. Knowing which sensations are the drug working and which are a reason to stop is the difference between quitting early and getting to a dose that works.",
    points: [
      "Expected: nausea, reflux, constipation, burping, fatigue, low appetite — usually easing after each titration",
      "Report the same day: severe or radiating abdominal pain, repeated vomiting, dehydration, vision changes",
      "Report within a week: new anxiety or low mood, injection-site reaction that is spreading",
      "Stop and call 911: facial swelling, trouble breathing, widespread hives",
    ],
    source: "Guidance mirrors the labelled adverse-event profile of each molecule and our clinical escalation policy.",
  },
  {
    title: "How you are monitored",
    body:
      "A prescription without follow-up is a guess. Monitoring is built into the price, not sold separately, and it is what makes a dose change safe.",
    points: [
      "Baseline labs where the molecule requires them (metabolic, hormone, thyroid)",
      "A check-in at every titration step, answered by a clinician — not a bot",
      "Repeat labs at roughly 90 days, or sooner if symptoms change",
      "Dose holds and step-downs are normal clinical decisions, not failures",
    ],
    source: "Monitoring intervals follow the labelled schedule for each molecule plus our internal protocol.",
  },
  {
    title: "If something goes wrong",
    body:
      "You should know the path before you need it. Every order includes a route back to a human, and a written record of what you were taking.",
    points: [
      "Message your provider in-app — same-day replies on business days",
      "Text our support line for order, dosing and refill questions",
      "Your lot number and certificate are retrievable after delivery",
      "Adverse events are documented and reviewed by the clinical team",
    ],
    source: "Adverse events are reported to the dispensing pharmacy and, where required, to the manufacturer and FDA MedWatch.",
  },
];

export const EFFICACY_SLIDES = [
  {
    title: "Weeks 0–2: the scale is the last thing to move",
    body:
      "Appetite signalling changes before body weight does. Most people notice they stop thinking about food between meals before anything shows on a scale.",
    points: [
      "Reduced 'food noise' and earlier fullness",
      "Possible nausea on the days after each dose",
      "Weight change this early is mostly water and glycogen",
      "Do not judge the drug on the first two weeks",
    ],
    source: "Titration schedules exist because the first doses are deliberately sub-therapeutic.",
  },
  {
    title: "Weeks 4–12: the dose becomes therapeutic",
    body:
      "This is where the curve bends. In the STEP programme, participants on semaglutide 2.4 mg were down about 5–7% of body weight by the 12-week mark while still titrating.",
    points: [
      "First measurable reduction usually appears here",
      "Titration continues only if side effects allow",
      "Protein intake and resistance training start protecting lean mass now",
      "Providers reassess rather than pushing the dose up blindly",
    ],
    source: "Wilding et al., STEP 1, New England Journal of Medicine, 2021.",
  },
  {
    title: "Months 6–17: the trial numbers",
    body:
      "At 68 weeks, semaglutide 2.4 mg produced a mean 14.9% body-weight reduction versus 2.4% on placebo. Tirzepatide 15 mg reached 20.9% at 72 weeks in SURMOUNT-1.",
    points: [
      "STEP 1 — 14.9% mean reduction at 68 weeks",
      "SURMOUNT-1 — up to 20.9% at 72 weeks",
      "Head-to-head SURMOUNT-5 — 20.2% vs 13.7% at 72 weeks",
      "Individual results vary widely; these are means, not promises",
    ],
    source: "NEJM 2021 (STEP 1), NEJM 2022 (SURMOUNT-1), NEJM 2025 (SURMOUNT-5).",
  },
  {
    title: "The plateau is real — and it is not failure",
    body:
      "Weight loss slows because the body defends its new set point. STEP 4 answered the obvious question: what happens if you stop? Most of the loss came back.",
    points: [
      "Plateaus typically arrive between months 9 and 15",
      "Continuing therapy held the loss; withdrawal reversed it",
      "Maintenance is a lower dose, not no dose",
      "Switching molecules is an option when one plateaus early",
    ],
    source: "Rubino et al., STEP 4, JAMA 2021 — withdrawal extension.",
  },
  {
    title: "How long it needs to continue",
    body:
      "Obesity is treated as a chronic condition, the way blood pressure is. The effective period is as long as the risk it is treating, with the dose adjusted down to the lowest that holds the result.",
    points: [
      "GLP-1 therapy: ongoing, with a maintenance dose after goal",
      "Testosterone: ongoing while hypogonadism is being treated",
      "Hair: judge at 6–12 months, continue to maintain",
      "Retinoids: visible remodelling by 12 weeks, ongoing to keep it",
    ],
    source: "Obesity Medicine Association and AACE both frame pharmacotherapy as long-term treatment.",
  },
];

export const DOSE_SLIDES = [
  {
    title: "Why you start below the working dose",
    body:
      "The starting dose is not the treatment dose. It exists to let your gut adapt so you can reach a dose that works without quitting on week two.",
    points: [
      "Semaglutide: 0.25 mg → 0.5 → 1.0 → 1.7 → 2.4 mg (4 weeks per step)",
      "Tirzepatide: 2.5 mg → 5 → 7.5 → 10 → 12.5 → 15 mg",
      "Steps are skipped only when side effects are genuinely absent",
      "Two people on the same molecule can land on different maintenance doses",
    ],
    source: "Titration follows each product's labelled schedule.",
  },
  {
    title: "What a dose actually does",
    body:
      "These molecules mimic a gut hormone that slows stomach emptying and signals fullness to the brain. The effect lasts about a week per injection, which is why the schedule is weekly.",
    points: [
      "Slower gastric emptying — fullness arrives sooner and lasts longer",
      "Reduced appetite signalling between meals",
      "Steady-state builds over roughly 4–5 weeks of the same dose",
      "A missed week is not a crisis — but it resets tolerance slightly",
    ],
    source: "Mechanism of action for GLP-1 and dual GIP/GLP-1 receptor agonists.",
  },
  {
    title: "Missed doses, side effects and holds",
    body:
      "The rule for a missed dose is simple, and it is the one instruction people most often get wrong.",
    points: [
      "Missed by 5 days or less: take it, then continue the usual day",
      "Missed by more than 5 days: skip it and resume on your normal day",
      "Never double up to catch up",
      "More than two weeks off: message your provider before restarting",
    ],
    source: "Labelled missed-dose guidance for once-weekly GLP-1 therapy.",
  },
  {
    title: "What maximum efficacy actually requires",
    body:
      "The medication is one input. The trials that produced those numbers also included diet counselling and physical activity — the drug does the appetite work, you do the rest.",
    points: [
      "Protein 1.2–1.6 g per kg of body weight, daily",
      "Resistance training 2–3× a week to defend lean mass",
      "7+ hours of sleep — appetite hormones are sleep-sensitive",
      "Fluids and electrolytes, especially in the first weeks",
      "Labs every ~90 days so the dose is adjusted on data",
    ],
    source: "STEP and SURMOUNT protocols paired pharmacotherapy with lifestyle intervention.",
  },
];

export const RESEARCH = [
  {
    area: "Weight",
    title: "STEP 1: semaglutide 2.4 mg in adults with obesity",
    finding: "14.9% mean body-weight reduction at 68 weeks versus 2.4% on placebo.",
    cite: "Wilding et al., New England Journal of Medicine, 2021",
    term: "semaglutide+STEP+1+obesity",
  },
  {
    area: "Weight",
    title: "SURMOUNT-1: tirzepatide in adults with obesity",
    finding: "Up to 20.9% mean reduction at 72 weeks at the 15 mg dose.",
    cite: "Jastreboff et al., New England Journal of Medicine, 2022",
    term: "tirzepatide+SURMOUNT-1+obesity",
  },
  {
    area: "Weight",
    title: "SURMOUNT-5: tirzepatide versus semaglutide",
    finding: "Head-to-head: 20.2% versus 13.7% mean reduction at 72 weeks.",
    cite: "New England Journal of Medicine, 2025",
    term: "tirzepatide+semaglutide+SURMOUNT-5",
  },
  {
    area: "Weight",
    title: "STEP 4: continuing versus withdrawing treatment",
    finding: "Withdrawal reversed most of the loss; continuing held it. The case for a maintenance dose.",
    cite: "Rubino et al., JAMA, 2021",
    term: "semaglutide+withdrawal+STEP+4",
  },
  {
    area: "Heart",
    title: "SELECT: cardiovascular outcomes with semaglutide",
    finding: "20% lower risk of major adverse cardiovascular events in adults with existing heart disease and overweight.",
    cite: "Lincoff et al., New England Journal of Medicine, 2023",
    term: "semaglutide+SELECT+cardiovascular+outcomes",
  },
  {
    area: "Hormones",
    title: "TRAVERSE: cardiovascular safety of testosterone therapy",
    finding: "Noninferior to placebo for major cardiac events in men with hypogonadism — the safety question that stalled TRT for years.",
    cite: "Lincoff et al., New England Journal of Medicine, 2023",
    term: "testosterone+TRAVERSE+cardiovascular",
  },
  {
    area: "Hair",
    title: "Combination therapy for androgenetic alopecia",
    finding: "Topical minoxidil plus oral finasteride outperformed either agent alone in men.",
    cite: "Journal of the American Academy of Dermatology",
    term: "finasteride+minoxidil+combination+androgenetic+alopecia",
  },
  {
    area: "Skin",
    title: "Topical tretinoin for photoaged skin",
    finding: "Randomised trials show improved fine wrinkling and pigmentation, with effects reversing after stopping.",
    cite: "Archives of Dermatology, photoaging trials",
    term: "tretinoin+photoaging+randomized",
  },
];

export const GUIDELINES = [
  {
    org: "Obesity Medicine Association",
    position:
      "Treats obesity as a chronic, relapsing disease. Pharmacotherapy is intended long term, not as a 12-week course, and stopping is a clinical decision with a planned exit.",
  },
  {
    org: "AACE / American College of Endocrinology",
    position:
      "Recommends treating to a target and continuing therapy that is working — escalating the dose before abandoning the molecule.",
  },
  {
    org: "The Endocrine Society",
    position:
      "Testosterone therapy requires baseline and follow-up haematocrit, PSA and symptom review. It is monitored treatment, not a one-off prescription.",
  },
  {
    org: "American Academy of Dermatology",
    position:
      "Androgenetic alopecia responds best to combination therapy and needs 6–12 months of consistent use before it is judged.",
  },
];

export const FIRST_QUESTIONS = [
  {
    question: "Two weeks in and the scale hasn't moved. Is it working?",
    tldr: "Yes — appetite changes before weight does.",
    detail:
      "The starting doses are deliberately below the therapeutic dose so your gut can adapt. Most of the early change is water and glycogen. The curve bends around weeks 4–12 as the dose steps up.",
  },
  {
    question: "The nausea hit on day three. Do I quit?",
    tldr: "Usually you hold the dose, not the treatment.",
    detail:
      "Nausea peaks right after each titration and settles over 3–7 days. Smaller, lower-fat meals and slower eating help. If it is stopping you eating or drinking, message your provider — the dose can be held or stepped back.",
  },
  {
    question: "Will I lose muscle while losing fat?",
    tldr: "Not if you eat protein and lift.",
    detail:
      "Some lean mass goes with any rapid weight loss. Protein at 1.2–1.6 g/kg and resistance training 2–3× a week shifts the ratio strongly in your favour. That is why both are in the plan, not a footnote.",
  },
  {
    question: "Do I have to stay on this forever?",
    tldr: "For as long as you want the result held.",
    detail:
      "STEP 4 showed that stopping reverses most of the loss. The realistic path is a lower maintenance dose, not zero. Some people taper and hold with habits; your provider plans that with you, on data.",
  },
  {
    question: "Can I choose the cheapest option and still be safe?",
    tldr: "Only if the paperwork follows the vial.",
    detail:
      "Compounded medication from an unverified source is the main safety failure in this market. What matters is a licensed pharmacy, a lot number, a certificate of analysis, and a clinician who reviews you — not the price alone.",
  },
  {
    question: "What does the certificate of analysis actually tell me?",
    tldr: "Identity, strength, purity and sterility for your lot.",
    detail:
      "It is the lab report for the batch your vial came from. It is not a guarantee of how you will respond — that depends on your dose, adherence and follow-up — but it is how you know what you injected is what the label says.",
  },
];

export const LAB_STEPS = [
  {
    step: "01",
    title: "Prescriber order",
    body: "A US-licensed clinician reviews your intake and writes a patient-specific order. Nothing is filled before that.",
  },
  {
    step: "02",
    title: "503A pharmacy fill",
    body: "A state-licensed compounding pharmacy prepares the lot and assigns a batch number to it.",
  },
  {
    step: "03",
    title: "Accredited lab release",
    body: "Identity, strength, purity and sterility are tested before the lot is released.",
  },
  {
    step: "04",
    title: "Lot on the vial",
    body: "Your batch number travels with the shipment. Ask for that lot's certificate any time.",
  },
];