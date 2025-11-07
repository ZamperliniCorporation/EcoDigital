import type { Metadata } from 'next';
import './globals.css'; // Essencial para carregar os estilos

export const metadata: Metadata = {
  title: 'EcoDigital',
  description: 'Gamificando a Sustentabilidade Digital',
  icons: {
    icon: '/images/EcoDigital-Logo.png',
    shortcut: '/images/EcoDigital-Logo.png',
    apple: '/images/EcoDigital-Logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );
}