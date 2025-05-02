'use client';

import Image from 'next/image';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';

export default function Hero() {
  return (
    <div
      aria-label="Homepage hero content"
      className={cn(
        'flex flex-col-reverse lg:flex-row items-center gap-8'
      )}
    >
      {/* Text & Newsletter Form */}
      <div className="flex-1 space-y-6">
        <h1
          className={cn(
            'text-3xl md:text-4xl lg:text-5xl',
            'font-bold leading-tight',
            'text-[--color-primary-text]'
          )}
        >
          Hi, I’m Jane Doe.
          <br />
          I build web experiences.
        </h1>
        <p
          className={cn(
            'text-lg md:text-xl',
            'text-[--color-secondary-text]',
            'max-w-xl'
          )}
        >
          Welcome to my personal site—explore my blog, portfolio, and courses.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: hook up newsletter
          }}
          className="flex flex-col sm:flex-row items-center sm:items-end gap-4"
        >
          <Input
            id="newsletter-email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            required
            inputSize="default"
          />
          <button
            type="submit"
            className={cn(
              'btn btn-primary',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[--color-accent]'
            )}
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Hero Image */}
      <div className="flex-1">
        <Image
          src=""
          alt="Placeholder hero"
          width={600}
          height={400}
          className="w-full max-w-md rounded-lg shadow-lg"
          priority
        />
      </div>
    </div>
  );
}
