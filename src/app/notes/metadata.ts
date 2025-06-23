import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notes — Sayed Hanan',
  description: 'Browse my collection of notes and documentation on CS, AI, and my learning journey. Organized for easy navigation.',
  openGraph: {
    title: 'Notes — Sayed Hanan',
    description: 'Browse my collection of notes and documentation on CS, AI, and my learning journey. Organized for easy navigation.',
    url: 'https://sayedhanan.com/notes',
    siteName: 'Sayed Hanan',
    images: [
      {
        url: 'https://sayedhanan.com/og-image-notes.png',
        width: 1200,
        height: 630,
        alt: 'Sayed Hanan Notes',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notes — Sayed Hanan',
    description: 'Browse my collection of notes and documentation on CS, AI, and my learning journey.',
    images: ['https://sayedhanan.com/og-image-notes.png'],
  },
};
