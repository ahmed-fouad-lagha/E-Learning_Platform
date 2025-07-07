'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const GRADES = [
  { value: 'PREMIERE_AS', label: '1AS' },
  { value: 'PREMIERE_AL', label: '1AL' },
  { value: 'DEUXIEME_AS', label: '2AS' },
  { value: 'DEUXIEME_AL', label: '2AL' },
  { value: 'TERMINALE_AS', label: '3AS' },
  { value: 'TERMINALE_AL', label: '3AL' },
  { value: 'TERMINALE_TM', label: '3TM' },
  { value: 'TERMINALE_GE', label: '3GE' }
]

const WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
  'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
  'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
  'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
  'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
  'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
  'إن صالح', 'إن قزام', 'توقرت', 'جانت', 'المغير', 'المنيعة'
]

interface SignupFormProps {
  redirectTo?: string
}

export function EnhancedSignupForm({ redirectTo = '/dashboard' }: SignupFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'parent',
    grade: '',
    school: '',
    wilaya: '',
    parentPhone: '',
    subjects: '',
    dateOfBirth: '',
    phone: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Social login handler
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        // Redirect to Google OAuth
        window.location.href = data.url
      } else {
        setError(data.error || 'Social login failed')
      }
    } catch (error) {
      setError('خطأ في تسجيل الدخول عبر ' + (provider === 'google' ? 'Google' : 'Facebook'))
      console.error('Social login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateStep = (stepNumber: number): boolean => {
    setError('')
    
    switch (stepNumber) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError('يرجى إدخال الاسم الأول والأخير')
          return false
        }
        if (!formData.email.trim() || !formData.email.includes('@')) {
          setError('يرجى إدخال بريد إلكتروني صحيح')
          return false
        }
        if (!formData.role) {
          setError('يرجى اختيار نوع الحساب')
          return false
        }
        return true
      
      case 2:
        if (formData.password.length < 8) {
          setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('كلمة المرور وتأكيدها غير متطابقين')
          return false
        }
        return true
      
      case 3:
        if (formData.role === 'student') {
          if (!formData.grade) {
            setError('يرجى اختيار السنة الدراسية')
            return false
          }
          if (!formData.wilaya) {
            setError('يرجى اختيار الولاية')
            return false
          }
        }
        if (formData.role === 'teacher') {
          if (!formData.subjects.trim()) {
            setError('يرجى إدخال المواد التي تدرسها')
            return false
          }
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(step)) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'فشل في إنشاء الحساب')
      }
    } catch (error) {
      setError('خطأ في الشبكة. يرجى المحاولة مرة أخرى.')
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            تم إنشاء الحساب بنجاح!
          </CardTitle>
          <CardDescription>
            تم إرسال رابط التأكيد إلى بريدك الإلكتروني
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد لتفعيل حسابك
          </p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 إذا لم تجد الرسالة، تحقق من مجلد البريد المزعج (Spam)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full">
              الانتقال إلى تسجيل الدخول
            </Button>
          </Link>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          إنشاء حساب جديد
        </CardTitle>
        <CardDescription className="text-center">
          {step === 1 && 'المعلومات الأساسية'}
          {step === 2 && 'إعداد كلمة المرور'}
          {step === 3 && 'معلومات إضافية'}
        </CardDescription>
        
        {/* Progress Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-2 w-8 rounded-full transition-colors ${
                  num <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <>
              {/* Social Login Options */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      سجل بسرعة باستخدام
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <svg className="h-4 w-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      أو أكمل بالبيانات التقليدية
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم الأول</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="أحمد"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">اسم العائلة</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="محمد"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ahmed.mohamed@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">نوع الحساب</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">طالب</SelectItem>
                    <SelectItem value="teacher">أستاذ</SelectItem>
                    <SelectItem value="parent">ولي أمر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="8 أحرف على الأقل"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="أعد إدخال كلمة المرور"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>متطلبات كلمة المرور:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                    8 أحرف على الأقل
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                    حرف كبير واحد على الأقل
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                    رقم واحد على الأقل
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <>
              {formData.role === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="grade">السنة الدراسية</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => handleSelectChange('grade', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر السنة الدراسية" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((grade) => (
                          <SelectItem key={grade.value} value={grade.value}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wilaya">الولاية</Label>
                    <Select
                      value={formData.wilaya}
                      onValueChange={(value) => handleSelectChange('wilaya', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((wilaya) => (
                          <SelectItem key={wilaya} value={wilaya}>
                            {wilaya}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">اسم المدرسة (اختياري)</Label>
                    <Input
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="ثانوية الشهيد محمد بوضياف"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">رقم هاتف ولي الأمر (اختياري)</Label>
                    <Input
                      id="parentPhone"
                      name="parentPhone"
                      type="tel"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      placeholder="0555123456"
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              {formData.role === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subjects">المواد التي تدرسها</Label>
                    <Input
                      id="subjects"
                      name="subjects"
                      value={formData.subjects}
                      onChange={handleInputChange}
                      placeholder="الرياضيات، الفيزياء"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">اسم المؤسسة</Label>
                    <Input
                      id="school"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="ثانوية الشهيد محمد بوضياف"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wilaya">الولاية</Label>
                    <Select
                      value={formData.wilaya}
                      onValueChange={(value) => handleSelectChange('wilaya', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((wilaya) => (
                          <SelectItem key={wilaya} value={wilaya}>
                            {wilaya}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.role === 'parent' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0555123456"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wilaya">الولاية</Label>
                    <Select
                      value={formData.wilaya}
                      onValueChange={(value) => handleSelectChange('wilaya', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {WILAYAS.map((wilaya) => (
                          <SelectItem key={wilaya} value={wilaya}>
                            {wilaya}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
            >
              السابق
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="ml-auto"
            >
              التالي
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4 animate-spin" />
                  جاري إنشاء الحساب...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  إنشاء الحساب
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </form>

      <CardFooter className="flex justify-center pt-0">
        <p className="text-sm text-gray-600">
          هل لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            سجل الدخول
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
