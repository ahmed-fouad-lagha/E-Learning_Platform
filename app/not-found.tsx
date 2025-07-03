import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة | EduDZ Platform',
  description: 'عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها',
};

// Separate viewport export as per Next.js 15 guidelines
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Separate themeColor export as per Next.js 15 guidelines
export const themeColor = '#10b981';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl md:text-8xl font-bold text-emerald-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">الصفحة غير موجودة</h2>
      <p className="mb-8 text-lg text-gray-600 max-w-md">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو تغيير عنوانها.
      </p>
      <Button asChild className="btn-primary">
        <Link href="/">العودة إلى الصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
