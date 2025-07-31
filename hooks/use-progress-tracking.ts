
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'

interface LessonProgress {
  id: string
  lessonId: string
  courseId: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progressPercentage: number
  timeSpentSeconds: number
  videoProgressSeconds?: number
  firstAccessedAt?: string
  lastAccessedAt: string
  completedAt?: string
}

interface CourseProgress {
  id: string
  courseId: string
  progressPercentage: number
  lessonsCompleted: number
  totalLessons: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED'
  lastActivityAt: string
  totalTimeSpentSeconds: number
}

interface DashboardData {
  summary: {
    totalCourses: number
    completedCourses: number
    inProgressCourses: number
    averageProgress: number
    currentStreak: number
    longestStreak: number
    totalTimeThisWeek: number
    weeklyGoal: number
    weeklyProgress: number
  }
  courses: Array<{
    id: string
    title: string
    thumbnail?: string
    subject: string
    grade: string
    progress: number
    status: string
    lessonsCompleted: number
    totalLessons: number
    lastActivity: string
    timeSpent: number
  }>
  recentActivity: Array<{
    id: string
    title: string
    courseTitle: string
    progress: number
    status: string
    lastAccessed: string
    timeSpent: number
  }>
  continueLesson?: {
    lessonId: string
    courseId: string
    lessonTitle: string
    courseTitle: string
    progress: number
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    iconUrl?: string
    badgeColor: string
    points: number
    earnedAt: string
  }>
  weeklyActivity: Record<string, {
    date: string
    minutes: number
    sessions: number
  }>
}

export function useProgressTracking() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLessonProgress = useCallback(async (
    lessonId: string,
    courseId: string,
    data: {
      status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
      progressPercentage?: number
      timeSpentSeconds?: number
      videoProgressSeconds?: number
    }
  ): Promise<LessonProgress | null> => {
    if (!session?.access_token) {
      setError('غير مصرح بالوصول')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          lessonId,
          courseId,
          ...data
        })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'خطأ في تحديث التقدم')
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع'
      setError(errorMessage)
      console.error('Error updating lesson progress:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  const getLessonProgress = useCallback(async (
    courseId?: string,
    lessonId?: string
  ): Promise<LessonProgress[]> => {
    if (!session?.access_token) {
      setError('غير مصرح بالوصول')
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (courseId) params.append('courseId', courseId)
      if (lessonId) params.append('lessonId', lessonId)

      const response = await fetch(`/api/progress/lesson?${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'خطأ في جلب التقدم')
      }

      return result.data || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع'
      setError(errorMessage)
      console.error('Error fetching lesson progress:', err)
      return []
    } finally {
      setLoading(false)
    }
  }, [session])

  const getCourseProgress = useCallback(async (
    courseId?: string
  ): Promise<CourseProgress | CourseProgress[]> => {
    if (!session?.access_token) {
      setError('غير مصرح بالوصول')
      return courseId ? ({} as CourseProgress) : []
    }

    setLoading(true)
    setError(null)

    try {
      const params = courseId ? `?courseId=${courseId}` : ''
      const response = await fetch(`/api/progress/course${params}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'خطأ في جلب تقدم الدورة')
      }

      return result.data || (courseId ? {} : [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع'
      setError(errorMessage)
      console.error('Error fetching course progress:', err)
      return courseId ? ({} as CourseProgress) : []
    } finally {
      setLoading(false)
    }
  }, [session])

  const getDashboardData = useCallback(async (): Promise<DashboardData | null> => {
    if (!session?.access_token) {
      setError('غير مصرح بالوصول')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/progress/dashboard', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'خطأ في جلب بيانات لوحة التحكم')
      }

      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع'
      setError(errorMessage)
      console.error('Error fetching dashboard data:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  // Mark lesson as viewed/started
  const markLessonViewed = useCallback(async (lessonId: string, courseId: string) => {
    return updateLessonProgress(lessonId, courseId, {
      status: 'IN_PROGRESS',
      progressPercentage: 10 // Started but not completed
    })
  }, [updateLessonProgress])

  // Mark lesson as completed
  const markLessonCompleted = useCallback(async (lessonId: string, courseId: string, timeSpent?: number) => {
    return updateLessonProgress(lessonId, courseId, {
      status: 'COMPLETED',
      progressPercentage: 100,
      timeSpentSeconds: timeSpent
    })
  }, [updateLessonProgress])

  // Update video progress
  const updateVideoProgress = useCallback(async (
    lessonId: string, 
    courseId: string, 
    videoSeconds: number, 
    totalSeconds: number
  ) => {
    const progressPercentage = Math.min(100, (videoSeconds / totalSeconds) * 100)
    const status = progressPercentage >= 90 ? 'COMPLETED' : 'IN_PROGRESS'

    return updateLessonProgress(lessonId, courseId, {
      status,
      progressPercentage,
      videoProgressSeconds: videoSeconds
    })
  }, [updateLessonProgress])

  return {
    loading,
    error,
    updateLessonProgress,
    getLessonProgress,
    getCourseProgress,
    getDashboardData,
    markLessonViewed,
    markLessonCompleted,
    updateVideoProgress
  }
}

// Hook for real-time progress updates
export function useRealtimeProgress(courseId?: string) {
  const [progress, setProgress] = useState<LessonProgress[]>([])
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null)
  const { getLessonProgress, getCourseProgress } = useProgressTracking()

  const refreshProgress = useCallback(async () => {
    if (courseId) {
      const [lessonData, courseData] = await Promise.all([
        getLessonProgress(courseId),
        getCourseProgress(courseId)
      ])
      setProgress(lessonData)
      setCourseProgress(courseData as CourseProgress)
    }
  }, [courseId, getLessonProgress, getCourseProgress])

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  return {
    progress,
    courseProgress,
    refreshProgress
  }
}
