import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'eLighting | Premium Illumination',
  description: 'High-end lighting solutions for modern spaces.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* You can add your Navbar component here later */}
        {children}
        {/* You can add your Footer component here later */}
      </body>
    </html>
  );
}

