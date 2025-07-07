'use client'

import { useAuth } from '@/lib/auth-context'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  className?: string
  showText?: boolean
}

export function LogoutButton({ className = "", showText = true }: LogoutButtonProps) {
  const { signOut, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await signOut()
      router.push('/auth')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Only show logout button if user is logged in
  if (!user) return null

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {showText && <span className="hidden md:inline">جاري الخروج...</span>}
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          {showText && <span className="hidden md:inline">تسجيل الخروج</span>}
        </>
      )}
    </button>
  )
}
