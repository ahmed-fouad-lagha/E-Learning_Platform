import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | EduDZ Platform',
  description: 'قم بتسجيل الدخول إلى حسابك أو إنشاء حساب جديد في منصة التعلم الإلكتروني الجزائرية',
};

// Separate viewport export as per Next.js 15 guidelines
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Separate themeColor export as per Next.js 15 guidelines
export const themeColor = '#10b981';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
