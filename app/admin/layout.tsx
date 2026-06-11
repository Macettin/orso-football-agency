import type {Metadata} from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | Orso Football Agency',
  robots: {index: false, follow: false}
};

export default function AdminRootLayout({
  children
}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-ink font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
