import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b1622] text-slate-400 pt-14 pb-8 border-t border-slate-800">
      <div className="container-site grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* Brand Column */}
        <div>
          <strong className="text-white text-2xl font-bold tracking-tight block">
            restamp<span className="text-[#087ed9]">.</span>
          </strong>
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

        {/* For property owners */}
        <div>
          <strong className="text-white text-sm font-semibold block mb-4">
            For property owners
          </strong>
          <div className="flex flex-col gap-2.5 text-xs">
            <Link href="/sell" className="hover:text-white transition">
              Post your property
            </Link>
            <Link href="/sell" className="hover:text-white transition">
              Sell your home
            </Link>
            <Link href="/sell" className="hover:text-white transition">
              Rent out your property
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

      {/* Bottom Copyright Strip */}
      <div className="container-site mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© 2026 Restamp. All rights reserved.</p>
        <p className="text-slate-400">Made for your next move.</p>
      </div>
    </footer>
  );
}