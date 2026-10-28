import Link from 'next/link';
import {
  ArrowRight,
  House,
  MapPin,
  ShieldCheck,
  HeartHandshake,
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
          className="h-[440px] md:h-[480px] bg-cover bg-center flex items-start justify-center text-center pt-24 relative"
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%), url(/images/hero-bg.jpg)',
          }}
        >
          <div className="text-white px-5 z-10">
            <p className="text-xs font-semibold tracking-[0.25em] mb-4 text-sky-200">
              WELCOME TO RESTAMP
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
              Find your next home.
              <br />
              Make it your own.
            </h1>
            <p className="mt-4 text-sm text-white/90 drop-shadow">
              A place to live. A space to grow. A home to love.
            </p>
          </div>
        </section>

        {/* Search Panel */}
        <div className="container-site">
          <SearchPanel />
          <p className="text-center text-[11px] text-slate-400 mt-5">
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
                className="text-center group block"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100 aspect-[4/3] shadow-sm group-hover:shadow-md transition">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <span className="text-xs font-semibold block mt-3 text-slate-700 group-hover:text-[#087ed9] transition">
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
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0074ce] shadow-xl text-white">
            {/* Architectural blueprint grid background texture */}
            <div
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 sm:opacity-50"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.16) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.16) 1px, transparent 1px)
                `,
                backgroundSize: '36px 36px',
              }}
            />

            {/* Background graphic with modern building cutout */}
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-right bg-cover pointer-events-none"
              style={{ backgroundImage: `url('/images/your-home-journey.png')` }}
            />

            {/* Readability gradient for mobile and medium screens */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0074ce] via-[#0074ce]/95 to-transparent sm:via-[#0074ce]/80 md:via-[#0074ce]/40 pointer-events-none" />

            {/* Interactive 'Post property FREE' link overlay */}
            <Link
              href="/owner"
              aria-label="Post property for free"
              className="absolute top-4 sm:top-6 lg:top-7 right-4 sm:right-7 lg:right-9 z-20 inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Post property</span>
              <span className="bg-[#00a862] text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded tracking-wide">
                FREE
              </span>
            </Link>

            {/* Left Content Area */}
            <div className="relative z-10 flex flex-col justify-center min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] p-6 sm:p-10 md:p-12 lg:p-14 max-w-xl">
              {/* Eyebrow badge */}
              <div className="inline-block self-start mb-4 sm:mb-5">
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-[#005fb8]/60 border border-white/20 text-white text-[11px] font-bold tracking-[0.18em] uppercase backdrop-blur-xs">
                  BUY A HOME
                </span>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.14]">
                Not just a property.
                <br />
                Your kind of place.
              </h3>

              {/* Subtitle */}
              <p className="text-white/90 text-sm sm:text-[15px] leading-relaxed mt-4 max-w-md font-normal">
                From your first apartment to a little more room for everyone.
                Find a home that fits the life you want to live.
              </p>

              {/* CTA Button */}
              <div className="mt-6 sm:mt-8">
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#0074ce] hover:text-[#005fa8] text-sm sm:text-[15px] font-bold px-6 sm:px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
                >
                  <span>Explore homes to buy</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resale Properties Spotlight */}
        <FeaturedHomesSection />

        {/* Quick Links Banner */}
        <section className="bg-[#dff5ff] py-8">
          <div className="container-site grid grid-cols-2 md:grid-cols-4 gap-7">
            {[
              ['What does your next move look like?', 'Start exploring'],
              ['A home of your own', 'Explore homes'],
              ['A fresh new start', 'Explore rentals'],
              ['Something brand new', 'Explore projects'],
            ].map(([a, b], i) => (
              <Link
                href={i === 2 ? '/rent' : i === 3 ? '/projects' : '/buy'}
                key={a}
                className="border-r border-sky-200 last:border-0 pr-4"
              >
                <House size={19} color="#087ed9" />
                <h3 className="text-sm font-semibold mt-3 text-slate-800">{a}</h3>
                <p className="text-xs text-[#087ed9] font-medium mt-2">{b} →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* New Projects & Communities */}
        <section className="container-site py-20">
          <p className="eyebrow">Built for a better tomorrow</p>
          <h2 className="section-title mt-2 mb-7">Discover new beginnings</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-sm">
            <img
              src="/images/apartments.jpg"
              alt="New residential development"
              className="h-80 md:h-96 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex items-end p-8 md:p-12">
              <div className="text-white max-w-lg">
                <p className="text-xs tracking-wider font-semibold text-sky-300">
                  DISCOVER NEW PROJECTS
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mt-2">
                  A community you’ll love coming home to
                </h3>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-white underline underline-offset-4 hover:text-sky-200 transition"
                >
                  Explore projects <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mt-14">
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <img
                src="/images/community.jpg"
                className="h-72 w-full object-cover hover:scale-105 transition duration-300"
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
                className="inline-flex gap-2 items-center bg-[#087ed9] hover:bg-sky-600 text-white rounded-md px-5 py-3 mt-5 text-xs font-semibold transition shadow-sm"
              >
                Find a rental home <ArrowRight size={14} />
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
                className="flex items-center gap-4 border border-[#f0f0f0] rounded-2xl p-4 sm:p-5 hover:border-sky-300 transition bg-white group min-h-[86px]"
              >
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="h-16 w-16 sm:h-17 sm:w-17 object-cover rounded-xl shrink-0 group-hover:scale-105 transition duration-300"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-[#087ed9] transition truncate">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {loc.tag}
                  </p>
                </div>
                <ArrowRight
                  size={17}
                  className="text-slate-400 group-hover:text-[#087ed9] group-hover:translate-x-1 transition duration-200 shrink-0"
                />
              </Link>
            ))}
          </div>
        </section>

        {/* Sell / Rent CTA */}
        <section className="container-site pb-20">
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden bg-[#e8f7ee] border border-emerald-100">
            <img
              src="/images/cat-sell.jpg"
              className="h-72 w-full object-cover"
              alt="Handing over keys to new home"
            />
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
                className="inline-flex gap-2 items-center bg-[#087ed9] hover:bg-sky-600 text-white rounded-md px-5 py-3 mt-6 text-xs font-semibold transition shadow-sm"
              >
                Post your property for free <ArrowRight size={14} />
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
              <Link href="/buy" key={title} className="group block">
                <div className="overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={img}
                    alt={title}
                    className="h-60 w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <h3 className="font-semibold mt-3 text-slate-800 group-hover:text-[#087ed9] transition">
                  {title} ↗
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
          <div className="grid md:grid-cols-3 gap-10 mt-10">
            {[
              [MapPin, 'Find what feels right'],
              [ShieldCheck, 'The details that matter'],
              [HeartHandshake, 'Your next move, simplified'],
            ].map(([Icon, label], i) => {
              const I = Icon as typeof MapPin;
              return (
                <div key={i}>
                  <span className="inline-flex p-4 rounded-full bg-sky-100 text-[#087ed9]">
                    <I size={22} />
                  </span>
                  <h3 className="text-sm font-semibold mt-4 text-slate-800">
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

        {/* Bottom Banner */}
        <section className="border-t border-slate-200">
          <div className="container-site py-8 flex justify-between gap-5 items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                The right address changes everything.
              </h2>
              <p className="text-xs text-slate-500 mt-2">
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