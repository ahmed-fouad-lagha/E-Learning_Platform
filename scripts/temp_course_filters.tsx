'use client';

import { useState, useEffect } from 'react';
import { FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export interface CourseFiltersProps {
  selectedSubject?: string;
  selectedGrade?: string;
  isFree?: boolean;
  onSubjectChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onFreeToggle: (value: boolean | undefined) => void;
  className?: string;
}

export function CourseFilters({ 
  selectedSubject = 'all',
  selectedGrade = 'all',
  isFree,
  onSubjectChange,
  onGradeChange,
  onFreeToggle,
  className = '' 
}: CourseFiltersProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleReset = () => {
    onSubjectChange('all');
    onGradeChange('all');
    onFreeToggle(undefined);
    setIsSheetOpen(false);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Subject Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">المادة</h3>
        <Select 
          value={selectedSubject} 
          onValueChange={onSubjectChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر المادة" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">جميع المواد</SelectItem>
              <SelectItem value="MATHEMATICS">الرياضيات</SelectItem>
              <SelectItem value="PHYSICS">الفيزياء</SelectItem>
              <SelectItem value="CHEMISTRY">الكيمياء</SelectItem>
              <SelectItem value="BIOLOGY">علوم الحياة والأرض</SelectItem>
              <SelectItem value="ARABIC_LITERATURE">الأدب العربي</SelectItem>
              <SelectItem value="FRENCH">اللغة الفرنسية</SelectItem>
              <SelectItem value="ENGLISH">اللغة الإنجليزية</SelectItem>
              <SelectItem value="HISTORY">التاريخ</SelectItem>
              <SelectItem value="GEOGRAPHY">الجغرافيا</SelectItem>
              <SelectItem value="PHILOSOPHY">الفلسفة</SelectItem>
              <SelectItem value="ISLAMIC_STUDIES">العلوم الإسلامية</SelectItem>
              <SelectItem value="ECONOMICS">الاقتصاد</SelectItem>
              <SelectItem value="COMPUTER_SCIENCE">الإعلام الآلي</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Grade Filter */}
      <div>
        <h3 className="text-sm font-medium mb-2">المستوى</h3>
        <Select 
          value={selectedGrade} 
          onValueChange={onGradeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر المستوى" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">جميع المستويات</SelectItem>
              <SelectLabel>السنة الأولى ثانوي</SelectLabel>
              <SelectItem value="PREMIERE_AS">علوم</SelectItem>
              <SelectItem value="PREMIERE_AL">آداب</SelectItem>
              <SelectLabel>السنة الثانية ثانوي</SelectLabel>
              <SelectItem value="DEUXIEME_AS">علوم</SelectItem>
              <SelectItem value="DEUXIEME_AL">آداب</SelectItem>
              <SelectLabel>السنة الثالثة ثانوي (بكالوريا)</SelectLabel>
              <SelectItem value="TERMINALE_AS">علوم تجريبية</SelectItem>
              <SelectItem value="TERMINALE_TM">تقني رياضي</SelectItem>
              <SelectItem value="TERMINALE_AL">آداب وفلسفة</SelectItem>
              <SelectItem value="TERMINALE_GE">تسيير واقتصاد</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Free Courses Toggle */}
      <div>
        <h3 className="text-sm font-medium mb-3">النوع</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="free-toggle">
            الدورات المجانية فقط
          </Label>
          <Switch
            id="free-toggle"
            checked={isFree === true}
            onCheckedChange={(checked) => {
              if (checked) {
                onFreeToggle(true);
              } else {
                onFreeToggle(undefined);
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  // Mobile version
  if (isMobile) {
    return (
      <div className={className}>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="mb-4 flex gap-2">
              <FilterIcon size={16} />
              تصفية
            </Button>
          </SheetTrigger>
          <SheetContent side="left" dir="rtl">
            <SheetHeader>
              <SheetTitle>تصفية الدورات</SheetTitle>
              <SheetDescription>
                استخدم هذه الخيارات لتصفية الدورات حسب احتياجاتك
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 pb-12">
              {renderFilters()}
            </div>

            <SheetFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  إعادة ضبط
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">
                    تطبيق
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop version
  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FilterIcon size={18} />
        تصفية الدورات
      </h2>
      
      {renderFilters()}
      
      <Button 
        variant="outline" 
        className="w-full mt-6"
        onClick={handleReset}
      >
        إعادة ضبط
      </Button>
    </Card>
  );
}
