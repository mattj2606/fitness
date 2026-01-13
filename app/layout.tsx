import type { Metadata, Viewport } from 'next';
import './globals.css';
import { MobileLayout } from '@/components/layout/MobileLayout';

export const metadata: Metadata = {
  title: 'Fitness Intelligence App',
  description: 'Personal fitness tracking and workout recommendations',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MobileLayout>{children}</MobileLayout>
      </body>
    </html>
  );
}

