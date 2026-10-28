import { redirect } from 'next/navigation';

export default async function RentIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  if (params?.role === 'owner' || params?.owner === 'true') {
    redirect('/sell?purpose=Rent');
  }
  redirect('/buy?purpose=Rent');
}