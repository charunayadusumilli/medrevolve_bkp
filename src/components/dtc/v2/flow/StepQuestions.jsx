import React from 'react';

const QUESTIONS = [
  { key: 'age', q: 'What is your age range?', options: ['18–29', '30–44', '45–59', '60+'] },
  { key: 'experience', q: 'Have you tried treatment for this before?', options: ['Yes, currently', 'Yes, in the past', 'No, first time'] },
  { key: 'priority', q: 'What matters most to you?', options: ['Visible progress', 'Lowest price', 'Convenience'] },
];

export default function StepQuestions({ answers, setAnswers, onNext }) {
  const done = QUESTIONS.every((q) => answers[q.key]);
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display text-4xl sm:text-5xl text-dtc-text text-center mb-10">A little about you</h1>
      <div className="space-y-8">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="font-medium text-dtc-text mb-3">{q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => (
                <button key={o} onClick={() => setAnswers({ ...answers, [q.key]: o })}
                  className={`rounded-full px-5 py-2.5 text-sm border transition-colors ${answers[q.key] === o ? 'bg-mr-ink text-white border-dtc-text' : 'bg-dtc-surface border-dtc-text/15 text-dtc-text hover:border-dtc-text'}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button disabled={!done} onClick={onNext}
        className="mt-10 w-full rounded-full bg-mr-ink hover:bg-mr-forest disabled:opacity-30 text-white font-medium py-4 transition-colors">
        See my options
      </button>
      <p className="text-xs text-dtc-text/65 text-center mt-3">Your provider will confirm your full health history during your visit.</p>
    </div>
  );
}