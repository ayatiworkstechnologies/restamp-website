"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DealerEarningsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dealer/dashboard');
  }, [router]);

  return null;
}
