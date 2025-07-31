
'use client'

import { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, PlayCircle } from 'lucide-react'
import { useRealtimeProgress } from '@/hooks/use-progress-tracking'

interface CourseProgressBarProps {
  courseId: string
  lessons: Array<{
    id: string
    title: string
    title_ar: string
    order_num: number
    duration: number
  }>
}

export function CourseProgressBar({ courseId, lessons }: CourseProgressBarProps) {
  const { progress, courseProgress, refreshProgress } = useRealtimeProgress(courseId)

  const getLessonProgress = (lessonId: string) => {
    return progress.find(p => p.lessonId === lessonId)
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <PlayCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status?: string, progressPercentage?: number) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-100 text-green-800">مكتمل</Badge>
      case 'IN_PROGRESS':
        return (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Badge variant="secondary">جاري</Badge>
            {progressPercentage && progressPercentage > 0 && (
              <span className="text-xs text-gray-600">{Math.round(progressPercentage)}%</span>
            )}
          </div>
        )
      default:
        return <Badge variant="outline">لم يبدأ</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Course Progress */}
      {courseProgress && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">تقدم الدورة</h3>
            <Badge 
              variant={courseProgress.status === 'COMPLETED' ? 'default' : 'secondary'}
              className={courseProgress.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
            >
              {courseProgress.status === 'COMPLETED' ? 'مكتملة' : 
               courseProgress.status === 'IN_PROGRESS' ? 'جارية' : 'لم تبدأ'}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>إجمالي التقدم</span>
              <span>{Math.round(courseProgress.progressPercentage || 0)}%</span>
            </div>
            <Progress value={courseProgress.progressPercentage || 0} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>الدروس المكتملة:</span>
                <span>{courseProgress.lessonsCompleted} / {courseProgress.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>وقت الدراسة:</span>
                <span>{Math.round((courseProgress.totalTimeSpentSeconds || 0) / 60)} دقيقة</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson-by-Lesson Progress */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">تقدم الدروس</h3>
        
        <div className="space-y-3">
          {lessons
            .sort((a, b) => a.order_num - b.order_num)
            .map((lesson) => {
              const lessonProg = getLessonProgress(lesson.id)
              
              return (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {getStatusIcon(lessonProg?.status)}
                    <div>
                      <h4 className="font-medium text-sm">
                        {lesson.title_ar || lesson.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        الدرس {lesson.order_num} • {lesson.duration} دقيقة
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {lessonProg?.status === 'IN_PROGRESS' && lessonProg.progressPercentage > 0 && (
                      <div className="w-16">
                        <Progress value={lessonProg.progressPercentage} className="h-2" />
                      </div>
                    )}
                    {getStatusBadge(lessonProg?.status, lessonProg?.progressPercentage)}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
