import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#10b981',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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
        <div id="root">{children}</div>
        <div id="modal-root"></div>
        <div id="toast-root"></div>
      </body>
    </html>
  );
}