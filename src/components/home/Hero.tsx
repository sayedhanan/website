'use client';

import { cn } from '@/utils/cn';
import Terminal from './Terminal';
import SubstackSignupForm from '../ui/SubstackSignupForm';

export default function Hero() {
  return (
    <div
      aria-label="Homepage hero content"
      className={cn('flex flex-col lg:flex-row items-center gap-10 py-8')}
    >
      {/* Text & Newsletter Form */}
      <div className="flex-1 space-y-6">
        <h1
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl',
            'font-bold leading-tight',
            'text-[var(--color-primary-text)]'
          )}
        >
          Hi, I'm Sayed Hanan.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            I build web experiences
          </span>
        </h1>

        <p
          className={cn(
            'text-xl md:text-2xl',
            'text-[var(--color-secondary-text)]',
            'max-w-2xl'
          )}
        >
          Full-stack developer specializing in modern JavaScript frameworks and
          UX-focused design. Welcome to my interactive portfolio.
        </p>

        <div className="pt-4">
          {/* Only the SubstackSignupForm — removed the extra dummy form */}
          <SubstackSignupForm />
        </div>
      </div>

      {/* Terminal Component */}
      <div className="flex-1 flex justify-center w-full">
        <Terminal />
      </div>
    </div>
  );
}
