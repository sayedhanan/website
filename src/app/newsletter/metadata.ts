import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter — Sayed Hanan',
  description: 'Archive of my newsletter posts — thoughts on AI, CS, tech, and my learning journey. Published on Substack.',
  openGraph: {
    title: 'Newsletter — Sayed Hanan',
    description: 'Archive of my newsletter posts — thoughts on AI, CS, tech, and my learning journey. Published on Substack.',
    url: 'https://sayedhanan.com/newsletter',
    siteName: 'Sayed Hanan',
    images: [
      {
        url: 'https://sayedhanan.com/og-image-newsletter.png',
        width: 1200,
        height: 630,
        alt: 'Sayed Hanan Newsletter',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter — Sayed Hanan',
    description: 'Archive of my newsletter posts — thoughts on AI, CS, tech, and my learning journey. Published on Substack.',
    images: ['https://sayedhanan.com/og-image-newsletter.png'],
  },
};
