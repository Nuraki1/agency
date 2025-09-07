// File: src/app/components/ViewProfilesButton.tsx
'use client';

import { useRouter } from 'next/navigation';

interface ViewProfilesButtonProps {
  className?: string;
}

export default function ViewProfilesButton({ className = '' }: ViewProfilesButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/customers')}
      className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ${className}`}
    >
      View Existing Profiles
    </button>
  );
}