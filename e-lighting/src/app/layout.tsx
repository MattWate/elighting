// e-lighting/src/app/layout.tsx
import '@/styles/globals.css';
import Navbar from '@/components/shared/Navbar';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-slate-100 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
