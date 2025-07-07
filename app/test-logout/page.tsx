'use client'

import { useAuth } from '@/lib/auth-context'
import { LogoutButton } from '@/components/auth/logout-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLogoutPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">اختبار زر تسجيل الخروج</h1>
        
        <div className="grid gap-6">
          {/* Login Status */}
          <Card>
            <CardHeader>
              <CardTitle>حالة تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">✅ تم تسجيل الدخول بنجاح</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
                    {profile?.name && <p><strong>الاسم:</strong> {profile.name}</p>}
                    {profile?.role && <p><strong>النوع:</strong> {profile.role}</p>}
                  </div>
                  <div className="mt-4">
                    <LogoutButton />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 font-medium">⚠️ لم يتم تسجيل الدخول</p>
                  </div>
                  <p>يرجى تسجيل الدخول أولاً لاختبار زر تسجيل الخروج.</p>
                  <a 
                    href="/auth" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    تسجيل الدخول
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>كيفية اختبار زر تسجيل الخروج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">الخطوات:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>تأكد من أنك مسجل الدخول (يجب أن ترى معلومات المستخدم أعلاه)</li>
                  <li>اضغط على زر &ldquo;تسجيل الخروج&rdquo;</li>
                  <li>يجب أن يتم توجيهك إلى صفحة تسجيل الدخول</li>
                  <li>عند العودة لهذه الصفحة، يجب أن ترى &ldquo;لم يتم تسجيل الدخول&rdquo;</li>
                </ol>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 text-sm">
                  <strong>ملاحظة:</strong> إذا كان زر تسجيل الخروج لا يعمل، تحقق من وحدة التحكم في المتصفح (F12) للأخطاء.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <Card>
              <CardHeader>
                <CardTitle>معلومات التطوير</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify({ 
                    hasUser: !!user, 
                    userEmail: user?.email,
                    profileName: profile?.name,
                    profileRole: profile?.role,
                    loading 
                  }, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
