// CSS imported at component level for Next.js App Router
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'منصة التعلم الإلكتروني الجزائرية | EduDZ Platform',
  description: 'منصة التعلم الإلكتروني الرائدة في الجزائر للتحضير لامتحان البكالوريا. محتوى تعليمي متوافق مع منهاج الديوان الوطني للامتحانات والمسابقات.',
  keywords: 'بكالوريا, تعليم, الجزائر, امتحانات, دروس, BAC, education, Algeria',
  authors: [{ name: 'EduDZ Team' }],
  creator: 'EduDZ Platform',
  publisher: 'EduDZ',
  robots: 'index, follow',
  metadataBase: new URL('https://edudz.com'),
  openGraph: {
    type: 'website',
    locale: 'ar_DZ',
    alternateLocale: 'fr_DZ',
    url: 'https://edudz.com',
    siteName: 'EduDZ Platform',
    title: 'منصة التعلم الإلكتروني الجزائرية',
    description: 'استعد لامتحان البكالوريا مع أفضل منصة تعليمية مصممة خصيصاً للطلاب الجزائريين',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduDZ Platform - منصة التعلم الإلكتروني الجزائرية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'منصة التعلم الإلكتروني الجزائرية',
    description: 'استعد لامتحان البكالوريا مع أفضل منصة تعليمية مصممة خصيصاً للطلاب الجزائريين',
    images: ['/twitter-image.jpg'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/svg+xml', 
        sizes: '192x192',
        url: '/icon-192x192.svg',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        sizes: '512x512', 
        url: '/icon-512x512.svg',
      }
    ]
  },
};

// Separate viewport export for the whole app as per Next.js 15 guidelines
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduDZ" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div id="root">{children}</div>
          <div id="modal-root"></div>
          <div id="toast-root"></div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}