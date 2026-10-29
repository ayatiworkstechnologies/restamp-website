import Link from 'next/link';
import {
  ArrowRight,
  House,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchPanel from '@/components/home/SearchPanel';
import FeaturedHomesSection from '@/components/home/FeaturedHomesSection';

const categories = [
  { name: 'Buy a home', url: '/buy', img: '/images/cat-buy.jpg' },
  { name: 'Rent a home', url: '/rent', img: '/images/cat-rent.jpg' },
  { name: 'New projects', url: '/projects', img: '/images/cat-projects.jpg' },
  { name: 'Plots & land', url: '/buy', img: '/images/cat-plots.jpg' },
  { name: 'Commercial', url: '/buy', img: '/images/cat-commercial.jpg' },
  { name: 'Sell your property', url: '/sell', img: '/images/cat-sell.jpg' },
];

const chennaiLocalities = [
  {
    name: 'Anna Nagar',
    tag: 'Upscale & tree-lined avenues',
    img: '/images/locality-annanagar.jpg',
  },
  {
    name: 'Adyar',
    tag: 'Lush green South Chennai',
    img: '/images/locality-adyar.jpg',
  },
  {
    name: 'OMR (IT Corridor)',
    tag: 'Gated communities & tech parks',
    img: '/images/locality-omr.jpg',
  },
  {
    name: 'Besant Nagar',
    tag: 'Beachside & coastal living',
    img: '/images/locality-besantnagar.jpg',
  },
  {
    name: 'ECR (East Coast Road)',
    tag: 'Luxury villas & sea breeze',
    img: '/images/locality-ecr.jpg',
  },
  {
    name: 'Velachery',
    tag: 'Prime hub & metro connectivity',
    img: '/images/locality-velachery.jpg',
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section
          className="h-[460px] md:h-[500px] bg-cover bg-center flex items-start justify-center text-center pt-20 md:pt-24 relative overflow-hidden"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.48) 100%), url(/images/hero-bg.jpg)',
          }}
        >
          {/* Luminous Animated Radial Ambient Orbs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-ambient-glow delay-300" />


          <div className="text-white px-5 z-10 max-w-3xl mx-auto">
            <div className="animate-hero-fade-up inline-flex items-center gap-2 bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/25 text-sky-200 text-[11px] sm:text-xs font-bold tracking-[0.22em] px-3.5 py-1.5 rounded-full mb-4 shadow-sm transition">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              WELCOME TO RESTAMP
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.12] drop-shadow-md tracking-tight animate-hero-fade-up delay-150">
              Find your next home.
              <br />
              <span className="bg-gradient-to-r from-white via-sky-100 to-sky-200 bg-clip-text text-transparent">
                Make it your own.
              </span>
            </h1>
            <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-white/90 drop-shadow max-w-lg mx-auto font-normal leading-relaxed animate-hero-fade-up delay-300">
              A place to live. A space to grow. A home to love.
            </p>
          </div>
        </section>

        {/* Search Panel */}
        <div className="container-site animate-hero-fade-up delay-450">
          <SearchPanel />
          <p className="text-center text-[11px] text-slate-400 mt-5 font-medium tracking-wide">
            Buy · Rent · Resale · New projects · Commercial
          </p>
        </div>

        {/* Categories Section */}
        <section className="container-site py-16">
          <p className="eyebrow text-center">Whatever your next move, start here</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 mt-7">
            {categories.map((cat) => (
              <Link
                href={cat.url}
                key={cat.name}
                className="text-center group block hover-lift transition-all duration-300"
              >
                <div className="overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3] shadow-sm group-hover:shadow-xl group-hover:shadow-sky-500/15 transition-all duration-300 relative border border-slate-100">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <span className="text-xs font-semibold block mt-3 text-slate-700 group-hover:text-[#087ed9] transition-colors duration-200">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Home Journey Section */}
        <section className="container-site pb-20">
          <div className="text-center mb-8">
            <p className="eyebrow">Your home journey starts with the choices</p>
            <h2 className="section-title mt-2">
              Better places to live.
              <br />
              More possibilities to explore.
            </h2>
          </div>

          {/* Blueprint Banner Card matching Your-home-journey.png */}
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0074ce] shadow-xl text-white min-h-[440px] sm:min-h-[400px] md:min-h-[380px] lg:min-h-[420px] group">
            {/* High-resolution 2x background graphic with building cutout and blueprint grid */}
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-right bg-cover pointer-events-none group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              style={{
                backgroundImage: `url('/images/your-home-journey@2x.png')`,
              }}
            />

            {/* Top Right Floating Pill: Post property FREE */}
            <Link
              href="/sell"
              aria-label="Post property for free"
              className="absolute top-4 sm:top-6 lg:top-7 right-4 sm:right-7 lg:right-9 z-20 inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Post property</span>
              <span className="bg-[#00a862] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded tracking-wide animate-pulse">
                FREE
              </span>
            </Link>

            {/* Left Content Area */}
            <div className="relative z-10 flex flex-col justify-center h-full pt-16 pb-8 sm:py-8 md:py-10 lg:py-12 px-6 sm:px-8 md:px-10 lg:px-12 w-full max-w-full md:max-w-[55%] lg:max-w-[550px]">
              {/* Eyebrow badge with floating animation */}
              <div className="inline-block self-start mb-3 sm:mb-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md bg-[#005fb8]/60 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase backdrop-blur-xs">
                  <Sparkles size={11} className="text-sky-200" />
                  BUY A HOME
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.16]">
                Not just a property.
                <br />
                Your kind of place.
              </h3>

              {/* Subtitle */}
              <p className="text-white/90 text-xs sm:text-sm md:text-[15px] leading-relaxed mt-3 sm:mt-4 max-w-md font-normal">
                From your first apartment to a little more room for everyone.
                Find a home that fits the life you want to live.
              </p>

              {/* CTA Button */}
              <div className="mt-5 sm:mt-8">
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0074ce] hover:text-[#005fa8] text-xs sm:text-sm md:text-[15px] font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group/btn"
                >
                  <span>Explore homes to buy</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resale Properties Spotlight */}
        <FeaturedHomesSection />

        {/* Quick Links Banner */}
        <section className="bg-[#dff5ff]/80 py-8 border-y border-sky-100">
          <div className="container-site grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-7">
            {[
              ['What does your next move look like?', 'Start exploring'],
              ['A home of your own', 'Explore homes'],
              ['A fresh new start', 'Explore rentals'],
              ['Something brand new', 'Explore projects'],
            ].map(([a, b], i) => (
              <Link
                href={i === 2 ? '/rent' : i === 3 ? '/projects' : '/buy'}
                key={a}
                className="group border-r border-sky-200/80 last:border-0 pr-4 p-2.5 rounded-xl transition-all duration-200 hover:bg-white/70 hover:shadow-xs hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-100/90 flex items-center justify-center text-[#087ed9] group-hover:scale-110 group-hover:bg-[#087ed9] group-hover:text-white transition-all duration-200">
                  <House size={18} />
                </div>
                <h3 className="text-sm font-semibold mt-3 text-slate-800 group-hover:text-slate-900 transition-colors">
                  {a}
                </h3>
                <p className="text-xs text-[#087ed9] font-semibold mt-2 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                  {b} →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* New Projects & Communities */}
        <section className="container-site py-20">
          <p className="eyebrow">Built for a better tomorrow</p>
          <h2 className="section-title mt-2 mb-7">Discover new beginnings</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-sm group">
            <img
              src="/images/apartments.jpg"
              alt="New residential development"
              className="h-80 md:h-96 w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent flex items-end p-8 md:p-12">
              <div className="text-white max-w-lg">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-sky-200 text-xs px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                  <span className="tracking-wider font-bold">DISCOVER NEW PROJECTS</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">
                  A community you’ll love coming home to
                </h3>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-white underline underline-offset-4 hover:text-sky-200 transition group/btn"
                >
                  <span>Explore projects</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mt-14">
            <div className="overflow-hidden rounded-2xl shadow-sm group">
              <img
                src="/images/community.jpg"
                className="h-72 w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                alt="Residential community"
              />
            </div>
            <div>
              <p className="eyebrow">Rent a place</p>
              <h3 className="section-title mt-3">
                A new city.
                <br />
                The same feeling of home.
              </h3>
              <p className="text-sm text-slate-500 leading-7 mt-4">
                Close to work, close to your people, or just close to what matters.
                Your next rental is waiting to feel like home.
              </p>
              <Link
                href="/rent"
                className="inline-flex gap-2 items-center bg-[#087ed9] hover:bg-sky-600 text-white rounded-md px-5 py-3 mt-5 text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>Find a rental home</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

        {/* Explore Chennai Localities */}
        <section className="container-site pb-20">
          <p className="eyebrow">Find your corner of Chennai</p>
          <h2 className="section-title mt-2 mb-6">Explore popular localities</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {chennaiLocalities.map((loc) => (
              <Link
                href={'/buy?city=Chennai&locality=' + encodeURIComponent(loc.name)}
                key={loc.name}
                className="flex items-center gap-4 border border-[#f0f0f0] rounded-2xl p-4 sm:p-5 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1.5 transition-all duration-300 bg-white group min-h-[86px]"
              >
                <div className="overflow-hidden rounded-xl h-16 w-16 sm:h-17 sm:w-17 shrink-0">
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-[#087ed9] transition-colors duration-200 truncate">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {loc.tag}
                  </p>
                </div>
                <ArrowRight
                  size={17}
                  className="text-slate-400 group-hover:text-[#087ed9] group-hover:translate-x-1.5 transition-all duration-200 shrink-0"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Sell / Rent CTA */}
        <section className="container-site pb-20">
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden bg-[#e8f7ee] border border-emerald-100 group">
            <div className="overflow-hidden h-72 w-full">
              <img
                src="/images/cat-sell.jpg"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                alt="Handing over keys to new home"
              />
            </div>
            <div className="p-8 md:p-12 self-center">
              <p className="eyebrow text-emerald-800">Your property journey</p>
              <h2 className="section-title mt-3 text-slate-900">
                Your space.
                <br />
                Someone’s next chapter.
              </h2>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Put your property in the spotlight. Sell or rent with Restamp.
              </p>
              <Link
                href="/sell"
                className="inline-flex gap-2 items-center bg-[#087ed9] hover:bg-sky-600 text-white rounded-md px-5 py-3 mt-6 text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-0.5 active:translate-y-0 group/btn"
              >
                <span>Post your property for free</span>
                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </section>

        {/* Commercial Section */}
        <section className="container-site pb-20">
          <h2 className="section-title text-center mb-7">Room for your business to grow</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Own your next opportunity', '/images/commercial-1.jpg'],
              ['A space that works for you', '/images/commercial-2.jpg'],
            ].map(([title, img]) => (
              <Link href="/buy" key={title} className="group block hover-lift transition-all duration-300">
                <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-100">
                  <img
                    src={img}
                    alt={title}
                    className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-semibold mt-3 text-slate-800 group-hover:text-[#087ed9] group-hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">
                  <span>{title}</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust & Confidence Section */}
        <section className="container-site text-center pb-20">
          <p className="eyebrow">More than a property search</p>
          <h2 className="section-title mt-3">
            A little more confidence.
            <br />
            Every step of the way.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mt-10">
            {[
              [MapPin, 'Find what feels right'],
              [ShieldCheck, 'The details that matter'],
              [HeartHandshake, 'Your next move, simplified'],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof MapPin;
              return (
                <div
                  key={i}
                  className="group p-5 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-300 border border-transparent hover:border-slate-100"
                >
                  <span className="inline-flex p-4 rounded-full bg-sky-100 text-[#087ed9] group-hover:bg-[#087ed9] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <I size={22} />
                  </span>
                  <h3 className="text-sm font-semibold mt-4 text-slate-800 group-hover:text-[#087ed9] transition-colors">
                    {label as string}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2">
                    Explore your options with confidence and clarity.
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mobile App Download Section */}
        <section id="download-app" className="container-site pb-20">
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0074ce] shadow-xl text-white min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] group">
            {/* High-definition smartphone mockup graphic pinned cleanly as background */}
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-right bg-cover pointer-events-none group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              style={{
                backgroundImage: `url('/images/mobile-app@2x.webp')`,
                imageRendering: '-webkit-optimize-contrast',
              }}
            />

            {/* Floating Ratings Pill Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 absolute top-6 right-6 lg:right-10 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs text-white font-medium shadow-lg animate-float pointer-events-none">
              <span className="text-amber-300">★ 4.9</span>
              <span className="text-white/90">Rated by 25,000+ Verified Users</span>
            </div>

            {/* Readability gradient mask for smaller screens */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0074ce] via-[#0074ce]/95 to-[#0074ce]/40 sm:via-[#0074ce]/80 md:via-[#0074ce]/60 md:to-transparent lg:via-[#0074ce]/20 lg:to-transparent pointer-events-none" />

            {/* Left Content Area */}
            <div className="relative z-10 flex flex-col justify-center min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-full md:max-w-[52%] lg:max-w-[540px]">
              {/* Eyebrow / Subtitle */}
              <p className="text-white/90 text-xs sm:text-sm md:text-[15px] font-normal leading-relaxed">
                Take control of your home journey with ease — anywhere, anytime.
              </p>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-white tracking-tight leading-[1.15] mt-2 sm:mt-3">
                Download the Restamp
                <br />
                App today!
              </h2>

              {/* App Store & Google Play Badges - Responsive & Side by Side */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6">
                {/* Apple App Store */}
                <a
                  href="#download-ios"
                  aria-label="Download on the App Store"
                  className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/12 hover:bg-white/22 active:scale-95 backdrop-blur-md border border-white/25 hover:border-white/40 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-white transition-all duration-200 shadow-sm hover:shadow-lg shrink-0 group hover:scale-105"
                >
                  <svg
                    className="w-4.5 h-5.5 sm:w-5 sm:h-6 shrink-0 drop-shadow-xs"
                    viewBox="0 0 20 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.7045 12.7631C16.7166 11.8432 16.9669 10.9413 17.4321 10.1412C17.8972 9.34108 18.5621 8.66885 19.3648 8.18702C18.8548 7.47597 18.1821 6.89081 17.4 6.478C16.6178 6.0652 15.7479 5.83613 14.8592 5.80898C12.9635 5.61471 11.1258 6.91644 10.1598 6.91644C9.17506 6.91644 7.68776 5.82827 6.08616 5.86044C5.05021 5.89311 4.04059 6.18722 3.15568 6.7141C2.27077 7.24099 1.54075 7.98268 1.03674 8.86691C-1.14648 12.5573 0.482005 17.9809 2.57338 20.964C3.61975 22.4247 4.84264 24.0564 6.44279 23.9985C8.00863 23.9351 8.59344 23.0237 10.4835 23.0237C12.3561 23.0237 12.9048 23.9985 14.5374 23.9617C16.2176 23.9351 17.2762 22.4945 18.2859 21.02C19.0377 19.9792 19.6162 18.8288 20 17.6116C19.0238 17.2085 18.1908 16.5338 17.6048 15.6716C17.0187 14.8094 16.7056 13.7979 16.7045 12.7631Z"
                      fill="white"
                    />
                    <path
                      d="M13.6208 3.84713C14.5369 2.77343 14.9883 1.39335 14.879 0C13.4793 0.143519 12.1865 0.796596 11.258 1.82911C10.804 2.33351 10.4563 2.92033 10.2348 3.55601C10.0132 4.19168 9.92219 4.86375 9.96686 5.5338C10.6669 5.54084 11.3595 5.3927 11.9924 5.10054C12.6253 4.80838 13.1821 4.37982 13.6208 3.84713Z"
                      fill="white"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-[8.5px] sm:text-[9.5px] text-white/80 font-semibold block uppercase tracking-wider leading-none mb-0.5">
                      Download on the
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white block leading-tight whitespace-nowrap">
                      App Store
                    </span>
                  </div>
                </a>

                {/* Google Play Store */}
                <a
                  href="#download-android"
                  aria-label="Download on Google Play"
                  className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/12 hover:bg-white/22 active:scale-95 backdrop-blur-md border border-white/25 hover:border-white/40 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-white transition-all duration-200 shadow-sm hover:shadow-lg shrink-0 group hover:scale-105"
                >
                  <svg
                    className="w-4.5 h-5.5 sm:w-5 sm:h-6 shrink-0 drop-shadow-xs"
                    viewBox="0 0 21 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.80482 11.4617L0.0895996 22.0059C0.0905121 22.0078 0.090512 22.0106 0.0914244 22.0125C0.389807 23.1574 1.41179 24 2.62539 24C3.11083 24 3.56616 23.8656 3.95671 23.6305L3.98773 23.6118L14.9229 17.1593L9.80482 11.4617Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M19.6331 9.66619L19.624 9.65966L14.9028 6.86123L9.58391 11.7013L14.9219 17.1582L19.6176 14.3878C20.4406 13.9324 21 13.045 21 12.0223C21 11.0052 20.4489 10.1225 19.6331 9.66619Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M0.0894234 1.99331C0.0310244 2.21353 0 2.44494 0 2.68382V21.3163C0 21.5552 0.0310245 21.7866 0.0903359 22.0059L10.1386 11.7313L0.0894234 1.99331Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9.87657 11.9999L14.9044 6.85935L3.98192 0.383507C3.58499 0.139962 3.12145 -4.76837e-06 2.62597 -4.76837e-06C1.41237 -4.76837e-06 0.388558 0.844468 0.0901759 1.99034C0.0901759 1.99127 0.0892639 1.9922 0.0892639 1.99314L9.87657 11.9999Z"
                      fill="#34A853"
                    />
                  </svg>
                  <div className="text-left">
                    <span className="text-[8.5px] sm:text-[9.5px] text-white/80 font-semibold block uppercase tracking-wider leading-none mb-0.5">
                      Download on the
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white block leading-tight whitespace-nowrap">
                      Google Play
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="border-t border-slate-200">
          <div className="container-site py-8 flex flex-col sm:flex-row justify-between gap-4 sm:gap-5 items-start sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900 text-base sm:text-lg">
                The right address changes everything.
              </h2>
              <p className="text-xs text-slate-500 mt-1 sm:mt-2">
                Your next chapter starts with Restamp.
              </p>
            </div>
            <Link
              href="/buy"
              className="border border-slate-300 hover:border-slate-400 rounded-md px-5 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap transition"
            >
              Let’s find your home →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}