import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Sayed Hanan',
  description: 'Explore my blog where I share notes, experiments, and thoughts on CS, AI, and my learning journey.',
  openGraph: {
    title: 'Blog — Sayed Hanan',
    description: 'Explore my blog where I share notes, experiments, and thoughts on CS, AI, and my learning journey.',
    url: 'https://sayedhanan.com/blog',
    siteName: 'Sayed Hanan',
    images: [
      {
        url: 'https://sayedhanan.com/og-image-blog.png',
        width: 1200,
        height: 630,
        alt: 'Sayed Hanan Blog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog — Sayed Hanan',
    description: 'Explore my blog where I share notes, experiments, and thoughts on CS, AI, and my learning journey.',
    images: ['https://sayedhanan.com/og-image-blog.png'],
  },
};
