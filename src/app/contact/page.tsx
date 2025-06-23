import React from 'react';
import { cn } from '@/utils/cn';
import { socialLinks } from '@/constants/social-links';
import { metadata } from './metadata';

export { metadata };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-primary-text)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-2xl space-y-12">
        {/* Intro */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Let&rsquo;s Get In Touch</h1>
          <p className="text-lg text-[var(--color-secondary-text)]">
            Drop me a line or connect on social, I&apos;d love to hear from you!
          </p>
        </div>

        {/* Contact Form */}
        <form
          action="/api/contact"
          method="POST"
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 shadow-lg space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              placeholder="Your Name"
              required
              className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]"
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              required
              className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]"
            />
          </div>
          <textarea
            name="message"
            rows={6}
            placeholder="Your Message"
            required
            className="w-full p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]"
          />
          <button
            type="submit"
            className={cn(
              "btn btn-primary",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]"
            )}
          >
            Send Message
          </button>
        </form>

        {/* Social Icons */}
        <div className="text-center space-y-4">
          <p className="text-[var(--color-secondary-text)]">Or find me on:</p>
          <div className="flex items-center justify-center space-x-6">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full hover:bg-[var(--color-accent-bg)]"
              >
                <Icon size={24} className="text-[var(--color-accent)]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
