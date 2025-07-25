'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CourseCardProps } from '@/components/courses/course-card';
import Link from 'next/link';
import Image from 'next/image';

import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Target,
  Award,
  BarChart3,
  Play,
  CheckCircle,
  LayoutDashboard,
  Compass,
  Lock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface EnrolledCourse extends CourseCardProps {
  progress: number;
  lastAccessedAt: string;
  completedLessons: number;
}

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalWatchTime: number;
  achievementCount: number;
}

export default function DashboardPage() {
  const { user, profile, loading, error, isAuthenticated, requireAuth, signOut, refreshSession, clearError } = useRequireAuth();
  const router = useRouter();
  
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedCourses: 0,
    totalWatchTime: 0,
    achievementCount: 0
  });
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (requireAuth) {
      router.push('/auth');
    }
  }, [requireAuth, router]);

  // Handle OAuth completion flow
  useEffect(() => {
    const handleOAuthComplete = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authComplete = urlParams.get('auth');
      
      if (authComplete === 'complete') {
        console.log('Dashboard - OAuth completion detected, cleaning URL');
        
        // Remove auth parameters from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth');
        newUrl.searchParams.delete('refresh');
        window.history.replaceState({}, '', newUrl.toString());
      }
    };

    handleOAuthComplete();
  }, []);

  // Fetch enrolled courses and stats
  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoadingCourses(true);
        setCoursesError(null);

        // Fetch user enrollments
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select(`
            *,
            courses (
              id,
              title,
              description,
              thumbnail_url,
              price,
              duration,
              level,
              instructor_name,
              category,
              status
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (enrollmentsError) {
          throw enrollmentsError;
        }

        // Transform enrollments to course format
        const coursesData: EnrolledCourse[] = (enrollments || [])
          .filter(enrollment => enrollment.courses)
          .map(enrollment => ({
            id: enrollment.courses.id,
            title: enrollment.courses.title || '',
            titleAr: enrollment.courses.title_ar || enrollment.courses.title || '',
            thumbnail: enrollment.courses.thumbnail,
            subject: enrollment.courses.subject || 'GENERAL',
            grade: enrollment.courses.grade || 'متنوع',
            isFree: enrollment.courses.is_free || true,
            enrollmentCount: enrollment.courses.enrollment_count || 0,
            totalLessons: enrollment.courses.total_lessons || 0,
            estimatedHours: enrollment.courses.estimated_hours || 0,
            progress: enrollment.progress || 0,
            lastAccessedAt: enrollment.last_accessed_at || enrollment.created_at,
            completedLessons: enrollment.completed_lessons || 0,
          }));

        setEnrolledCourses(coursesData);

        // Calculate stats
        const totalCourses = coursesData.length;
        const completedCourses = coursesData.filter(course => course.progress >= 100).length;
        const totalWatchTime = coursesData.reduce((total, course) => {
          return total + (course.duration || 0) * (course.progress / 100);
        }, 0);

        setStats({
          totalCourses,
          completedCourses,
          totalWatchTime: Math.round(totalWatchTime),
          achievementCount: completedCourses * 2 + Math.floor(totalWatchTime / 60), // Simple achievement calculation
        });

      } catch (error: any) {
        console.error('Dashboard - Error fetching data:', error);
        setCoursesError(error.message || 'Failed to load dashboard data');
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={clearError} variant="outline" className="flex-1">
                Dismiss
              </Button>
              <Button onClick={refreshSession} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render content if user is not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LayoutDashboard className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {profile?.role?.toLowerCase() || 'Student'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            مرحباً بك، {profile?.name || 'الطالب'}! 👋
          </h2>
          <p className="text-gray-600">
            هذا ملخص عن تقدمك الأكاديمي اليوم
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الدورات</CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-gray-500">دورة مسجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الدورات المكتملة</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedCourses}</div>
              <p className="text-xs text-gray-500">دورة مكتملة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ساعات المشاهدة</CardTitle>
              <Clock className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWatchTime}</div>
              <p className="text-xs text-gray-500">ساعة مشاهدة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإنجازات</CardTitle>
              <Trophy className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.achievementCount}</div>
              <p className="text-xs text-gray-500">إنجاز محقق</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <Tabs defaultValue="enrolled" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enrolled">الدورات المسجلة</TabsTrigger>
            <TabsTrigger value="recommended">دورات مقترحة</TabsTrigger>
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-6">
            {coursesError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{coursesError}</AlertDescription>
              </Alert>
            )}

            {isLoadingCourses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-white" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>التقدم</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{course.completedLessons} درس مكتمل</span>
                          <span>{course.duration} ساعة</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0">
                      <Link href={`/courses/${course.id}`} className="w-full">
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          {course.progress > 0 ? 'متابعة التعلم' : 'بدء الدورة'}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد دورات مسجلة
                  </h3>
                  <p className="text-gray-500 mb-6">
                    ابدأ رحلتك التعليمية بتسجيل أول دورة لك
                  </p>
                  <Link href="/courses">
                    <Button>
                      <Compass className="h-4 w-4 mr-2" />
                      تصفح الدورات
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommended">
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  دورات مقترحة
                </h3>
                <p className="text-gray-500">
                  سيتم عرض الدورات المقترحة بناءً على اهتماماتك قريباً
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardContent className="py-12 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  الإنجازات والشهادات
                </h3>
                <p className="text-gray-500">
                  ستظهر هنا جميع إنجازاتك وشهاداتك المحققة
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
