'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, ExternalLink, Filter, Clock } from 'lucide-react'
import type { NewsletterMeta } from '@/utils/newsletter'

export default function NewsletterArchive({ newsletters }: { newsletters: NewsletterMeta[] }) {
  const [year, setYear] = useState<string>('all')
  const [month, setMonth] = useState<string>('all')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  const availableYears = useMemo(
    () => Array.from(new Set(newsletters.map(n => new Date(n.date).getFullYear())))
      .sort((a, b) => b - a),
    [newsletters]
  )

  const availableMonths = useMemo(() => {
    if (year === 'all') return []
    return Array.from(new Set(
      newsletters
        .filter(n => new Date(n.date).getFullYear().toString() === year)
        .map(n => new Date(n.date).getMonth())
    )).sort((a, b) => b - a)
  }, [year, newsletters])

  const filtered = useMemo(() => {
    return newsletters.filter(n => {
      const d = new Date(n.date)
      const y = d.getFullYear().toString()
      const m = d.getMonth().toString()
      return (year === 'all' || y === year) && (month === 'all' || m === month)
    })
  }, [year, month, newsletters])

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const monthName = (i: number) =>
    ['January','February','March','April','May','June','July','August','September','October','November','December'][i]

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary-text)]">Newsletter Archive</h1>
            <p className="text-[var(--color-secondary-text)]">Thoughts on AI, CS & tech—all on Substack.</p>
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </header>

      {showFilters && (
        <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="font-medium text-sm">Year:</label>
              <select
                value={year}
                onChange={e => { setYear(e.target.value); setMonth('all') }}
                className="select select-bordered"
              >
                <option value="all">All Years</option>
                {availableYears.map(y => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
            </div>

            {year !== 'all' && availableMonths.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="font-medium text-sm">Month:</label>
                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="all">All Months</option>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{monthName(m)}</option>
                  ))}
                </select>
              </div>
            )}

            {(year !== 'all' || month !== 'all') && (
              <button
                onClick={() => { setYear('all'); setMonth('all') }}
                className="btn btn-ghost"
              >
                Clear
              </button>
            )}
          </div>
        </section>
      )}

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {filtered.length === 0
          ? <p className="text-center text-[var(--color-secondary-text)]">No newsletters found.</p>
          : filtered.map(n => (
            <article key={n.id} className="card group hover:shadow-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h2 className="card-title group-hover:text-[var(--color-accent)]">{n.title}</h2>
                <div className="flex items-center text-xs text-[var(--color-secondary-text)]">
                  <Calendar className="w-4 h-4 mr-1" /> {fmt(n.date)}
                </div>
              </div>
              <p className="mb-4">{n.excerpt}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 text-xs text-[var(--color-secondary-text)]">
                  <Clock className="w-4 h-4" /> {n.readTime}
                  {n.tags.map(tag => (
                    <span
                      key={tag}  // ← Unique key for each tag
                      className="px-2 py-1 rounded border text-[var(--color-secondary-text)] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={n.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm"
                >
                  Read on Substack <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </article>
          ))
        }
        <p className="text-center text-sm text-[var(--color-secondary-text)]">
          Showing {filtered.length} of {newsletters.length}
        </p>
      </main>
    </div>
  )
}
