'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function AuthCodeErrorContent() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'no_code':
        return 'لم يتم تلقي رمز التفويض من Google. يرجى المحاولة مرة أخرى.'
      case 'profile_creation_failed':
        return 'فشل في إنشاء ملف المستخدم. يرجى المحاولة مرة أخرى.'
      case 'unknown_error':
        return 'حدث خطأ غير معروف أثناء المصادقة.'
      default:
        return errorCode || 'فشل في تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            خطأ في المصادقة
          </CardTitle>
          <CardDescription>
            حدث خطأ أثناء تسجيل الدخول عبر Google
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {getErrorMessage(error)}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">خطوات حل المشكلة:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• تأكد من أن لديك حساب Google صالح</li>
              <li>• تأكد من السماح للتطبيق بالوصول إلى بياناتك</li>
              <li>• جرب مسح ملفات تعريف الارتباط والمحاولة مرة أخرى</li>
              <li>• تأكد من استقرار الاتصال بالإنترنت</li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth">
                <ArrowLeft className="mr-2 h-4 w-4" />
                العودة لصفحة تسجيل الدخول
              </Link>
            </Button>
            
            <Button asChild className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              <Link href="/">
                الذهاب للصفحة الرئيسية
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
