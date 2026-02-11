import './globals.css';
import Layout from '../components/Layout';

export const metadata = {
  title: 'Wedding Add-Ons Tamil Nadu',
  description: 'Customize your wedding with exclusive add-ons.',
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
