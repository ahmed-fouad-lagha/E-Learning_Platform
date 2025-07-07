'use client';

import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function QuickDebugPage() {
  const { user, profile, session, loading } = useAuth();
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [timestamp, setTimestamp] = useState(new Date().toISOString());

  useEffect(() => {
    // Check direct Supabase session
    const checkSupabaseSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseSession(session);
    };
    
    checkSupabaseSession();
  }, []);

  const refreshAll = async () => {
    setTimestamp(new Date().toISOString());
    const { data: { session } } = await supabase.auth.getSession();
    setSupabaseSession(session);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quick Auth Debug</h1>
          <button 
            onClick={refreshAll}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Last updated: {timestamp}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auth Context State */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Auth Context State</h2>
            <div className="space-y-2">
              <div>Loading: <span className={loading ? 'text-yellow-600' : 'text-green-600'}>{loading ? 'True' : 'False'}</span></div>
              <div>User: <span className={user ? 'text-green-600' : 'text-red-600'}>{user ? 'Present' : 'Missing'}</span></div>
              <div>Profile: <span className={profile ? 'text-green-600' : 'text-red-600'}>{profile ? 'Present' : 'Missing'}</span></div>
              <div>Session: <span className={session ? 'text-green-600' : 'text-red-600'}>{session ? 'Present' : 'Missing'}</span></div>
              
              {user && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="font-medium">User Details:</div>
                  <div>ID: {user.id}</div>
                  <div>Email: {user.email}</div>
                  <div>Provider: {user.app_metadata?.provider}</div>
                </div>
              )}
            </div>
          </div>

          {/* Direct Supabase Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Direct Supabase Session</h2>
            <div className="space-y-2">
              <div>Session: <span className={supabaseSession ? 'text-green-600' : 'text-red-600'}>{supabaseSession ? 'Present' : 'Missing'}</span></div>
              <div>Access Token: <span className={supabaseSession?.access_token ? 'text-green-600' : 'text-red-600'}>{supabaseSession?.access_token ? 'Present' : 'Missing'}</span></div>
              <div>Refresh Token: <span className={supabaseSession?.refresh_token ? 'text-green-600' : 'text-red-600'}>{supabaseSession?.refresh_token ? 'Present' : 'Missing'}</span></div>
              
              {supabaseSession && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="font-medium">Session Details:</div>
                  <div>User ID: {supabaseSession.user?.id}</div>
                  <div>Email: {supabaseSession.user?.email}</div>
                  <div>Expires: {supabaseSession.expires_at ? new Date(supabaseSession.expires_at * 1000).toLocaleString() : 'N/A'}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Auth
            </button>
            <button 
              onClick={() => window.location.href = '/debug-auth'}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Full Debug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
