'use client';

import { useState, useEffect } from 'react';
import { CourseCardProps } from '@/components/courses/course-card';

interface CoursesData {
  courses: CourseCardProps[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseCourseListParams {
  subject?: string;
  grade?: string;
  isFree?: boolean;
  page?: number;
  limit?: number;
}

export function useCourseList({
  subject,
  grade,
  isFree,
  page = 1,
  limit = 12
}: UseCourseListParams = {}) {
  const [data, setData] = useState<CoursesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (subject && subject !== 'all') params.set('subject', subject);
        if (grade && grade !== 'all') params.set('grade', grade);
        if (isFree !== undefined) params.set('isFree', isFree.toString());
        if (page) params.set('page', page.toString());
        if (limit) params.set('limit', limit.toString());
        
        const response = await fetch(`/api/courses?${params.toString()}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch courses');
        }
        
        setData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [subject, grade, isFree, page, limit]);
  
  return { 
    courses: data?.courses || [], 
    pagination: data?.pagination || { page, limit, total: 0, totalPages: 0 }, 
    isLoading, 
    error 
  };
}
