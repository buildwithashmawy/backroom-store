import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { site } from '@/lib/site';

const manrope = localFont({
  src: [
    { path: './fonts/Manrope-Regular.ttf', weight: '400' },
    { path: './fonts/Manrope-Medium.ttf', weight: '500' },
    { path: './fonts/Manrope-SemiBold.ttf', weight: '600' },
    { path: './fonts/Manrope-Bold.ttf', weight: '700' },
    { path: './fonts/Manrope-ExtraBold.ttf', weight: '800' },
  ],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  title: { default: `${site.storeName} · ${site.tagline}`, template: `%s · ${site.storeName}` },
  description: site.description,
  icons: { icon: '/brand/icon.svg' },
  openGraph: { siteName: site.storeName, type: 'website', locale: 'en_EG' },
};

export const viewport: Viewport = { themeColor: '#0A0A0A', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-action focus:px-4 focus:py-2 focus:text-on-action">
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
