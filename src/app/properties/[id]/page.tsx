import { notFound } from 'next/navigation';
import PropertyDetailsView from '@/components/property/PropertyDetailsView';
import { getPropertyById, properties } from '@/data/properties';

export async function generateStaticParams() {
  return properties.map((p) => ({
    id: p.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) {
    return { title: 'Property Not Found | Restamp' };
  }
  return {
    title: `${property.name} - ${property.price} | Restamp`,
    description: property.description,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetailsView property={property} />;
}
