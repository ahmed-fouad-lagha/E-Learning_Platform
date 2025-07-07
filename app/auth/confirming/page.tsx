'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmingAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // This page should no longer be needed with the new auth flow
    // Redirect to dashboard immediately
    console.log('Confirming page accessed - redirecting to dashboard');
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
        <p className="text-gray-600">You&apos;re being redirected to your dashboard.</p>
      </div>
    </div>
  );
}
