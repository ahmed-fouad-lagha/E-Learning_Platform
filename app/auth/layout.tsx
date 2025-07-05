import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | EduDZ Platform',
  description: 'قم بتسجيل الدخول إلى حسابك أو إنشاء حساب جديد في منصة التعلم الإلكتروني الجزائرية',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
