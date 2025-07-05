'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Target, 
  Calendar,
  Star,
  Trophy,
  Flame,
  PlayCircle,
  CheckCircle,
  Lock
} from 'lucide-react'

interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  avatarUrl?: string
  grade: string
  wilaya: string
  school?: string
  learningStreak: number
  totalStudyTime: number
  totalPoints: number
  currentLevel: number
}

interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  progress: number
  totalLessons: number
  completedLessons: number
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isEnrolled: boolean
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  badgeColor: string
  earnedAt: string
  points: number
}

interface StudySession {
  date: string
  duration: number
  coursesStudied: string[]
  pointsEarned: number
}

export function StudentDashboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [recentSessions, setRecentSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load all dashboard data
      const [profileRes, coursesRes, achievementsRes, sessionsRes] = await Promise.all([
        fetch('/api/student/profile'),
        fetch('/api/student/courses'),
        fetch('/api/student/achievements'),
        fetch('/api/student/study-sessions')
      ])

      const [profileData, coursesData, achievementsData, sessionsData] = await Promise.all([
        profileRes.json(),
        coursesRes.json(),
        achievementsRes.json(),
        sessionsRes.json()
      ])

      setProfile(profileData)
      setCourses(coursesData)
      setAchievements(achievementsData)
      setRecentSessions(sessionsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}س ${mins}د` : `${mins}د`
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <div className="container mx-auto p-6">خطأ في تحميل البيانات</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback className="text-lg">
              {profile.firstName[0]}{profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              أهلاً بك، {profile.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              {profile.grade} • {profile.wilaya}
              {profile.school && ` • ${profile.school}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center text-orange-600">
            <Flame className="h-5 w-5 ml-1" />
            <span className="font-bold">{profile.learningStreak}</span>
            <span className="text-sm">يوم متتالي</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">وقت الدراسة الإجمالي</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatStudyTime(profile.totalStudyTime)}</div>
            <p className="text-xs text-muted-foreground">
              +2س هذا الأسبوع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">النقاط المكتسبة</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              المستوى {profile.currentLevel}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الكورسات المكتملة</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter(c => c.progress === 100).length}
            </div>
            <p className="text-xs text-muted-foreground">
              من أصل {courses.length} كورس
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإنجازات</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              شارة مكتسبة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">كورساتي</TabsTrigger>
          <TabsTrigger value="progress">تقدمي</TabsTrigger>
          <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">كورساتي</h2>
            <Button>
              <BookOpen className="h-4 w-4 ml-2" />
              تصفح الكورسات
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${getDifficultyColor(course.difficulty)}`}
                  >
                    {course.difficulty === 'beginner' && 'مبتدئ'}
                    {course.difficulty === 'intermediate' && 'متوسط'}
                    {course.difficulty === 'advanced' && 'متقدم'}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{course.completedLessons}/{course.totalLessons} دروس</span>
                    <span>{formatStudyTime(course.estimatedTime)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>التقدم</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <Button className="w-full" variant={course.progress > 0 ? "default" : "outline"}>
                    {course.progress > 0 ? (
                      <>
                        <PlayCircle className="h-4 w-4 ml-2" />
                        متابعة
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 ml-2" />
                        بدء الكورس
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <h2 className="text-2xl font-bold">تقدمي الأكاديمي</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>التقدم الأسبوعي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.slice(0, 7).map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(session.date).toLocaleDateString('ar-DZ')}</p>
                        <p className="text-sm text-gray-600">{session.coursesStudied.length} كورس</p>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{formatStudyTime(session.duration)}</p>
                        <p className="text-sm text-green-600">+{session.pointsEarned} نقطة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أهداف الشهر</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">دراسة 20 ساعة</span>
                    <span className="text-sm">15/20 ساعة</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">إكمال 3 كورسات</span>
                    <span className="text-sm">2/3 كورسات</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">الحفاظ على سلسلة 30 يوم</span>
                    <span className="text-sm">{profile.learningStreak}/30 يوم</span>
                  </div>
                  <Progress value={(profile.learningStreak / 30) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-2xl font-bold">إنجازاتي وشاراتي</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="text-center">
                <CardContent className="pt-6">
                  <div className={`mx-auto mb-4 p-4 rounded-full w-fit ${
                    achievement.badgeColor === '#3b82f6' ? 'bg-blue-500' :
                    achievement.badgeColor === '#10b981' ? 'bg-green-500' :
                    achievement.badgeColor === '#f59e0b' ? 'bg-yellow-500' :
                    achievement.badgeColor === '#ef4444' ? 'bg-red-500' :
                    achievement.badgeColor === '#8b5cf6' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`}>
                    <div className="text-3xl">{achievement.icon}</div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{achievement.points} نقطة</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    تم الحصول عليها في {new Date(achievement.earnedAt).toLocaleDateString('ar-DZ')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">التحليلات والإحصائيات</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أوقات الدراسة المفضلة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '6:00 - 8:00 ص', percentage: 45, sessions: 23 },
                    { time: '2:00 - 4:00 م', percentage: 30, sessions: 15 },
                    { time: '7:00 - 9:00 م', percentage: 25, sessions: 12 }
                  ].map((slot, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{slot.time}</span>
                        <span>{slot.sessions} جلسة</span>
                      </div>
                      <Progress value={slot.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أداء المواد</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { subject: 'الرياضيات', score: 92, trend: 'up' },
                    { subject: 'الفيزياء', score: 88, trend: 'up' },
                    { subject: 'الكيمياء', score: 85, trend: 'down' },
                    { subject: 'علوم الطبيعة', score: 90, trend: 'up' }
                  ].map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <span className="font-medium">{subject.subject}</span>
                        <TrendingUp className={`h-4 w-4 ${subject.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-lg">{subject.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
