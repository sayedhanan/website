import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayed Hanan — CS/AI Student & Curious Explorer',
  description:
    'The personal site of Sayed Hanan — a CS/AI student sharing my learning journey, projects, blogs, notes, and a newsletter. Documenting to learn and grow.',
  keywords: [
    'Sayed Hanan',
    'CS student',
    'AI student',
    'AI projects',
    'learning journey',
    'blog',
    'notes',
    'newsletter',
    'portfolio',
  ],
  authors: [{ name: 'Sayed Hanan' }],
  creator: 'Sayed Hanan',
  metadataBase: new URL('https://sayedhanan.com'),
  alternates: {
    canonical: 'https://sayedhanan.com/',
  },
  openGraph: {
    title: 'Sayed Hanan — CS/AI Student & Curious Explorer',
    description:
      'Follow my journey in CS and AI — I share my projects, blogs, notes, and thoughts as a curious student.',
    url: 'https://sayedhanan.com/',
    siteName: 'Sayed Hanan',
    images: [
      {
        url: 'https://sayedhanan.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sayed Hanan — CS/AI Student Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sayed Hanan — CS/AI Student & Curious Explorer',
    description:
      'CS/AI student sharing my learning journey — projects, blogs, notes, and newsletter.',
    creator: '@iSayedHanan',
    images: ['https://sayedhanan.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};
