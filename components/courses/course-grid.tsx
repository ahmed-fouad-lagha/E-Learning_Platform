'use client';

import { CourseCard, CourseCardProps } from '@/components/courses/course-card';

interface CourseGridProps {
  courses: CourseCardProps[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function CourseGrid({
  courses,
  isLoading = false,
  emptyMessage = 'لا توجد دورات متاحة حالياً'
}: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={`skeleton-${i}`} 
            className="animate-pulse rounded-md bg-gray-200 h-[300px]"
          />
        ))}
      </div>
    );
  }
  
  if (!courses || courses.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-500 text-center">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  );
}
