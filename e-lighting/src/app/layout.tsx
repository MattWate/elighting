import '@/styles/globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer'; // Import the new footer
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-slate-100 antialiased flex flex-col min-h-screen`}>
        <Navbar />
        {/* main grows to push footer down on short pages */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
