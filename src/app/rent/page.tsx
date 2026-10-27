import { redirect } from 'next/navigation';

export default function RentIndexPage() {
  redirect('/buy?purpose=Rent');
}