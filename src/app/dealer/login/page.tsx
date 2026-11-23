import { redirect } from 'next/navigation';

// The separate dealer login page was removed; dealers sign in on the main login page.
export default async function DealerLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  redirect(next ? `/login?role=dealer&next=${encodeURIComponent(next)}` : '/login?role=dealer');
}
