'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { GraduationCap } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

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