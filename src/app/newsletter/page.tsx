// src/app/newsletter/page.tsx
import { getAllNewsletters, type NewsletterMeta } from '@/utils/newsletter'
import NewsletterArchive from './NewsletterArchive'

export default function NewsletterPage() {
  const newsletters: NewsletterMeta[] = getAllNewsletters()
  return <NewsletterArchive newsletters={newsletters} />
}