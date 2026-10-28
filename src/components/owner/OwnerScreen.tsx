"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import PostPropertyWizard from '@/components/owner/PostPropertyWizard';
import { ownerPlans, type OwnerPlan } from '@/lib/ownerPlan';
import { getProfile } from '@/lib/profile';
import {
  Check,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Phone,
  Lock,
  Star,
  Home,
  Building2,
  Bed,
  Bath,
  Maximize2,
  CheckCircle2,
  ExternalLink,
  Tag,
  UploadCloud,
  ShieldCheck,
} from 'lucide-react';

/* Property types by intent */
const propertyOptions = {
  Sell: ['Apartment / Flat', 'Independent House / Villa', 'Builder Floor', 'Plot / Land'],
  Rent: ['Apartment / Flat', 'Independent House / Villa', 'Builder Floor', 'Studio / 1 RK'],
  Commercial: ['Office Space', 'Shop / Showroom', 'Commercial Land', 'Warehouse'],
};

const bhkQuickChips = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

type Intent = 'Sell' | 'Rent' | 'Commercial';

/* Animated counter component with viewport observer & smooth cubic ease-out */
function CountUp({
  start = 0,
  end,
  duration = 1800,
  prefix = '',
  suffix = '',
  decimals = 0,
  formatIndian = false,
}: {
  start?: number;
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatIndian?: boolean;
}) {
  const [count, setCount] = useState(start);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Trigger immediately if already in view
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (start === end) {
      setCount(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(start + easeOut * (end - start));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, start, end, duration]);

  const displayValue = formatIndian
    ? Math.floor(count).toLocaleString('en-IN')
    : decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toString();

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

const howItWorksData = [
  {
    step: '01',
    title: 'Enter specs & photos',
    description: 'Add your property type, locality, price, and upload clear smartphone photos.',
    icon: UploadCloud,
    numberColor: 'text-[#087ed9]',
  },
  {
    step: '02',
    title: 'Fast 24-hr verification',
    description: 'Our desk verifies listing authenticity to award the Verified Owner badge.',
    icon: ShieldCheck,
    numberColor: 'text-[#087ed9]',
  },
  {
    step: '03',
    title: 'Close deal directly',
    description: 'Receive calls from genuine buyers/tenants, schedule visits, and finalize with zero fees.',
    icon: CheckCircle2,
    numberColor: 'text-emerald-600',
  },
];

function HowItWorksSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Trigger immediately if already in view
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3600);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="grid md:grid-cols-3 gap-8 pt-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {howItWorksData.map((item, index) => {
        const isActive = activeStep === index;
        const Icon = item.icon;
        return (
          <div
            key={item.step}
            onMouseEnter={() => setActiveStep(index)}
            onClick={() => setActiveStep(index)}
            className={`group rounded-2xl p-6 -m-3 transition-all duration-500 cursor-pointer relative ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${
              isActive
                ? 'bg-slate-50/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] -translate-y-1'
                : 'hover:bg-slate-50/50 hover:-translate-y-0.5'
            }`}
            style={{ transitionDelay: `${index * 120}ms` }}
          >
            {/* Top track with animated progress line */}
            <div className="h-0.5 w-full bg-slate-200/80 rounded-full overflow-hidden relative mb-5">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  isActive
                    ? 'w-full bg-gradient-to-r from-[#087ed9] to-[#38bdf8]'
                    : 'w-10 bg-slate-300 group-hover:w-24 group-hover:bg-[#087ed9]/50'
                }`}
              />
            </div>

            {/* Header: Step Number & Micro-Icon */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold font-mono tracking-wider transition-colors duration-300 ${item.numberColor}`}
                >
                  {item.step}
                </span>
                {isActive && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#087ed9] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#087ed9]" />
                  </span>
                )}
              </div>

              {/* Minimal Animated Micro Icon */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-sky-50 text-[#087ed9] scale-110 shadow-2xs'
                    : 'bg-slate-50 text-slate-400 group-hover:text-[#087ed9] group-hover:bg-sky-50/60'
                }`}
              >
                <Icon size={16} strokeWidth={2.2} />
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-base font-bold mt-3 tracking-tight transition-colors duration-300 ${
                isActive ? 'text-slate-900' : 'text-slate-800 group-hover:text-[#087ed9]'
              }`}
            >
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function OwnerScreen() {
  const searchParams = useSearchParams();

  // URL query pre-fills (e.g. /owner?purpose=Rent or /sell?purpose=Rent)
  const queryPurpose = searchParams.get('purpose');

  // Fast-Start State matching reference design
  const [intent, setIntent] = useState<Intent>(
    queryPurpose === 'Rent' || queryPurpose === 'Lease' ? 'Rent' : 'Sell'
  );
  const [selectedType, setSelectedType] = useState<string>(propertyOptions.Sell[0]);
  const [selectedBhk, setSelectedBhk] = useState<string>('2 BHK');
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  // Plans category toggle
  const [planCategory, setPlanCategory] = useState<'Residential' | 'Commercial'>('Residential');

  // FAQ accordion open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-fill logged in user's phone if available
  useEffect(() => {
    const profile = getProfile();
    if (profile?.mobile) {
      setPhone(profile.mobile);
    }
  }, []);

  const handleIntentChange = (newIntent: Intent) => {
    setIntent(newIntent);
    setSelectedType(propertyOptions[newIntent][0]);
  };

  const handleStartPosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');

    const wizardEl = document.getElementById('owner-property-studio');
    if (wizardEl) {
      wizardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'Is listing a property completely free on Restamp?',
      a: 'Yes. Individual property owners can list residential or commercial properties completely free of cost with 0% brokerage. Your listing stays active for 30–60 days with direct inquiries from verified home seekers.',
    },
    {
      q: 'How does Restamp protect my phone number from spam?',
      a: 'We use number masking and buyer verification so your phone number is only shared with verified, genuine prospects — filtering out telemarketers and broker spam.',
    },
    {
      q: 'How quickly does my listing go live?',
      a: 'Our verification team reviews property details within 2 to 24 hours. Once verified, your listing goes live across search results and inquiry alerts.',
    },
    {
      q: 'Can I list both rental and resale properties?',
      a: 'Yes. You can post apartments, independent houses, villas, plots, office spaces, and commercial shops for sale, resale, rent, or lease.',
    },
    {
      q: 'What is the "Verified Owner" badge?',
      a: 'The Verified Owner tag confirms property ownership, reassuring buyers and tenants and typically generating 3x more direct responses.',
    },
    {
      q: 'Are assisted services available if I need help?',
      a: 'Yes. For owners who prefer a hands-off experience, our Gold and Titanium plans provide professional photography, relationship managers, and legal agreement drafting.',
    },
  ];

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* Top Subtle Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs py-2 px-4">
        <div className="container-site flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>0% Brokerage Property Listing Portal for Individual Owners</span>
          </div>
          <Link
            href="/owner/dashboard"
            className="text-slate-600 hover:text-[#087ed9] font-medium transition inline-flex items-center gap-1"
          >
            <span>Existing Owner Dashboard</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>

      {/* Hero Section — Matching Reference Architecture Banner & Floating Right Form */}
      <section className="container-site py-6 sm:py-8 md:py-10">
        <div
          className="relative rounded-[32px] md:rounded-[40px] overflow-hidden min-h-[580px] lg:min-h-[620px] flex items-center p-6 sm:p-10 md:p-12 lg:p-14 bg-slate-900 shadow-xl"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.75) 100%), linear-gradient(90deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.3) 55%, rgba(15, 23, 42, 0.5) 100%), url(/images/owner-hero-banner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="w-full grid gap-10 lg:grid-cols-12 items-center relative z-10">
            {/* Left Content (Bottom/Middle Aligned like Reference) */}
            <div className="lg:col-span-7 space-y-5 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/15 backdrop-blur-md border border-sky-400/30 px-3.5 py-1 text-xs font-semibold text-sky-200">
                <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                <span>Zero Brokerage Assurance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-sm">
                Discover and Your
                <br />
                <span className="text-[#38bdf8]">Perfect Dream Home</span>
              </h1>

              <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-md drop-shadow-xs font-normal">
                Whether you&apos;re looking to sell, rent, or lease your property, we&apos;re here to connect you directly with genuine seekers with zero brokerage.
              </p>

              {/* Minimal Trust Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-white/90">
                <div className="flex items-center gap-1.5 bg-sky-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/20">
                  <Check size={13} className="text-[#38bdf8]" />
                  <span>0% Brokerage</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sky-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/20">
                  <Check size={13} className="text-[#38bdf8]" />
                  <span>Direct WhatsApp Inquiries</span>
                </div>
                <div className="flex items-center gap-1.5 bg-sky-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/20">
                  <Check size={13} className="text-[#38bdf8]" />
                  <span>24h Verification</span>
                </div>
              </div>
            </div>

            {/* Right Side: Floating Crisp White Form Card (Website Colour Palette) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 md:p-8 shadow-2xl text-slate-900 border border-slate-100 max-w-md w-full ml-auto">
                <div className="mb-5">
                  <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight leading-snug">
                    Find your Best Property
                    <br />
                    <span className="text-[#087ed9]">what do you want!</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Please fill all the details.</p>
                </div>

                <form onSubmit={handleStartPosting} className="space-y-4">
                  {/* Field 1: Location / Intent */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      I want to
                    </label>
                    <div className="relative">
                      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 sm:py-3 text-sm transition focus-within:border-[#087ed9] focus-within:ring-2 focus-within:ring-[#087ed9]/20">
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-[#087ed9] shrink-0">
                            <Home size={13} />
                          </span>
                          <select
                            value={intent}
                            onChange={(e) => handleIntentChange(e.target.value as Intent)}
                            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer appearance-none"
                          >
                            <option value="Sell">Sell Property</option>
                            <option value="Rent">Rent Out Property</option>
                            <option value="Commercial">Commercial Lease</option>
                          </select>
                        </div>
                        <ChevronDown size={15} className="text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Field 2: Property Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Property Type
                    </label>
                    <div className="relative">
                      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 sm:py-3 text-sm transition focus-within:border-[#087ed9] focus-within:ring-2 focus-within:ring-[#087ed9]/20">
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-[#087ed9] shrink-0">
                            <Building2 size={13} />
                          </span>
                          <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer appearance-none"
                          >
                            {propertyOptions[intent].map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>
                        <ChevronDown size={15} className="text-slate-400 shrink-0 pointer-events-none" />
                      </div>
                    </div>

                    {/* Small Spec Chips */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {bhkQuickChips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setSelectedBhk(chip)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                            selectedBhk === chip
                              ? 'border-[#087ed9] bg-[#087ed9] text-white font-semibold shadow-xs'
                              : 'border-slate-200 bg-slate-50/80 text-slate-600 hover:border-[#087ed9]/50 hover:text-[#087ed9]'
                          }`}
                        >
                          <Bed size={11} className={selectedBhk === chip ? 'text-white' : 'opacity-70'} />
                          <span>{chip}</span>
                        </button>
                      ))}
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 bg-slate-50/80 text-slate-500">
                        <Bath size={11} className="opacity-70" />
                        <span>2 Bath</span>
                      </span>
                    </div>
                  </div>

                  {/* Field 3: Mobile Number / Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                      Your Mobile Number
                    </label>
                    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 sm:py-3 text-sm transition focus-within:border-[#087ed9] focus-within:ring-2 focus-within:ring-[#087ed9]/20">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-[#087ed9] shrink-0">
                        <Phone size={11} />
                      </span>
                      <span className="text-xs font-bold text-slate-700">+91</span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>
                    {phoneError && <p className="text-xs text-red-500 font-medium mt-1">{phoneError}</p>}
                  </div>

                  {/* Submit Button (Website Blue CTA Button) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#087ed9] hover:bg-[#0070c9] py-3.5 px-6 text-sm font-semibold text-white transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>Start Free Listing</span>
                      <ArrowRight size={15} />
                    </button>
                    <p className="text-center text-[11px] text-slate-400 mt-2">
                      Zero brokerage · Instant verification · 100% Free
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <CountUp prefix="₹" end={0} duration={1200} />
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Zero Brokerage</p>
              <p className="text-xs text-slate-400 mt-0.5">Save ₹40,000–₹2,00,000</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <CountUp end={15} duration={1600} suffix=" Days" />
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Average Closure</p>
              <p className="text-xs text-slate-400 mt-0.5">Direct seeker matches</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#087ed9] tracking-tight">
                <CountUp end={500000} duration={2000} formatIndian suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Active Seekers</p>
              <p className="text-xs text-slate-400 mt-0.5">Chennai &amp; metro hubs</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                <CountUp end={4.9} duration={1800} decimals={1} suffix=" / 5" />
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">Owner Rating</p>
              <p className="text-xs text-slate-400 mt-0.5">Over 18,000+ owners</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Restamp Difference — Bento Grid matching User Reference Design */}
      <section className="py-20 bg-[#eceef2] border-b border-slate-200/70">
        <div className="container-site">
          <div className="max-w-xl mb-12">
            <p className="eyebrow text-[#087ed9]">The Restamp Difference</p>
            <h2 className="section-title mt-1.5 text-slate-900">Why owners list with us</h2>
            <p className="mt-2 text-sm text-slate-500">
              A transparent, direct-to-buyer platform built to help you rent or sell faster.
            </p>
          </div>

          {/* Top Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {/* Card 1: Monthly voucher / Zero Brokerage Guarantee (Matching reference) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col justify-between group">
              <div className="h-48 sm:h-52 rounded-2xl bg-[#fafbfe] border border-slate-100/90 flex items-center justify-center overflow-hidden mb-7 relative p-5">
                {/* Horizontal ghost wireframe bars matching reference */}
                <div className="absolute inset-x-8 space-y-2.5 pointer-events-none opacity-45">
                  <div className="flex gap-2">
                    <div className="h-2 w-14 bg-slate-200 rounded-full" />
                    <div className="h-2 w-28 bg-slate-200 rounded-full" />
                  </div>
                  <div className="h-2 w-44 bg-slate-200 rounded-full" />
                  <div className="h-2 w-24 bg-slate-200 rounded-full" />
                  <div className="h-2 w-36 bg-slate-200 rounded-full" />
                  <div className="flex gap-2">
                    <div className="h-2 w-20 bg-slate-200 rounded-full" />
                    <div className="h-2 w-16 bg-slate-200 rounded-full" />
                  </div>
                </div>

                {/* Floating Dark Pill Tag with Restamp Blue highlight matching reference */}
                <div className="relative z-10 rounded-2xl bg-[#0c111d] text-white px-4 py-3.5 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.3)] border border-slate-800/90 flex items-center gap-3.5 max-w-[270px] w-full transform group-hover:scale-[1.03] transition duration-300">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#087ed9]/25 text-[#38bdf8]">
                    <Tag size={16} strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white tracking-wide truncate">0% Brokerage</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">
                      When you list &amp; close with direct buyers
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Zero Brokerage Guarantee</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Keep 100% of your deal amount. We never charge commission or hidden brokerage fees from property owners.
                </p>
              </div>
            </div>

            {/* Card 2: Multiple address / Direct Inquiries (Matching reference) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col justify-between group">
              <div className="h-48 sm:h-52 rounded-2xl bg-[#fafbfe] border border-slate-100/90 flex items-center justify-center overflow-hidden mb-7 relative p-5">
                {/* Halftone dot pattern in the top-right corner matching reference */}
                <div className="absolute top-3 right-3 opacity-30 pointer-events-none">
                  <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
                    <pattern id="dot-grid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.2" fill="#94a3b8" />
                    </pattern>
                    <rect width="68" height="68" fill="url(#dot-grid)" />
                  </svg>
                </div>

                {/* Stacked background address items matching reference */}
                <div className="absolute top-8 left-7 space-y-4 pointer-events-none opacity-60">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400">Address 1</span>
                    <div className="h-2 w-28 bg-slate-200/80 rounded-full mt-1.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400">Address 3</span>
                    <div className="h-2 w-20 bg-slate-200/80 rounded-full mt-1.5" />
                  </div>
                </div>

                {/* Foreground elevated dark card matching reference tilted address 2 */}
                <div className="relative z-10 ml-auto mr-1 mt-4 rounded-2xl bg-[#0c111d] text-white p-3.5 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.3)] border border-slate-800/90 max-w-[195px] w-full transform -rotate-2 group-hover:rotate-0 transition duration-300">
                  <p className="text-[11px] font-bold text-white tracking-wide">Address 2 · Direct Lead</p>
                  <div className="space-y-1.5 mt-2.5">
                    <div className="h-2 bg-gradient-to-r from-[#087ed9] to-[#38bdf8] rounded-full w-4/5" />
                    <div className="h-2 bg-slate-700/70 rounded-full w-3/5" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Direct Inquiries</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Ship inquiries seamlessly to your phone with direct calls and WhatsApp leads from verified home seekers.
                </p>
              </div>
            </div>

            {/* Card 3: 20+ brands / Partner Portals (Matching reference) */}
            <div className="rounded-[28px] sm:rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col justify-between group">
              <div className="h-48 sm:h-52 rounded-2xl bg-[#fafbfe] border border-slate-100/90 flex items-center justify-center overflow-hidden mb-7 relative p-4">
                {/* 4x3 Grid of brand / portal tiles matching reference */}
                <div className="grid grid-cols-4 gap-2.5 w-full max-w-[270px]">
                  {/* Row 1 */}
                  <div className="h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center text-[9px] font-extrabold tracking-wider shadow-2xs">
                    RESTAMP
                  </div>
                  <div className="h-9 rounded-xl bg-slate-100" />
                  <div className="h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-extrabold shadow-2xs">
                    99ac
                  </div>
                  <div className="h-9 rounded-xl bg-[#087ed9] text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                    MB
                  </div>

                  {/* Row 2 */}
                  <div className="h-9 rounded-xl bg-slate-100" />
                  <div className="h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                    RERA
                  </div>
                  <div className="h-9 rounded-xl bg-white border border-slate-200 text-rose-600 flex items-center justify-center text-[9px] font-bold shadow-2xs">
                    Housing
                  </div>
                  <div className="h-9 rounded-xl bg-slate-100" />

                  {/* Row 3 */}
                  <div className="h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                    WA
                  </div>
                  <div className="h-9 rounded-xl bg-slate-100" />
                  <div className="h-9 rounded-xl bg-slate-100" />
                  <div className="h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center text-[9px] font-bold shadow-2xs">
                    20+
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">20+ Partner Portals</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Discover buyer excellence across 20+ top real estate networks with verified owner syndication on Restamp.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 2 Wider Cards (Matching Security & Paylater in reference) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 mt-6 sm:mt-7">
            {/* Card 4 (5 cols): Security & PIN (Inspired by Security circular waves in reference) */}
            <div className="md:col-span-5 rounded-[28px] sm:rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col justify-between group">
              <div className="h-48 sm:h-52 rounded-2xl bg-[#fafbfe] border border-slate-100/90 flex items-center justify-center overflow-hidden mb-7 relative">
                {/* Concentric sonar ripples matching reference */}
                <div className="absolute h-72 w-72 rounded-full border border-slate-200/35 pointer-events-none" />
                <div className="absolute h-56 w-56 rounded-full border border-slate-200/55 pointer-events-none" />
                <div className="absolute h-40 w-40 rounded-full border border-slate-200/75 pointer-events-none" />
                <div className="absolute h-24 w-24 rounded-full border border-sky-300/60 pointer-events-none" />

                {/* Centered elevated white card with "Enter pin" and 4 cells matching reference */}
                <div className="relative z-10 bg-white rounded-2xl p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center gap-2 transform group-hover:scale-105 transition duration-300">
                  <span className="text-[11px] font-semibold text-slate-700 tracking-tight">Enter pin</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-800">
                      •
                    </span>
                    <span className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-800">
                      •
                    </span>
                    <span className="h-7 w-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-800">
                      •
                    </span>
                    <span className="h-7 w-7 rounded-lg bg-[#087ed9] border border-[#087ed9] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      •
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Security &amp; Privacy Shield</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Authorize your orders and inquiries confidently with encrypted phone masking for personalized privacy protection.
                </p>
              </div>
            </div>

            {/* Card 5 (7 cols): Paylater Option (Inspired by Paylater Option tabs in reference) */}
            <div className="md:col-span-7 rounded-[28px] sm:rounded-[32px] bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.07)] transition duration-300 flex flex-col justify-between group">
              <div className="h-48 sm:h-52 rounded-2xl bg-[#fafbfe] border border-slate-100/90 flex items-center justify-center overflow-hidden mb-7 relative p-4 sm:p-6">
                {/* Pill bar container holding 3 option cards matching reference */}
                <div className="bg-[#eceef2] rounded-3xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-3 max-w-lg w-full border border-slate-200/60 shadow-inner">
                  {/* Option 1: Selected Active Card (like $1,800 black card in reference, with Restamp Blue) */}
                  <div className="bg-[#0c111d] text-white rounded-2xl p-3 sm:p-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.25)] border border-slate-800 flex-1 transform -translate-y-0.5">
                    <p className="text-[10px] font-semibold text-[#38bdf8] uppercase tracking-wider">3 Month · Free</p>
                    <p className="text-base sm:text-lg font-extrabold text-white mt-0.5 tracking-tight">
                      ₹0 <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                    </p>
                  </div>

                  {/* Option 2: 6 Month / Gold */}
                  <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 text-slate-700 flex-1 shadow-2xs">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">6 Month</p>
                    <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 tracking-tight">
                      ₹1,999 <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                    </p>
                  </div>

                  {/* Option 3: 12 Month / VIP */}
                  <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 text-slate-700 flex-1 shadow-2xs">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">12 Month</p>
                    <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 tracking-tight">
                      ₹4,999 <span className="text-[10px] text-slate-400 font-normal">/ mo</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Paylater option</h3>
                <p className="mt-2 text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  Shop now, pay later! Enjoy flexible listing validity: 0% free active ad, or assisted closing options for hassle-free convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Simple Steps */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-site">
          <div className="max-w-xl mb-12">
            <p className="eyebrow text-[#087ed9]">Process</p>
            <h2 className="section-title mt-1.5 text-slate-900">How it works</h2>
            <p className="mt-2 text-sm text-slate-500">Three straightforward steps to close your deal.</p>
          </div>

          <HowItWorksSteps />
        </div>
      </section>

      {/* Integrated Property Posting Studio (The Wizard) */}
      <section id="owner-property-studio" className="py-16 md:py-20 bg-slate-50/50 border-b border-slate-100 scroll-mt-20">
        <div className="container-site">
          <div className="mb-8">
            <p className="eyebrow text-[#087ed9]">Property Studio</p>
            <h2 className="section-title mt-1.5 text-slate-900">Complete your property listing</h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide accurate location, specifications, and pricing below to publish your listing.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
            <PostPropertyWizard
              initialPurpose={intent === 'Commercial' ? 'Lease' : intent}
              initialCategory={intent === 'Commercial' ? 'Commercial' : 'Residential'}
              initialPropertyType={selectedType}
              initialPhone={phone}
              doneHref="/owner/dashboard"
              doneLabel="Go to Owner Dashboard"
            />
          </div>
        </div>
      </section>

      {/* Owner Plans */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="eyebrow text-[#087ed9]">Assistance Plans</p>
              <h2 className="section-title mt-1.5 text-slate-900">Upgrade when you need extra reach</h2>
            </div>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              {(['Residential', 'Commercial'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPlanCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    planCategory === cat ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ownerPlans[planCategory].map((p: OwnerPlan) => (
              <div
                key={p.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition border ${
                  p.popular
                    ? 'border-[#087ed9] bg-white shadow-sm ring-1 ring-[#087ed9]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    {p.popular && (
                      <span className="text-[10px] font-bold text-[#087ed9] uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {p.price === 0 ? 'Free' : `₹${p.price.toLocaleString('en-IN')}`}
                    </span>
                    {p.price > 0 && <span className="text-xs text-slate-400 font-medium">+ GST</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{p.priceSub1}</p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check size={14} className="text-[#087ed9] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/owner/plans"
                    className={`w-full py-2.5 rounded-xl text-center text-xs font-semibold block transition ${
                      p.popular
                        ? 'bg-[#087ed9] hover:bg-[#0070c9] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {p.price === 0 ? 'Use Free Plan' : 'Select Plan'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 bg-slate-50/60">
        <div className="container-site max-w-2xl">
          <div className="mb-10 text-center">
            <p className="eyebrow text-[#087ed9]">FAQ</p>
            <h2 className="section-title mt-1.5 text-slate-900">Common questions</h2>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="rounded-xl border border-slate-200/80 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-slate-900 hover:text-[#087ed9] transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
