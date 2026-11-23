import { redirect } from 'next/navigation';

// Account deletion now lives in the Privacy Policy; keep this address working
// (e.g. for app store listings) by sending visitors to that section.
export default function AccountDeletionPage() {
  redirect('/privacy-policy#delete-account');
}
