'use client'

import { useAuth } from '@/lib/auth-context'
import { LogoutButton } from '@/components/auth/logout-button'
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  const { user, profile } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">منصة التعلم</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  لوحة التحكم
                </Link>
                <Link href="/courses" className="text-gray-700 hover:text-blue-600">
                  الدورات
                </Link>
                {profile?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600">
                    إدارة
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/courses" className="text-gray-700 hover:text-blue-600">
                  الدورات
                </Link>
                <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
                  الأسعار
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-600">مرحباً،</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.name || user.email}
                  </span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
