'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Users,
  Clock,
  BookOpen
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  level: string;
  duration_hours: number;
  is_published: boolean;
  instructor_name: string;
  student_count: number;
  created_at: string;
}

export default function CoursesManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const { user, getUserProfile } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/auth');
        return;
      }
      
      const profile = await getUserProfile();
      if (!profile || profile.role !== 'ADMIN') {
        router.push('/auth');
        return;
      }
      
      setIsAdmin(true);
      fetchCourses();
    };
    
    checkAdmin();
  }, [user, getUserProfile, router]);

  const fetchCourses = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'الرياضيات - الدوال الأسية واللوغاريتمية',
          description: 'دراسة شاملة للدوال الأسية واللوغاريتمية مع تطبيقات عملية',
          subject: 'MATHEMATICS',
          grade: 'TERMINALE_AS',
          level: 'ADVANCED',
          duration_hours: 25,
          is_published: true,
          instructor_name: 'د. أحمد بن محمد',
          student_count: 145,
          created_at: '2024-01-15'
        },
        {
          id: '2',
          title: 'الفيزياء - الكهرباء والمغناطيسية',
          description: 'مبادئ الكهرباء والمغناطيسية للسنة الثالثة ثانوي',
          subject: 'PHYSICS',
          grade: 'TERMINALE_AS',
          level: 'INTERMEDIATE',
          duration_hours: 30,
          is_published: false,
          instructor_name: 'د. فاطمة زهراء',
          student_count: 0,
          created_at: '2024-01-20'
        },
        {
          id: '3',
          title: 'الكيمياء - التفاعلات الكيميائية',
          description: 'دراسة التفاعلات الكيميائية وتطبيقاتها',
          subject: 'CHEMISTRY',
          grade: 'TERMINALE_AS',
          level: 'INTERMEDIATE',
          duration_hours: 20,
          is_published: true,
          instructor_name: 'د. محمد الأمين',
          student_count: 98,
          created_at: '2024-01-10'
        }
      ];
      setCourses(mockCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectLabel = (subject: string) => {
    const subjects: { [key: string]: string } = {
      'MATHEMATICS': 'الرياضيات',
      'PHYSICS': 'الفيزياء',
      'CHEMISTRY': 'الكيمياء',
      'BIOLOGY': 'علوم الطبيعة والحياة',
      'LITERATURE': 'اللغة العربية',
      'FRENCH': 'اللغة الفرنسية',
      'ENGLISH': 'اللغة الإنجليزية',
      'PHILOSOPHY': 'الفلسفة',
      'HISTORY': 'التاريخ والجغرافيا'
    };
    return subjects[subject] || subject;
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      'BEGINNER': 'مبتدئ',
      'INTERMEDIATE': 'متوسط',
      'ADVANCED': 'متقدم'
    };
    return levels[level] || level;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || course.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <span className="mr-2 text-xl font-bold text-gray-900">
                إدارة الدورات
              </span>
            </div>
            
            <Button 
              onClick={() => router.push('/admin/courses/create')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              إنشاء دورة جديدة
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الدورات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rtl:pr-10 rtl:pl-3"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع المواد</option>
              <option value="MATHEMATICS">الرياضيات</option>
              <option value="PHYSICS">الفيزياء</option>
              <option value="CHEMISTRY">الكيمياء</option>
              <option value="BIOLOGY">علوم الطبيعة والحياة</option>
            </select>
            
            <Button variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={course.is_published ? 'default' : 'secondary'}>
                    {course.is_published ? 'منشور' : 'مسودة'}
                  </Badge>
                  <Badge variant="outline">
                    {getSubjectLabel(course.subject)}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg line-clamp-2">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>المدرس: {course.instructor_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getLevelLabel(course.level)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      <span>{course.student_count} طالب</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      <span>{course.duration_hours} ساعة</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/courses/${course.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      عرض
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => router.push(`/admin/courses/${course.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دورات</h3>
            <p className="text-gray-600 mb-4">لم يتم العثور على دورات تطابق معايير البحث</p>
            <Button onClick={() => router.push('/admin/courses/create')}>
              إنشاء دورة جديدة
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}