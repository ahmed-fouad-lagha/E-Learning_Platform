'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CourseFilters } from '@/components/courses/course-filters';
import { CourseGrid } from '@/components/courses/course-grid';
import { CoursePagination } from '@/components/courses/course-pagination';
import { useCourseList } from '@/hooks/use-course-list';
import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

function CoursesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Parse query parameters
  const subject = searchParams.get('subject') || undefined;
  const grade = searchParams.get('grade') || undefined;
  const isFree = searchParams.has('isFree') 
    ? searchParams.get('isFree') === 'true' 
    : undefined;
  const page = searchParams.has('page')
    ? parseInt(searchParams.get('page') || '1', 10)
    : 1;

  // Fetch courses with filters
  const { courses, pagination, isLoading, error } = useCourseList({
    subject,
    grade,
    isFree,
    page,
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic (would connect to a search API endpoint)
    console.log('Search for:', searchQuery);
  };

  // Handle filter changes
  const handleFilterChange = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'all') {
      params.delete(type);
    } else {
      params.set(type, value);
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/courses?${params.toString()}`);
  };

  // Handle free/paid filter toggle
  const handleFreeToggle = (value: boolean | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === undefined) {
      params.delete('isFree');
    } else {
      params.set('isFree', value.toString());
    }
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    router.push(`/courses?${params.toString()}`);
  };

  // Get current filters for display
  const currentFilters = [
    subject && { label: 'المادة', value: subject },
    grade && { label: 'المستوى', value: grade },
    isFree !== undefined && { label: 'النوع', value: isFree ? 'مجاني' : 'مدفوع' },
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <BookOpen className="mr-2" />
            استكشف الدورات التعليمية
          </h1>
          <p className="text-muted-foreground mb-4">
            اكتشف دروسًا عالية الجودة تم إعدادها من قبل أفضل الأساتذة في الجزائر
          </p>
          
          {/* Active filters */}
          {currentFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {currentFilters.map((filter: any, i) => (
                <Badge key={i} variant="secondary" className="px-3 py-1">
                  {filter.label}: {filter.value}
                </Badge>
              ))}
              
              {/* Clear filters button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/courses')}
              >
                إزالة التصفية
              </Button>
            </div>
          )}
        </div>
        
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-auto mt-4 md:mt-0">
          <Input
            type="search"
            placeholder="ابحث عن دورة..."
            className="w-full md:w-64 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="col-span-1">
          <CourseFilters
            selectedSubject={subject}
            selectedGrade={grade}
            isFree={isFree}
            onSubjectChange={(value) => handleFilterChange('subject', value)}
            onGradeChange={(value) => handleFilterChange('grade', value)}
            onFreeToggle={handleFreeToggle}
          />
        </div>

        {/* Main content */}
        <div className="col-span-1 md:col-span-3">
          {isLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">جاري تحميل الدورات...</p>
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل الدورات</p>
              <Button onClick={() => window.location.reload()}>
                حاول مرة أخرى
              </Button>
            </div>
          ) : courses.length > 0 ? (
            // Courses found
            <>
              <CourseGrid courses={courses} />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8">
                  <CoursePagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                  />
                </div>
              )}
            </>
          ) : (
            // No courses found
            <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg p-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد دورات متاحة</h3>
              <p className="text-muted-foreground mb-4">
                لم يتم العثور على دورات تطابق معايير البحث الخاصة بك
              </p>
              <Button onClick={() => router.push('/courses')}>
                عرض جميع الدورات
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <BookOpen className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p>جاري تحميل الدورات...</p>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
