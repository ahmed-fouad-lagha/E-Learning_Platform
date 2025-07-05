import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Seed Courses
  console.log('📚 Creating courses...');
  
  const mathCourse = await prisma.course.upsert({
    where: { id: 'math-bac-2025' },
    update: {},
    create: {
      id: 'math-bac-2025',
      title: 'Mathematics BAC 2025 Preparation',
      titleAr: 'تحضير الرياضيات بكالوريا 2025',
      description: 'Complete mathematics course for BAC 2025 preparation with practice exams and detailed explanations.',
      descriptionAr: 'دورة شاملة في الرياضيات للتحضير لبكالوريا 2025 مع امتحانات تطبيقية وشروحات مفصلة.',
      subject: 'MATHEMATICS',
      grade: 'TERMINALE_AS',
      difficulty: 'BAC_LEVEL',
      thumbnail: '/images/math-course.jpg',
      isPublished: true,
      isFree: true,
      curriculum: 'DZ-BAC-MATH-2025',
      bacRelevance: 0.95,
      totalLessons: 15,
      estimatedHours: 45,
    },
  });

  const physicsCourse = await prisma.course.upsert({
    where: { id: 'physics-bac-2025' },
    update: {},
    create: {
      id: 'physics-bac-2025',
      title: 'Physics BAC 2025 Preparation',
      titleAr: 'تحضير الفيزياء بكالوريا 2025',
      description: 'Comprehensive physics course covering mechanics, electricity, and modern physics for BAC 2025.',
      descriptionAr: 'دورة شاملة في الفيزياء تغطي الميكانيك والكهرباء والفيزياء الحديثة لبكالوريا 2025.',
      subject: 'PHYSICS',
      grade: 'TERMINALE_AS',
      difficulty: 'BAC_LEVEL',
      thumbnail: '/images/physics-course.jpg',
      isPublished: true,
      isFree: false,
      curriculum: 'DZ-BAC-PHYS-2025',
      bacRelevance: 0.90,
      totalLessons: 20,
      estimatedHours: 60,
    },
  });

  const arabicCourse = await prisma.course.upsert({
    where: { id: 'arabic-literature-bac' },
    update: {},
    create: {
      id: 'arabic-literature-bac',
      title: 'Arabic Literature BAC Preparation',
      titleAr: 'تحضير الأدب العربي للبكالوريا',
      description: 'Master Arabic literature with classic texts, poetry analysis, and writing techniques.',
      descriptionAr: 'إتقان الأدب العربي مع النصوص الكلاسيكية وتحليل الشعر وتقنيات الكتابة.',
      subject: 'ARABIC_LITERATURE',
      grade: 'TERMINALE_AL',
      difficulty: 'BAC_LEVEL',
      thumbnail: '/images/arabic-course.jpg',
      isPublished: true,
      isFree: true,
      curriculum: 'DZ-BAC-ARAB-2025',
      bacRelevance: 0.85,
      totalLessons: 12,
      estimatedHours: 36,
    },
  });

  console.log('✅ Courses created');

  // Seed Lessons for Math Course
  console.log('📖 Creating lessons...');
  
  const mathLessons = [
    {
      id: 'math-lesson-1',
      title: 'Functions and Derivatives',
      titleAr: 'الدوال والمشتقات',
      content: 'Comprehensive coverage of functions and their derivatives...',
      contentAr: 'تغطية شاملة للدوال ومشتقاتها...',
      order: 1,
      duration: 60,
      courseId: mathCourse.id,
    },
    {
      id: 'math-lesson-2',
      title: 'Integrals',
      titleAr: 'التكاملات',
      content: 'Deep dive into integral calculus...',
      contentAr: 'دراسة عميقة لحساب التكامل...',
      order: 2,
      duration: 90,
      courseId: mathCourse.id,
    },
    {
      id: 'math-lesson-3',
      title: 'Complex Numbers',
      titleAr: 'الأعداد المركبة',
      content: 'Understanding complex numbers and their applications...',
      contentAr: 'فهم الأعداد المركبة وتطبيقاتها...',
      order: 3,
      duration: 75,
      courseId: mathCourse.id,
    },
  ];

  for (const lesson of mathLessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });
  }

  // Seed Lessons for Physics Course
  const physicsLessons = [
    {
      id: 'physics-lesson-1',
      title: 'Mechanics',
      titleAr: 'الميكانيك',
      content: 'Introduction to classical mechanics...',
      contentAr: 'مقدمة في الميكانيك الكلاسيكي...',
      order: 1,
      duration: 90,
      courseId: physicsCourse.id,
    },
    {
      id: 'physics-lesson-2',
      title: 'Electricity and Magnetism',
      titleAr: 'الكهرباء والمغناطيسية',
      content: 'Electromagnetic theory and applications...',
      contentAr: 'نظرية الكهرومغناطيسية والتطبيقات...',
      order: 2,
      duration: 105,
      courseId: physicsCourse.id,
    },
  ];

  for (const lesson of physicsLessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });
  }

  // Seed Lessons for Arabic Course
  const arabicLessons = [
    {
      id: 'arabic-lesson-1',
      title: 'Classical Poetry',
      titleAr: 'الشعر الكلاسيكي',
      content: 'Analysis of classical Arabic poetry...',
      contentAr: 'تحليل الشعر العربي الكلاسيكي...',
      order: 1,
      duration: 80,
      courseId: arabicCourse.id,
    },
  ];

  for (const lesson of arabicLessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });
  }

  console.log('✅ Lessons created');

  // Seed Sample Exam
  console.log('📝 Creating sample exam...');
  
  const sampleExam = await prisma.exam.upsert({
    where: { id: 'math-bac-practice-1' },
    update: {},
    create: {
      id: 'math-bac-practice-1',
      title: 'Mathematics BAC Practice Exam 1',
      titleAr: 'امتحان الرياضيات التطبيقي للبكالوريا 1',
      description: 'Practice exam based on previous BAC mathematics papers',
      descriptionAr: 'امتحان تطبيقي مبني على أوراق الرياضيات السابقة للبكالوريا',
      subject: 'MATHEMATICS',
      grade: 'TERMINALE_AS',
      duration: 180,
      totalMarks: 20,
      isPublished: true,
      examType: 'BAC_SIMULATION',
      courseId: mathCourse.id,
    },
  });

  console.log('✅ Sample exam created');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Created ${3} courses`);
  console.log(`- Created ${6} lessons`);
  console.log(`- Created ${1} sample exam`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
