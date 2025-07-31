'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3,
  Plus,
  Settings,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, getUserProfile, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return;
      
      if (!user) {
        router.push('/auth');
        return;
      }
      
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      
      if (!userProfile || userProfile.role !== 'ADMIN') {
        router.push('/auth');
        return;
      }
      
      setIsAdmin(true);
    };
    
    checkAdmin();
  }, [user, getUserProfile, loading, router]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const stats = [
    { title: 'إجمالي الدورات', value: '24', icon: BookOpen, color: 'text-blue-600' },
    { title: 'الطلاب المسجلين', value: '1,247', icon: Users, color: 'text-green-600' },
    { title: 'المعلمين النشطين', value: '18', icon: GraduationCap, color: 'text-purple-600' },
    { title: 'معدل الإكمال', value: '78%', icon: BarChart3, color: 'text-orange-600' }
  ];

  const quickActions = [
    {
      title: 'إنشاء دورة جديدة',
      description: 'أضف دورة تعليمية جديدة للمنصة',
      icon: Plus,
      href: '/admin/courses/create',
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      title: 'إدارة الدورات',
      description: 'عرض وتعديل الدورات الموجودة',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'إدارة المستخدمين',
      description: 'إدارة الطلاب والمعلمين',
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'التقارير والإحصائيات',
      description: 'عرض تقارير الأداء والاستخدام',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              <span className="mr-2 text-xl font-bold text-gray-900">
                لوحة تحكم الإدارة
              </span>
            </div>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                مدير النظام
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً، {profile.name}
          </h1>
          <p className="text-lg text-gray-600">
            إدارة منصة التعلم الإلكتروني الجزائرية
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  +12% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => router.push(action.href)}
                  >
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                الدورات الحديثة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'الرياضيات - الدوال الأسية', status: 'منشور', students: 45 },
                  { name: 'الفيزياء - الكهرباء', status: 'مسودة', students: 0 },
                  { name: 'الكيمياء - التفاعلات', status: 'منشور', students: 32 }
                ].map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.students} طالب</p>
                    </div>
                    <Badge variant={course.status === 'منشور' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
                نشاط المستخدمين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'تسجيل طالب جديد', user: 'أحمد محمد', time: 'منذ 5 دقائق' },
                  { action: 'إكمال درس', user: 'فاطمة علي', time: 'منذ 15 دقيقة' },
                  { action: 'إنشاء اختبار', user: 'د. سعيد بن علي', time: 'منذ ساعة' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}