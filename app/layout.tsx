import type { Metadata } from 'next';
import './globals.css';
import { MobileLayout } from '@/components/layout/MobileLayout';

export const metadata: Metadata = {
  title: 'Fitness Intelligence App',
  description: 'Personal fitness tracking and workout recommendations',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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

