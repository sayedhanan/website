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
    return Array.from(
      new Set(
        newsletters
          .filter(n => new Date(n.date).getFullYear().toString() === year)
          .map(n => new Date(n.date).getMonth().toString())
      )
    ).sort((a, b) => Number(b) - Number(a))
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
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const monthName = (i: number) =>
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-[var(--color-primary-text)]">
              Newsletter Archive
            </h1>
            <p className="mt-1 text-sm text-[var(--color-secondary-text)]">
              Thoughts on AI, CS & tech—all on Substack.
            </p>
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      {showFilters && (
        <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="font-medium text-sm">Year</label>
              <select
                value={year}
                onChange={e => { setYear(e.target.value); setMonth('all') }}
                className="select select-bordered"
              >
                <option value="all">All</option>
                {availableYears.map(y => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
            </div>
            {year !== 'all' && availableMonths.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="font-medium text-sm">Month</label>
                <select
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="select select-bordered"
                >
                  <option value="all">All</option>
                  {availableMonths.map(m => (
                    <option key={m} value={m}>{monthName(Number(m))}</option>
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

      {/* Timeline */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-[var(--color-secondary-text)]">No newsletters found.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--color-border)]"></div>
            <ul className="space-y-10">
              {filtered.map((n, i) => (
                <li key={`${n.id ?? 'entry'}-${n.date}-${i}`} className="relative pl-12">
                  <span className="absolute left-4 top-1.5 transform -translate-x-1/2 flex h-3 w-3 items-center justify-center">
                    <span className="block h-3 w-3 rounded bg-[var(--color-accent)]"></span>
                  </span>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold text-[var(--color-primary-text)]">
                      {n.title}
                    </h2>
                    <time className="flex items-center text-xs text-[var(--color-secondary-text)]">
                      <Calendar className="w-4 h-4 mr-1" /> {fmt(n.date)}
                    </time>
                  </div>
                  <p className="mb-2 text-sm text-[var(--color-primary-text)]">{n.excerpt}</p>
                  <div className="flex items-center flex-wrap gap-2 text-xs text-[var(--color-secondary-text)] mb-3">
                    <Clock className="w-4 h-4" /> {n.readTime}
                    {n.tags.map((tag, j) => (
                      <span key={`${n.id ?? 'entry'}-tag-${tag}-${i}-${j}`} className="px-2 py-0.5 bg-[var(--color-surface)] rounded border">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={n.substackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-[var(--color-accent)] hover:underline"
                  >
                    Read on Substack <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-12 text-center text-sm text-[var(--color-secondary-text)]">
          Showing <strong>{filtered.length}</strong> of <strong>{newsletters.length}</strong>
        </p>
      </main>
    </div>
  )
}
