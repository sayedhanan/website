import { getAllNewsletters, type NewsletterMeta } from '@/utils/newsletter';
import NewsletterArchive from './NewsletterArchive';
import { metadata } from './metadata';

export { metadata };

export default function NewsletterPage() {
  const newsletters: NewsletterMeta[] = getAllNewsletters();
  return <NewsletterArchive newsletters={newsletters} />;
}
