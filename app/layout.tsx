import Providers from '@/app/providers';
import { CorruptedDataDialog } from '@/components/corrupted-data-dialog';
import { Footer } from '@/components/footer';
import HeaderComponent from '@/components/header';
import { LoadingScreen } from '@/components/loadingscreen';
import { cn } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] })

const authors: Author[] = [
  {
    name: 'Noah Streller',
    url: 'https://github.com/noahstreller',
  }
]

export const metadata: Metadata = {
  metadataBase: new URL("https://grades.nstr.dev"),
  applicationName: "Grades",
  title: {
    default: "Grade Calculator - nstr.dev",
    template: "%s - Grades",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Grade Calculator",
  },
  formatDetection: {
    telephone: false,
  },
  description:
    "This grade calculator features different tools to get an overview of your grades and calculate your average grades for your subjects. It supports any numeric grading system and can calculate weighted averages. It also features a dark mode and is fully responsive. It saves data exclusively in your browser and does not require an account.",
  keywords: [
    "grade",
    "calculator",
    "average",
    "weighted",
    "subject",
    "grades",
    "school",
    "student",
    "university",
    "weight",
    "college",
    "high school",
    "passing",
    "failing",
    "required",
    "grades",
    "weighted",
    "overview",
    "average grade",
    "grade average",
    "average calculator",
    "weighted average",
    "weighted grade average",
    "weighted average calculator",
    "weighted grade average calculator",
    "grade overview",
    "grade calculator",
    "grade average calculator",
  ],
  authors,
  publisher: "Noah Streller",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Grade Calculator",
      },
    ],
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          <HeaderComponent />
          <div className="mt-[5rem] bg-background text-foreground flex flex-col items-center ">
            <main className="min-h-screen w-full flex flex-col items-center">
              {children}
            </main>
            <Footer />
          </div>
          <LoadingScreen />
          <CorruptedDataDialog />
          <Toaster theme="light" className="dark:hidden dark:size-0" />
          <Toaster theme="dark" className="hidden dark:flex" />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
