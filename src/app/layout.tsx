import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed problematic import
// import { GeistMono } from 'geist/font/mono'; // Removed problematic import
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// const geistSans = GeistSans; // Removed problematic constant
// const geistMono = GeistMono; // Removed problematic constant

export const metadata: Metadata = {
  title: 'ContentGenius',
  description: 'AI-Powered Content Creation Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> {/* Removed className={``} */}
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
