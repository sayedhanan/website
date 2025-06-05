'use client';

import { cn } from '@/utils/cn';
import Terminal from './Terminal';
import { Input } from '@/components/ui/input';

export default function Hero() {
    return (
        <div
            aria-label="Homepage hero content"
            className={cn(
                'flex flex-col lg:flex-row items-center gap-10 py-8'
            )}
        >
            {/* Text & Newsletter Form */}
            <div className="flex-1 space-y-6">
                <h1
                    className={cn(
                        'text-4xl md:text-5xl lg:text-6xl',
                        'font-bold leading-tight',
                        'text-gray-900 dark:text-white'
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
                        'text-gray-600 dark:text-gray-300',
                        'max-w-2xl'
                    )}
                >
                    Full-stack developer specializing in modern JavaScript frameworks and
                    UX-focused design. Welcome to my interactive portfolio.
                </p>

                <div className="pt-4">
                    {/* <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:opacity-90 transition-opacity"
            >
              View Projects
            </button>
            <button
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Download Resume
            </button>
          </div> */}
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
                            inputSize="sm"
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
            </div>

            {/* Terminal Component */}
            <div className="flex-1 flex justify-center w-full">
                <Terminal />
            </div>
        </div>
    );
}