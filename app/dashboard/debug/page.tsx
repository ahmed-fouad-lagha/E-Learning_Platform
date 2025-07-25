'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/lib/auth-context';
import { AlertCircle, Database, RefreshCw, User, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface StatusTest {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function DebugDashboard() {
  const { 
    user, 
    session, 
    profile,
    loading, 
    error,
    refreshSession,
    isConfigured
  } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState<StatusTest[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runAllTests = async () => {
    setIsRunningTests(true);
    const testResults: StatusTest[] = [];

    // Test 1: Supabase Configuration
    testResults.push({
        name: 'Supabase Configuration',
        status: isConfigured ? 'success' : 'error',
        message: isConfigured ? 'Environment variables are set.' : 'Supabase environment variables are missing!',
    });

    // Test 2: Check Auth Context State
    testResults.push({
        name: 'Auth Context - User',
        status: user ? 'success' : 'warning',
        message: user ? `User object exists: ${user.id}` : 'User object is null.',
        details: user,
    });
    testResults.push({
        name: 'Auth Context - Session',
        status: session ? 'success' : 'warning',
        message: session ? 'Session object exists.' : 'Session object is null.',
        details: session ? { expires_at: session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A', user: session.user.id } : null,
    });
    testResults.push({
        name: 'Auth Context - Profile',
        status: profile ? 'success' : 'warning',
        message: profile ? `Profile loaded for ${profile.name || profile.email}` : 'Profile object is null.',
        details: profile,
    });


    // Test 3: Check profiles table access
    try {
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      testResults.push({
        name: 'Database: Profiles Table Access',
        status: dbError ? 'error' : 'success',
        message: dbError ? `RLS or table access error: ${dbError.message}` : 'Profiles table is accessible.',
        details: dbError || data,
      });
    } catch (err: any) {
      testResults.push({
        name: 'Database: Profiles Table Access',
        status: 'error',
        message: `Exception caught: ${err.message}`,
        details: err,
      });
    }

    // Test 4: Check current user profile fetch (if session exists)
    if (user) {
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        testResults.push({
          name: 'Database: Current User Profile',
          status: profileError ? 'error' : 'success',
          message: profileError ? 
            (profileError.code === 'PGRST116' ? 'Profile row not found in database.' : `Error fetching profile: ${profileError.message}`) :
            `Profile successfully fetched from DB.`,
          details: profileError || data,
        });
      } catch(err: any) {
        testResults.push({
            name: 'Database: Current User Profile',
            status: 'error',
            message: `Exception caught: ${err.message}`,
            details: err,
        });
      }
    } else {
        testResults.push({
            name: 'Database: Current User Profile',
            status: 'warning',
            message: 'Skipped: No user session.',
        });
    }

    setTests(testResults);
    setIsRunningTests(false);
  };
  
  useEffect(() => {
    runAllTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, session, profile, isConfigured]);

  const getStatusIcon = (status: StatusTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auth &amp; Database Debug Panel</h1>
          <p className="text-gray-600 mt-1">
            A real-time diagnostic tool for checking the status of your application&apos;s authentication and database connection.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Auth Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
                    <p><strong>Profile:</strong> {profile ? `${profile.name} (${profile.role})` : 'No profile loaded'}</p>
                    <p><strong>Initial Auth Loading:</strong> {loading.auth ? 'Yes' : 'No'}</p>
                    <p><strong>Profile Loading:</strong> {loading.profile ? 'Yes' : 'No'}</p>
                    <p><strong>Action Loading:</strong> {loading.action ? 'Yes' : 'No'}</p>
                    {error.auth && <Alert variant="destructive"><AlertDescription>{error.auth}</AlertDescription></Alert>}
                    {error.profile && <Alert variant="destructive"><AlertDescription>{error.profile}</AlertDescription></Alert>}
                    {error.action && <Alert variant="destructive"><AlertDescription>{error.action}</AlertDescription></Alert>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Database /> Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-3">
                    <Button onClick={runAllTests} disabled={isRunningTests}>
                        {isRunningTests ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Re-run All Tests
                    </Button>
                    <Button onClick={() => refreshSession()} disabled={loading.auth}>
                        {loading.auth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Force Refresh Session
                    </Button>
                    <Link href="/admin/database-setup" passHref>
                        <Button variant="outline" className="w-full">Go to Database Setup</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Test Results</CardTitle>
            <CardDescription>Results from the automated checks on your application&apos;s core components.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tests.map((test, index) => (
                <li key={index} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3 pt-1">{getStatusIcon(test.status)}</div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{test.name}</p>
                      <p className="text-sm text-gray-600">{test.message}</p>
                      {test.details && (
                        <details className="mt-2 text-xs">
                          <summary className="cursor-pointer text-gray-500">Details</summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded-md overflow-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
