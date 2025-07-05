'use client';

import { useSearchParams } from 'next/navigation';

export default function ThankyouDelivery() {
  const searchParams = useSearchParams();
  const eta = searchParams.get('eta') || "45-60 minutes";

  return (
    <span className="font-semibold text-gray-800">{eta}</span>
  );
}
