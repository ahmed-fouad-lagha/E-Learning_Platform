
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'غير مصرح بالوصول'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: 'جلسة غير صالحة'
      }, { status: 401 });
    }
    
    // Get comprehensive dashboard data
    const [
      courseProgressResult,
      recentLessonsResult,
      streakResult,
      weeklyStatsResult,
      achievementsResult
    ] = await Promise.allSettled([
      // Course progress
      supabase
        .from('course_progress')
        .select(`
          *,
          course:courses(id, title, title_ar, thumbnail, subject, grade, difficulty)
        `)
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false }),
      
      // Recent lessons
      supabase
        .from('lesson_progress')
        .select(`
          *,
          lesson:lessons(id, title, title_ar, order_num, duration),
          course:courses(id, title, title_ar, thumbnail)
        `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false })
        .limit(10),
      
      // Learning streak
      supabase
        .from('learning_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      
      // Weekly study stats
      supabase
        .from('study_sessions')
        .select('duration_seconds, started_at, course_id')
        .eq('user_id', user.id)
        .gte('started_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // User achievements (if table exists)
      supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(name, name_ar, description, description_ar, icon_url, badge_color, points_reward)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })
        .limit(5)
    ]);
    
    // Process results
    const courseProgress = courseProgressResult.status === 'fulfilled' ? courseProgressResult.value.data : [];
    const recentLessons = recentLessonsResult.status === 'fulfilled' ? recentLessonsResult.value.data : [];
    const streak = streakResult.status === 'fulfilled' ? streakResult.value.data : null;
    const weeklyStats = weeklyStatsResult.status === 'fulfilled' ? weeklyStatsResult.value.data : [];
    const achievements = achievementsResult.status === 'fulfilled' ? achievementsResult.value.data : [];
    
    // Calculate summary statistics
    const totalCourses = courseProgress?.length || 0;
    const completedCourses = courseProgress?.filter(cp => cp.status === 'COMPLETED').length || 0;
    const inProgressCourses = courseProgress?.filter(cp => cp.status === 'IN_PROGRESS').length || 0;
    
    const totalTimeThisWeek = weeklyStats?.reduce((total, session) => {
      return total + (session.duration_seconds || 0);
    }, 0) || 0;
    
    const averageProgress = totalCourses > 0 
      ? courseProgress.reduce((sum, cp) => sum + (cp.progress_percentage || 0), 0) / totalCourses 
      : 0;
    
    // Get next lesson to continue
    const nextLesson = recentLessons?.find(lp => lp.status === 'IN_PROGRESS') || 
                      recentLessons?.find(lp => lp.status === 'NOT_STARTED');
    
    const dashboardData = {
      summary: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress: Math.round(averageProgress * 100) / 100,
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0,
        totalTimeThisWeek: Math.round(totalTimeThisWeek / 60), // Convert to minutes
        weeklyGoal: streak?.weekly_goal_minutes || 300,
        weeklyProgress: streak?.weekly_progress_minutes || Math.round(totalTimeThisWeek / 60)
      },
      
      courses: courseProgress?.map(cp => ({
        id: cp.course_id,
        title: cp.course?.title_ar || cp.course?.title,
        thumbnail: cp.course?.thumbnail,
        subject: cp.course?.subject,
        grade: cp.course?.grade,
        difficulty: cp.course?.difficulty,
        progress: cp.progress_percentage || 0,
        status: cp.status,
        lessonsCompleted: cp.lessons_completed || 0,
        totalLessons: cp.total_lessons || 0,
        lastActivity: cp.last_activity_at,
        timeSpent: Math.round((cp.total_time_spent_seconds || 0) / 60) // Convert to minutes
      })) || [],
      
      recentActivity: recentLessons?.slice(0, 5).map(lp => ({
        id: lp.lesson_id,
        title: lp.lesson?.title_ar || lp.lesson?.title,
        courseTitle: lp.course?.title_ar || lp.course?.title,
        progress: lp.progress_percentage || 0,
        status: lp.status,
        lastAccessed: lp.last_accessed_at,
        timeSpent: Math.round((lp.time_spent_seconds || 0) / 60)
      })) || [],
      
      continueLesson: nextLesson ? {
        lessonId: nextLesson.lesson_id,
        courseId: nextLesson.course_id,
        lessonTitle: nextLesson.lesson?.title_ar || nextLesson.lesson?.title,
        courseTitle: nextLesson.course?.title_ar || nextLesson.course?.title,
        progress: nextLesson.progress_percentage || 0
      } : null,
      
      achievements: achievements?.map(ua => ({
        id: ua.achievement_id,
        name: ua.achievement?.name_ar || ua.achievement?.name,
        description: ua.achievement?.description_ar || ua.achievement?.description,
        iconUrl: ua.achievement?.icon_url,
        badgeColor: ua.achievement?.badge_color,
        points: ua.achievement?.points_reward,
        earnedAt: ua.earned_at
      })) || [],
      
      weeklyActivity: weeklyStats?.reduce((acc, session) => {
        const date = new Date(session.started_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, minutes: 0, sessions: 0 };
        }
        acc[date].minutes += Math.round((session.duration_seconds || 0) / 60);
        acc[date].sessions += 1;
        return acc;
      }, {} as Record<string, any>) || {}
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Error in dashboard progress API:', error);
    return NextResponse.json({
      success: false,
      error: 'خطأ في الخادم'
    }, { status: 500 });
  }
}
