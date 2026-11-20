import PropertyDetailsLoader from '@/components/property/PropertyDetailsLoader';

// Listings come from the backend at request time (GET /buyer/listings/{id}),
// so there are no build-time pages for the old local catalogue ids.
export const metadata = {
  title: 'Property Details | Restamp',
  description: 'Verified property details and direct owner contact on Restamp.',
};

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyDetailsLoader id={id} />;
}
