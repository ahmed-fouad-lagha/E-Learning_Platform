import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'لوحة التحكم | EduDZ Platform',
  description: 'استكشف لوحة التحكم الخاصة بك وتابع تقدمك في التعلم على منصة EduDZ',
};

// Separate viewport export as per Next.js 15 guidelines
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Separate themeColor export as per Next.js 15 guidelines
export const themeColor = '#10b981';
