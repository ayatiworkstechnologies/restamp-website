"use client";

import { Suspense, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home01Icon } from '@hugeicons/core-free-icons';
import { loginWithMobile } from '@/lib/profile';
import { LogIn, Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react';

// Static OTP until a real SMS service is connected
const DEMO_OTP = '123456';
const OTP_LENGTH = 6;

const roleLabels: Record<string, string> = {
  buyer: 'Buyer',
  owner: 'Owner',
  agent: 'Agent',
};

function LoginForm() {
  const router = useRouter();
  const role = useSearchParams().get('role') ?? '';
  const roleLabel = roleLabels[role];

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 0);
  };

  const changeOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const otpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const pasteOtp = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!digits) return;
    e.preventDefault();
    setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] ?? ''));
    otpRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('') !== DEMO_OTP) {
      setError('Incorrect OTP. Please try again.');
      return;
    }
    setError('');
    loginWithMobile(mobile, role);
    router.push('/profile');
  };

  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-8 shadow-[0_12px_45px_-10px_rgba(0,0,0,0.12)]">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-800 shadow-md">
        {step === 'mobile' ? <LogIn size={20} /> : <ShieldCheck size={20} />}
      </div>

      {step === 'mobile' ? (
        <form onSubmit={sendOtp}>
          <h1 className="text-center text-xl font-bold text-slate-900">
            {roleLabel ? `${roleLabel} Login` : 'Sign in with mobile'}
          </h1>
          <p className="mt-2 mb-6 text-center text-sm text-slate-500">
            Enter your mobile number and we&apos;ll send you a one-time password.
          </p>

          <label className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2.5 text-sm focus-within:ring-2 focus-within:ring-[#087ed9]/40">
            <Smartphone size={16} className="text-slate-400" />
            <span className="text-slate-600">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              placeholder="Mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition cursor-pointer"
          >
            Get OTP
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp}>
          <h1 className="text-center text-xl font-bold text-slate-900">Verify OTP</h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enter the 6-digit code sent to <span className="font-medium text-slate-800">+91 {mobile}</span>
          </p>

          <p className="mt-4 mb-5 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-700">
            Demo OTP: <span className="font-bold tracking-widest">{DEMO_OTP}</span>
          </p>

          <div className="flex justify-between gap-2" onPaste={pasteOtp}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`OTP digit ${i + 1}`}
                value={digit}
                onChange={(e) => changeOtp(i, e.target.value)}
                onKeyDown={(e) => otpKeyDown(i, e)}
                className="h-11 w-11 rounded-lg bg-slate-100 text-center text-lg font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-[#087ed9]/40"
              />
            ))}
          </div>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={otp.join('').length < OTP_LENGTH}
            className="mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Verify &amp; Login
          </button>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep('mobile');
                setError('');
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <ArrowLeft size={12} /> Change number
            </button>
            <button
              type="button"
              onClick={() => setOtp(Array(OTP_LENGTH).fill(''))}
              className="text-[#087ed9] hover:underline cursor-pointer"
            >
              Resend OTP
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-xl tracking-tight">
          <span className="p-1.5 bg-sky-50 rounded-lg text-[#087ed9] flex items-center justify-center">
            <HugeiconsIcon icon={Home01Icon} size={20} />
          </span>
          <span className="text-slate-900">
            Re<span className="text-[#087ed9]">stamp</span>
          </span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
