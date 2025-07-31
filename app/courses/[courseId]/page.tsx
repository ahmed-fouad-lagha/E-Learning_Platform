'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  GraduationCap,
  CheckCircle, 
  Lock,
  PlayCircle,
  FileText,
  Download,
  Award
} from 'lucide-react';
import { CourseDetail } from '@/lib/courses';

// Map for translating subjects and grades
const subjectMap: Record<string, string> = {
  'MATHEMATICS': 'الرياضيات',
  'PHYSICS': 'الفيزياء',
  'CHEMISTRY': 'الكيمياء',
  'BIOLOGY': 'علوم الحياة والأرض',
  'ARABIC_LITERATURE': 'الأدب العربي',
  'FRENCH': 'اللغة الفرنسية',
  'ENGLISH': 'اللغة الإنجليزية',
  'HISTORY': 'التاريخ',
  'GEOGRAPHY': 'الجغرافيا',
  'PHILOSOPHY': 'الفلسفة',
  'ISLAMIC_STUDIES': 'العلوم الإسلامية',
  'ECONOMICS': 'الاقتصاد',
  'ACCOUNTING': 'المحاسبة',
  'COMPUTER_SCIENCE': 'الإعلام الآلي'
};

const gradeMap: Record<string, string> = {
  'PREMIERE_AS': 'السنة الأولى ثانوي - علوم',
  'PREMIERE_AL': 'السنة الأولى ثانوي - آداب',
  'DEUXIEME_AS': 'السنة الثانية ثانوي - علوم',
  'DEUXIEME_AL': 'السنة الثانية ثانوي - آداب',
  'TERMINALE_AS': 'السنة الثالثة ثانوي - علوم',
  'TERMINALE_AL': 'السنة الثالثة ثانوي - آداب',
  'TERMINALE_TM': 'السنة الثالثة ثانوي - تقني رياضي',
  'TERMINALE_GE': 'السنة الثالثة ثانوي - تسيير واقتصاد'
};

export default function CourseDetailPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const headers: HeadersInit = {};
        // Only add authorization header if user is authenticated
        if (user?.id) {
          headers['authorization'] = `Bearer ${user.id}`;
        }

        const response = await fetch(`/api/courses/${courseId}`, { headers });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle successful API response
        if (data.success && data.data) {
          setCourse(data.data);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err: any) {
        console.error('Failed to fetch course details:', err);
        setError(err.message || 'فشل في تحميل تفاصيل الدورة');
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId, user]);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!user) {
      // Redirect to login page with return URL
      router.push(`/auth?returnUrl=/courses/${courseId}`);
      return;
    }

    try {
      setEnrolling(true);
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header
          'authorization': `Bearer ${user.id}` 
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Refresh course data to update enrollment status
      const updatedCourse = await response.json();
      setCourse(updatedCourse);

    } catch (err) {
      console.error('Failed to enroll:', err);
      setError('فشل في التسجيل في الدورة');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCreditEnroll = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setEnrolling(true)
    try {
      const response = await fetch(`/api/courses/${courseId}/enroll-with-credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header
          'authorization': `Bearer ${user.id}` 
        }
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.shortage) {
          setError(`You need ${error.shortage} more credits. Please recharge your account.`)
        } else {
          throw new Error(error.error || 'Failed to enroll')
        }
        return
      }

      // Refresh course data to update enrollment status
      const updatedCourse = await response.json();
      setCourse(updatedCourse);

    } catch (err) {
      console.error('Failed to enroll:', err);
      setError('فشل في التسجيل في الدورة');
    } finally {
      setEnrolling(false);
    }
  }

  // Handle lesson click
  const handleLessonClick = (lessonId: string) => {
    if (!course || (!courseIsEnrolled && !courseIsFree)) {
      return; // Don't allow access if not enrolled and not free
    }

    // Navigate to lesson page
    router.push(`/courses/${courseId}/lessons/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">جاري تحميل تفاصيل الدورة...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">عذراً، حدث خطأ</h2>
        <p className="text-muted-foreground mb-6">{error || 'لم يتم العثور على الدورة المطلوبة'}</p>
        <Button onClick={() => router.push('/courses')}>
          العودة إلى قائمة الدورات
        </Button>
      </div>
    );
  }

  // We've made it past the null check, so course is definitely defined from here
  const { subject, grade, titleAr, title, thumbnail, totalLessons, estimatedHours, 
          enrollmentCount, lessons, enrollment, description, descriptionAr } = course;

  // Derived properties for clarity
  const courseIsFree = course.isFree;
  const courseIsEnrolled = course.isEnrolled;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Course Image and Basic Info */}
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Badge>{subjectMap[subject] || subject}</Badge>
            <Badge variant="outline">{gradeMap[grade] || grade}</Badge>
            <Badge variant={courseIsFree ? "secondary" : "default"}>
              {courseIsFree ? 'مجاناً' : 'مدفوع'}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4" dir="rtl">
            {course.titleAr}
          </h1>
          <h2 className="text-2xl mb-4 text-muted-foreground">
            {course.title}
          </h2>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{estimatedHours} ساعات</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{totalLessons} درس</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{enrollmentCount} طالب</span>
            </div>
            <div className="flex items-center gap-1">
              <GraduationCap size={16} />
              <span>مستوى {grade}</span>
            </div>
          </div>

          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            {thumbnail ? (
              <Image 
                src={thumbnail}
                alt={titleAr}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpen size={64} className="text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Card */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              {courseIsEnrolled ? (
                <>
                  <div className="mb-6 text-center">
                    <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                    <p className="text-lg font-medium">أنت مسجل في هذه الدورة</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      تاريخ التسجيل: {new Date(enrollment?.enrolledAt || '').toLocaleDateString('ar-DZ')}
                    </p>
                  </div>

                  <Button 
                    className="w-full mb-4" 
                    onClick={() => lessons[0] && handleLessonClick(lessons[0].id)}
                  >
                    <PlayCircle className="mr-2" size={18} />
                    ابدأ التعلم الآن
                  </Button>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>التقدم في الدورة</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </>
              ) : (
                <>
                  {courseIsFree ? (
                    <>
                      <div className="mb-6 text-center">
                        <Badge className="mb-2 py-1 px-3 text-lg">مجاناً</Badge>
                        <p className="text-lg font-medium">دورة مجانية بالكامل</p>
                        <p className="text-sm text-muted-foreground mt-1">سجّل الآن للوصول إلى جميع الدروس</p>
                      </div>

                      {!enrollment && (
                        <div className="space-y-3">
                          {course.isFree ? (
                            <Button 
                              onClick={handleEnroll} 
                              disabled={enrolling} 
                              className="w-full"
                            >
                              {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                            </Button>
                          ) : (
                            <>
                              <Button 
                                onClick={handleCreditEnroll} 
                                disabled={enrolling} 
                                className="w-full"
                              >
                                {enrolling ? 'Enrolling...' : `Enroll with ${course.credit_price || 0} Credits`}
                              </Button>
                              <Button 
                                onClick={handleEnroll} 
                                disabled={enrolling} 
                                variant="outline"
                                className="w-full"
                              >
                                {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mb-6 text-center">
                        <p className="text-3xl font-bold mb-2">دورة مميزة</p>
                        <p className="text-sm text-muted-foreground">هذه الدورة تتطلب اشتراكاً مدفوعاً</p>
                      </div>

                      {!enrollment && (
                        <div className="space-y-3">
                          {course.isFree ? (
                            <Button 
                              onClick={handleEnroll} 
                              disabled={enrolling} 
                              className="w-full"
                            >
                              {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                            </Button>
                          ) : (
                            <>
                              <Button 
                                onClick={handleCreditEnroll} 
                                disabled={enrolling} 
                                className="w-full"
                              >
                                {enrolling ? 'Enrolling...' : `Enroll with ${course.credit_price || 0} Credits`}
                              </Button>
                              <Button 
                                onClick={handleEnroll} 
                                disabled={enrolling} 
                                variant="outline"
                                className="w-full"
                              >
                                {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span>وصول مدى الحياة</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span>{course.totalLessons} درس</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span>اختبارات تفاعلية</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                  <span>شهادة إتمام الدورة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="lessons">الدروس</TabsTrigger>
          <TabsTrigger value="resources">الموارد</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">وصف الدورة</h3>
              <div className="prose prose-lg max-w-none" dir="rtl">
                <p className="whitespace-pre-line">{descriptionAr}</p>
              </div>

              <h4 className="text-xl font-semibold mt-8 mb-4">Course Description (English)</h4>
              <div className="prose prose-lg max-w-none">
                <p className="whitespace-pre-line">{description}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">ما الذي ستتعلمه</h3>
              <ul className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle size={20} className="text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>نقطة تعليمية {i + 1}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-8 mb-4">متطلبات الدورة</h3>
              <ul className="space-y-2 text-sm">
                <li>- الإلمام بأساسيات المادة</li>
                <li>- حضور الدروس بانتظام</li>
                <li>- تطبيق التمارين العملية</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lessons" className="mt-6">
          <h3 className="text-2xl font-bold mb-6">محتوى الدورة</h3>
          <div className="space-y-4">
            {lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson, index) => (
                <Card 
                  key={lesson.id} 
                  className={`
                    cursor-pointer hover:border-primary transition-all
                    ${courseIsEnrolled || courseIsFree ? 'opacity-100' : 'opacity-70'}
                  `}
                  onClick={() => handleLessonClick(lesson.id)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-lg">{lesson.titleAr}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.title}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {lesson.duration} دقيقة
                      </span>

                      {courseIsEnrolled || courseIsFree ? (
                        <PlayCircle size={20} className="text-primary" />
                      ) : (
                        <Lock size={20} className="text-muted-foreground" />
                      )}
                    </div>
                  </CardContent>
                </Card>
            ))}

            {lessons.length === 0 && (
              <div className="text-center p-8 border rounded-lg">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-semibold">لم يتم إضافة أي دروس بعد</h4>
                <p className="text-muted-foreground mt-2">سيتم إضافة دروس لهذه الدورة قريباً</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <h3 className="text-2xl font-bold mb-6">موارد الدورة</h3>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium">ملخص المحاضرات</h4>
                  <p className="text-sm text-muted-foreground">ملف PDF يحتوي على ملخص شامل للدورة</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-1" /> تحميل
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium">نماذج امتحانات</h4>
                  <p className="text-sm text-muted-foreground">تمارين ونماذج امتحانات سابقة</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-1" /> تحميل
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium">أوراق عمل</h4>
                  <p className="text-sm text-muted-foreground">تمارين إضافية للممارسة</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-1" /> تحميل
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}