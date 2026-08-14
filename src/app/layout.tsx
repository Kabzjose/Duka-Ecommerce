import type { Metadata } from 'next';
import { Inter, Inter_Tight, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' });
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono' });

export const metadata: Metadata =   {
  title: 'Duka — Shop Smarter',
  description: 'Quality Products, fair prices, delivered to your door.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${plexMono.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

