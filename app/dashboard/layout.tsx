import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'لوحة التحكم | EduDZ Platform',
  description: 'لوحة تحكم الطلاب والمعلمين في منصة التعلم الإلكتروني الجزائرية',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
