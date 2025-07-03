'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isConfigured } from '@/lib/supabase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <GraduationCap className="h-12 w-12 text-emerald-600" />
              <span className="ml-3 text-3xl font-bold text-gray-900">
                منصة التعلم الجزائرية
              </span>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            استعد لامتحان البكالوريا مع أفضل منصة تعليمية في الجزائر
          </p>
        </div>

        {/* Supabase Configuration Warning */}
        {!isConfigured && (
          <div className="mb-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>إعداد مطلوب:</strong> يرجى الضغط على "Connect to Supabase" في الأعلى لإعداد قاعدة البيانات قبل استخدام ميزات التسجيل وتسجيل الدخول.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Auth Forms */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 منصة التعلم الجزائرية. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </div>
  );
}