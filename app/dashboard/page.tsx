'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getGradeLabel = (grade: string) => {
    const gradeLabels: { [key: string]: string } = {
      'PREMIERE_AS': 'الأولى ثانوي علوم',
      'PREMIERE_AL': 'الأولى ثانوي آداب',
      'DEUXIEME_AS': 'الثانية ثانوي علوم',
      'DEUXIEME_AL': 'الثانية ثانوي آداب',
      'TERMINALE_AS': 'الثالثة ثانوي علوم تجريبية',
      'TERMINALE_AL': 'الثالثة ثانوي آداب وفلسفة',
      'TERMINALE_AM': 'الثالثة ثانوي رياضيات',
      'TERMINALE_ATM': 'الثالثة ثانوي تقني رياضي',
      'TERMINALE_AGE': 'الثالثة ثانوي تسيير واقتصاد',
      'TERMINALE_ALL': 'الثالثة ثانوي لغات أجنبية',
    };
    return gradeLabels[grade] || grade;
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      'STUDENT': 'طالب',
      'TEACHER': 'أستاذ',
      'PARENT': 'ولي أمر',
      'ADMIN': 'مدير'
    };
    return roleLabels[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              <span className="mr-2 text-xl font-bold text-gray-900">
                منصة التعلم الجزائرية
              </span>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                مرحباً، {profile.name}
              </h1>
              <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                <Badge variant="secondary">
                  {getRoleLabel(profile.role)}
                </Badge>
                {profile.grade && (
                  <Badge variant="outline">
                    {getGradeLabel(profile.grade)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الدروس المكتملة</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ساعات الدراسة</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +8 من الأسبوع الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل الامتحانات</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +5% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الترتيب</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#15</div>
              <p className="text-xs text-muted-foreground">
                من أصل 250 طالب
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  الدروس الحالية
                </CardTitle>
                <CardDescription>
                  تابع تقدمك في الدروس المسجل فيها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'الرياضيات - الدوال', progress: 75, color: 'bg-blue-500' },
                  { name: 'الفيزياء - الكهرباء', progress: 60, color: 'bg-purple-500' },
                  { name: 'الكيمياء - التفاعلات', progress: 90, color: 'bg-green-500' },
                ].map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-sm text-gray-500">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'أكملت درس الدوال الأسية', time: 'منذ ساعتين', icon: BookOpen },
                    { action: 'حصلت على 18/20 في امتحان الفيزياء', time: 'أمس', icon: Trophy },
                    { action: 'انضممت لمجموعة دراسة الرياضيات', time: 'منذ 3 أيام', icon: Users },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="flex-shrink-0">
                        <activity.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  تصفح الدروس
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  امتحان تجريبي
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  مجموعات الدراسة
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  جدولة الدراسة
                </Button>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  الإنجازات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'أول درس مكتمل', icon: '🎯', earned: true },
                    { name: 'أسبوع دراسة متواصل', icon: '🔥', earned: true },
                    { name: 'نتيجة ممتازة', icon: '⭐', earned: false },
                    { name: 'مساعد زملاء', icon: '🤝', earned: false },
                  ].map((achievement, index) => (
                    <div key={index} className={`flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg ${achievement.earned ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                      <span className="text-lg">{achievement.icon}</span>
                      <span className={`text-sm ${achievement.earned ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Study Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                  جدول اليوم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '09:00', subject: 'الرياضيات', type: 'درس' },
                    { time: '11:00', subject: 'الفيزياء', type: 'مراجعة' },
                    { time: '14:00', subject: 'الكيمياء', type: 'امتحان' },
                    { time: '16:00', subject: 'الأدب', type: 'قراءة' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{item.subject}</p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <span className="text-sm text-emerald-600 font-medium">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}