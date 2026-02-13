import './globals.css';
import Layout from '../components/Layout';
import { Inter, Noto_Sans_Tamil, Catamaran } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'] });
const catamaran = Catamaran({ subsets: ['latin', 'tamil'] });

export const metadata = {
  title: 'Wedding Add-Ons Tamil Nadu',
  description: 'Customize your wedding with exclusive add-ons.',
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}