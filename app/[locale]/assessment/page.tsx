'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import WhatsAppButton from '@/components/WhatsAppButton';

type Answers = Record<number, string>;

function determineProfile(answers: Answers): 'ready' | 'almost' | 'builder' {
  const hasExperience = answers[1] === 'a';
  const english = answers[3]; // a=basic, b=intermediate, c=advanced
  if (english === 'c' && hasExperience) return 'ready';
  if (english === 'b' || (english === 'c' && !hasExperience) || (english === 'a' && hasExperience)) return 'almost';
  return 'builder';
}

export default function AssessmentPage() {
  const t = useTranslations('assessment');
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      q: t('q1'),
      options: [{ key: 'a', label: t('q1_a') }, { key: 'b', label: t('q1_b') }],
    },
    {
      q: t('q2'),
      options: [
        { key: 'a', label: t('q2_a') }, { key: 'b', label: t('q2_b') },
        { key: 'c', label: t('q2_c') }, { key: 'd', label: t('q2_d') },
        { key: 'e', label: t('q2_e') },
      ],
    },
    {
      q: t('q3'),
      options: [
        { key: 'a', label: t('q3_a') }, { key: 'b', label: t('q3_b') },
        { key: 'c', label: t('q3_c') },
      ],
    },
    {
      q: t('q4'),
      options: [
        { key: 'a', label: t('q4_a') }, { key: 'b', label: t('q4_b') },
        { key: 'c', label: t('q4_c') },
      ],
    },
    {
      q: t('q5'),
      options: [
        { key: 'a', label: t('q5_a') }, { key: 'b', label: t('q5_b') },
        { key: 'c', label: t('q5_c') },
      ],
    },
  ];

  const totalSteps = questions.length;
  const currentQ = step - 1; // step 0 = data capture, step 1-5 = questions

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStep(1);
  };

  const handleSelect = (key: string) => setSelected(key);

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [currentQ + 1]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Last question — determine profile and redirect
      setLoading(true);
      const profile = determineProfile(newAnswers);

      try {
        await fetch('/api/brevo/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, profile }),
        });
      } catch {
        // Email failure is non-blocking
      }

      router.push(`/assessment/result?profile=${profile}&name=${encodeURIComponent(name)}`);
    }
  };

  const handleBack = () => {
    if (step === 1) { setStep(0); return; }
    const prev = answers[currentQ] ?? null;
    setSelected(prev);
    setStep(step - 1);
  };

  // ── Step 0: data capture ──
  if (step === 0) {
    return (
      <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
        <div className="w-full max-w-md">
          <p className="text-[#C9963A] text-[11px] font-semibold tracking-[0.18em] uppercase mb-4 font-[family-name:var(--font-dm-sans)] text-center">
            Brazil Abroad
          </p>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-[#1a1a1a] text-center mb-2">
            {t('step0_title')}
          </h1>
          <p className="text-[#777] text-sm text-center mb-10 font-[family-name:var(--font-dm-sans)]">
            {t('subtitle')}
          </p>

          <form onSubmit={handleStart} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t('step0_name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#e8e0d0] rounded-[10px] px-4 py-3.5 text-[#1a1a1a] text-sm bg-white outline-none focus:border-[#1A4A6B] transition-colors font-[family-name:var(--font-dm-sans)]"
            />
            <input
              type="email"
              placeholder={t('step0_email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#e8e0d0] rounded-[10px] px-4 py-3.5 text-[#1a1a1a] text-sm bg-white outline-none focus:border-[#1A4A6B] transition-colors font-[family-name:var(--font-dm-sans)]"
            />
            <button
              type="submit"
              className="w-full bg-[#1A4A6B] text-white font-medium py-4 rounded-full mt-2 hover:bg-[#153d5a] transition-colors font-[family-name:var(--font-dm-sans)]"
            >
              {t('step0_cta')}
            </button>
          </form>
        </div>
        <WhatsAppButton />
      </main>
    );
  }

  const question = questions[currentQ];

  // ── Steps 1–5: questions ──
  return (
    <main className="min-h-screen bg-[#FDFAF4] flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#777] mb-2 font-[family-name:var(--font-dm-sans)]">
            <span>{step} / {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#e8e0d0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1A4A6B] rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#1a1a1a] mb-8 leading-snug">
          {question.q}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-10">
          {question.options.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full text-left px-5 py-4 rounded-[10px] border text-sm font-[family-name:var(--font-dm-sans)] transition-all ${
                selected === key
                  ? 'border-[#1A4A6B] bg-[#1A4A6B] text-white'
                  : 'border-[#e8e0d0] bg-white text-[#1a1a1a] hover:border-[#1A4A6B]/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 border border-[#e8e0d0] text-[#777] py-3.5 rounded-full text-sm font-[family-name:var(--font-dm-sans)] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
          >
            {t('back')}
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || loading}
            className="flex-2 flex-grow bg-[#1A4A6B] text-white py-3.5 rounded-full text-sm font-medium font-[family-name:var(--font-dm-sans)] disabled:opacity-40 hover:bg-[#153d5a] transition-colors"
          >
            {loading ? '...' : step === totalSteps ? t('finish') : t('next')}
          </button>
        </div>

      </div>
      <WhatsAppButton />
    </main>
  );
}
