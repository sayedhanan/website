import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Define custom components for MDX
export const mdxComponents = {
  // Override default elements with custom styling
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="mt-10 mb-6 text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-8 mb-4 text-2xl font-semibold">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-6 mb-3 text-xl font-semibold">{children}</h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (href && (href.startsWith('http') || href.startsWith('#'))) {
      return (
        <a
          href={href}
          className="text-blue-600 hover:underline dark:text-blue-400"
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href || '/'} className="text-blue-600 hover:underline dark:text-blue-400">
        {children}
      </Link>
    )
  },
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-4 ml-6 list-disc">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-4 ml-6 list-decimal">{children}</ol>
  ),
  li: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic">
      {children}
    </blockquote>
  ),
  // Use Next.js Image component for better performance
  img: ({ src, alt, width, height }: { src?: string; alt?: string; width?: string; height?: string }) => {
    if (!src) return null
    return (
      <div className="my-6">
        <Image
          src={src}
          alt={alt || ''}
          width={width ? parseInt(width) : 800}
          height={height ? parseInt(height) : 450}
          className="rounded-lg"
        />
        {alt && <p className="mt-2 text-center text-sm text-gray-500">{alt}</p>}
      </div>
    )
  },
  // Extra wrapper for code blocks with language detection only
  pre: ({ children }: { children: React.ReactNode }) => {
    // If not an element, render as is
    if (!React.isValidElement(children)) {
      return <div className="my-6 overflow-hidden rounded-lg"><pre>{children}</pre></div>
    }
    const codeElement = React.Children.only(children) as React.ReactElement<{
      'data-language'?: string
      className?: string
    }>
    // Detect language
    const lang = codeElement.props['data-language'] ||
      (codeElement.props.className?.match(/language-(\w+)/)?.[1] ?? '')

    return (
      <div className="my-6 overflow-hidden rounded-lg">
        {/* Language label */}
        {lang && <div className="text-right text-xs uppercase opacity-70 mb-1">{lang}</div>}
        <pre>{children}</pre>
      </div>
    )
  },
}
