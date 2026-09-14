import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tekromancy Grant Hub | Interactive Example & Documentation',
  description: 'Interactive demonstration of @tekromancy/grant_utils: Grant pipeline analytics, RFC 5545 calendar scheduling, Markdown proposal editing, visual Git diffs, and developer documentation.',
};

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
