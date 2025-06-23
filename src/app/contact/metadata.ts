import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Sayed Hanan',
  description: 'Get in touch with Sayed Hanan. Whether you have a question, a collaboration idea, or just want to connect — reach out here.',
  openGraph: {
    title: 'Contact — Sayed Hanan',
    description: 'Get in touch with Sayed Hanan. Whether you have a question, a collaboration idea, or just want to connect — reach out here.',
    url: 'https://sayedhanan.com/contact',
    siteName: 'Sayed Hanan',
    images: [
      {
        url: 'https://sayedhanan.com/og-image-contact.png',  // Can reuse main OG image if you want
        width: 1200,
        height: 630,
        alt: 'Contact Sayed Hanan',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — Sayed Hanan',
    description: 'Get in touch with Sayed Hanan for collaborations or questions.',
    images: ['https://sayedhanan.com/og-image-contact.png'],
  },
};
