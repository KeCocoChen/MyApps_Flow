import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const questions = [
  {
    key: 'EI',
    question: 'At a party, you tend to…',
    a: { label: 'Talk to many people, even strangers', value: 'E' },
    b: { label: 'Stick with a few close people', value: 'I' },
  },
  {
    key: 'SN',
    question: 'You trust more…',
    a: { label: 'Facts and concrete details', value: 'S' },
    b: { label: 'Gut feelings and patterns', value: 'N' },
  },
  {
    key: 'TF',
    question: 'When making decisions you prioritize…',
    a: { label: 'Logic and fairness', value: 'T' },
    b: { label: 'Feelings and harmony', value: 'F' },
  },
  {
    key: 'JP',
    question: 'Your lifestyle is more…',
    a: { label: 'Planned and organized', value: 'J' },
    b: { label: 'Flexible and spontaneous', value: 'P' },
  },
];

// Introverted types → TikTok (passive discovery), Extroverted → Standard
function recommendFeed(mbti) {
  return mbti[0] === 'I' ? 'tiktok' : 'standard';
}

export default function MBTIOnboarding({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = questions[step];

  const pick = (value) => {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const mbti = [next.EI, next.SN, next.TF, next.JP].join('');
      onComplete(mbti, recommendFeed(mbti));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-background rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Quick Personality Quiz</p>
            <h2 className="text-lg font-bold mt-0.5">Customize your feed</h2>
          </div>
          <button onClick={onSkip} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 mb-6">
          {questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? 'bg-foreground' : 'bg-muted'}`} />
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-1">Question {step + 1} of {questions.length}</p>
        <h3 className="font-semibold text-base mb-5 leading-snug">{current.question}</h3>

        <div className="space-y-3">
          <button onClick={() => pick(current.a.value)}
                  className="w-full text-left px-4 py-3.5 rounded-xl border border-border hover:border-foreground hover:bg-muted/50 transition-all text-sm font-medium">
            {current.a.label}
          </button>
          <button onClick={() => pick(current.b.value)}
                  className="w-full text-left px-4 py-3.5 rounded-xl border border-border hover:border-foreground hover:bg-muted/50 transition-all text-sm font-medium">
            {current.b.label}
          </button>
        </div>

        <button onClick={onSkip} className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors">
          Skip and use standard feed
        </button>
      </div>
    </div>
  );
}