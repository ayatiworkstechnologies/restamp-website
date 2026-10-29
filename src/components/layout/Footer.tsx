import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#0b1622] text-slate-400 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 md:pb-12 border-t border-slate-800">
      <div className="container-site grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-sm pb-12 sm:pb-16 md:pb-18">
        {/* Brand Column */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-white font-bold tracking-tight text-2xl group"
          >
            <Image
              src="/restamp-logo-white.svg"
              alt="Restamp Logo"
              width={34}
              height={34}
              className="h-8.5 w-8.5 object-contain"
            />
            <span className="text-white font-bold text-2xl tracking-tight">
              Re<span className="text-[#087ed9]">stamp</span>
            </span>
          </Link>
          <p className="mt-3.5 text-xs text-slate-400 leading-relaxed max-w-xs">
            A new chapter starts with the right address.
          </p>
          <Link
            href="/#download-app"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white mt-5 transition font-medium"
          >
            <span>Explore the Restamp app</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Find your property */}
        <div>
          <strong className="text-white text-sm font-semibold block mb-4">
            Find your property
          </strong>
          <div className="flex flex-col gap-2.5 text-xs">
            <Link href="/buy" className="hover:text-white transition">
              Property for sale
            </Link>
            <Link href="/rent" className="hover:text-white transition">
              Property for rent
            </Link>
            <Link href="/projects" className="hover:text-white transition">
              New residential projects
            </Link>
            <Link href="/saved" className="hover:text-white transition">
              Your saved properties
            </Link>
          </div>
        </div>

        {/* For owners & agents */}
        <div>
          <strong className="text-white text-sm font-semibold block mb-4">
            Owners &amp; Agents
          </strong>
          <div className="flex flex-col gap-2.5 text-xs">
            <Link href="/sell" className="hover:text-white transition">
              Post property (Property Studio)
            </Link>
            <Link href="/owner" className="hover:text-white transition">
              Owner portal
            </Link>
            <Link href="/agent" className="hover:text-white transition">
              Agent partner hub
            </Link>
            <Link href="/agent/dashboard" className="hover:text-white transition">
              Broker deal console
            </Link>
          </div>
        </div>

        {/* Explore Chennai Localities */}
        <div>
          <strong className="text-white text-sm font-semibold block mb-4">
            Explore Chennai
          </strong>
          <div className="flex flex-col gap-2.5 text-xs">
            <Link href="/buy?locality=Alwarpet" className="hover:text-white transition">
              Alwarpet
            </Link>
            <Link href="/buy?locality=Velachery" className="hover:text-white transition">
              Velachery
            </Link>
            <Link href="/buy?locality=Anna Nagar" className="hover:text-white transition">
              Anna Nagar
            </Link>
            <Link href="/buy?locality=ECR" className="hover:text-white transition">
              ECR Beach Road
            </Link>
            <Link href="/buy?locality=OMR" className="hover:text-white transition">
              OMR IT Corridor
            </Link>
          </div>
        </div>
      </div>

      {/* Horizontal Divider Line */}
      <div className="container-site">
        <div className="border-t border-slate-800/80 w-full" />
      </div>

      {/* Bottom Copyright Strip */}
      <div className="container-site pt-8 pb-2 text-center text-xs text-slate-400">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span>Copyright @ 2026 by Restamp - All Right Reserved</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span>
            Design &amp; Developed by{' '}
            <a
              href="https://ayatiworks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition font-medium underline underline-offset-2 decoration-slate-600 hover:decoration-white"
            >
              Ayatiworks
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}