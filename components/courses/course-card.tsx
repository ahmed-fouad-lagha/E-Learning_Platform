'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Clock, Users, GraduationCap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface CourseCardProps {
  id: string;
  title: string;
  titleAr: string;
  thumbnail: string | null;
  subject: string;
  grade: string;
  isFree: boolean;
  enrollmentCount: number;
  totalLessons: number;
  estimatedHours: number;
}

export function CourseCard({
  id,
  title,
  titleAr,
  thumbnail,
  subject,
  grade,
  isFree,
  enrollmentCount,
  totalLessons,
  estimatedHours
}: CourseCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Default placeholder image if the thumbnail is not available or fails to load
  const placeholderImage = '/images/course-placeholder.jpg';
  
  // Map subject to Arabic names
  const subjectLabels: Record<string, string> = {
    'MATHEMATICS': 'الرياضيات',
    'PHYSICS': 'الفيزياء',
    'CHEMISTRY': 'الكيمياء',
    'BIOLOGY': 'علوم الطبيعة',
    'ARABIC_LITERATURE': 'الأدب العربي',
    'FRENCH': 'اللغة الفرنسية',
    'ENGLISH': 'اللغة الإنجليزية',
    'HISTORY': 'التاريخ',
    'GEOGRAPHY': 'الجغرافيا',
    'PHILOSOPHY': 'الفلسفة',
    'ISLAMIC_STUDIES': 'العلوم الإسلامية',
    'ECONOMICS': 'الاقتصاد',
    'ACCOUNTING': 'المحاسبة',
    'COMPUTER_SCIENCE': 'علوم الكمبيوتر'
  };
  
  // Map grade to Arabic names
  const gradeLabels: Record<string, string> = {
    'PREMIERE_AS': 'الأولى ثانوي علوم',
    'PREMIERE_AL': 'الأولى ثانوي آداب',
    'DEUXIEME_AS': 'الثانية ثانوي علوم',
    'DEUXIEME_AL': 'الثانية ثانوي آداب',
    'TERMINALE_AS': 'الثالثة ثانوي علوم',
    'TERMINALE_AL': 'الثالثة ثانوي آداب',
    'TERMINALE_TM': 'الثالثة ثانوي رياضيات',
    'TERMINALE_GE': 'الثالثة ثانوي اقتصاد'
  };

  return (
    <Link href={`/courses/${id}`} className="block">
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={!imageError && thumbnail ? thumbnail : placeholderImage}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
          {isFree && (
            <Badge className="absolute left-2 top-2 bg-emerald-500 text-white">
              مجاني
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {subjectLabels[subject] || subject}
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {gradeLabels[grade] || grade}
            </Badge>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold" dir="rtl">
            {titleAr}
          </h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4 text-emerald-600" />
              <span>{totalLessons} دروس</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-emerald-600" />
              <span>{estimatedHours} ساعات</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-emerald-600" />
              <span>{enrollmentCount} طالب</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
