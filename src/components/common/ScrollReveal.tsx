'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Site-wide minimal motion: fades <main> sections up as they scroll into view.
 * Sections already on screen at load are shown immediately (no flash).
 * Disabled under prefers-reduced-motion via CSS.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('main section:not([data-reveal])'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-reveal', 'in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) {
        el.setAttribute('data-reveal', 'in');
      } else {
        el.setAttribute('data-reveal', '');
        io.observe(el);
      }
    }
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
