'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
        <AuthDebugClient />
      </div>
    </div>
  );
}

function AuthDebugClient() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    // Check authentication state
    const checkAuth = async () => {
      try {
        // Check Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        const info = {
          hasSession: !!session,
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata?.provider,
            confirmed_at: session.user.confirmed_at,
            created_at: session.user.created_at
          } : null,
          accessToken: session?.access_token ? 'Present' : 'Missing',
          refreshToken: session?.refresh_token ? 'Present' : 'Missing',
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A',
          error: error?.message
        };
        
        setDebugInfo(info);
      } catch (err) {
        setDebugInfo({ error: err instanceof Error ? err.message : 'Unknown error' });
      }
    };
    
    checkAuth();
  }, []);
  
  if (!debugInfo) {
    return <div>Loading debug info...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Session Status</h2>
        <div className="space-y-2 text-sm">
          <div>Has Session: <span className={debugInfo.hasSession ? 'text-green-600' : 'text-red-600'}>{debugInfo.hasSession ? 'Yes' : 'No'}</span></div>
          <div>Access Token: <span className={debugInfo.accessToken === 'Present' ? 'text-green-600' : 'text-red-600'}>{debugInfo.accessToken}</span></div>
          <div>Refresh Token: <span className={debugInfo.refreshToken === 'Present' ? 'text-green-600' : 'text-red-600'}>{debugInfo.refreshToken}</span></div>
          <div>Expires At: {debugInfo.expiresAt}</div>
          {debugInfo.error && <div className="text-red-600">Error: {debugInfo.error}</div>}
        </div>
      </div>
      
      {debugInfo.user && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">User Info</h2>
          <div className="space-y-2 text-sm">
            <div>ID: {debugInfo.user.id}</div>
            <div>Email: {debugInfo.user.email}</div>
            <div>Provider: {debugInfo.user.provider}</div>
            <div>Confirmed At: {debugInfo.user.confirmed_at}</div>
            <div>Created At: {debugInfo.user.created_at}</div>
          </div>
        </div>
      )}
    </div>
  );
}
