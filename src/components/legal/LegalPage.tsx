import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export type LegalSection = { id: string; title: string; body: React.ReactNode };

export default function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  effectiveDate?: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="border-b border-slate-100 bg-gradient-to-br from-sky-50 to-white">
          <div className="container-site py-12 sm:py-16">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="section-title mt-2">{title}</h1>
            <p className="mt-3 text-sm text-slate-500">
              {effectiveDate ? `Effective Date: ${effectiveDate} · Last Updated: ${updated}` : `Last updated: ${updated}`}
            </p>
          </div>
        </section>

        <div className="container-site grid gap-8 py-10 sm:py-14 lg:grid-cols-[240px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-4">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">On this page</p>
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-sky-50 hover:text-[#087ed9]">
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          <article className="rounded-2xl border border-slate-100 bg-white p-6 sm:p-10 text-[15px] leading-7 text-slate-600">
            {intro && (
              <div className="space-y-3 text-slate-700 [&_a]:text-[#087ed9] [&_a]:underline [&_a]:underline-offset-2">
                {intro}
              </div>
            )}
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="mt-8 scroll-mt-24">
                <h2 className="text-lg font-bold text-slate-900">
                  {/^\d/.test(s.title) ? s.title : `${i + 1}. ${s.title}`}
                </h2>
                <div className="mt-2 space-y-3 [&_a]:text-[#087ed9] [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mt-4 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-slate-900 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                  {s.body}
                </div>
              </section>
            ))}
            <p className="mt-10 border-t border-slate-100 pt-6 text-sm">
              Questions? <Link href="/contact" className="font-semibold text-[#087ed9] hover:underline">Contact our team</Link>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
