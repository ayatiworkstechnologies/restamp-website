import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-500">The page you requested could not be found.</p>
      <Link
        href="/"
        className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
