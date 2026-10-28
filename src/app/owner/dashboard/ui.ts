export const card = 'rounded-2xl border border-slate-100 bg-white shadow-[0_3px_18px_#15223d06]';
export const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
