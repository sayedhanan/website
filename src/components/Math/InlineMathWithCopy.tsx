'use client';

import { useState, useRef } from 'react';
import { InlineMath } from 'react-katex';
import { Copy, Check } from 'lucide-react';

interface InlineMathWithCopyProps {
  children: string;
}

export default function InlineMathWithCopy({ children }: InlineMathWithCopyProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number>();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback or error handling
    }
  };

  return (
    <span className="inline-flex items-center space-x-1">
      <InlineMath>{children}</InlineMath>
      <button
        onClick={handleCopy}
        aria-label="Copy LaTeX"
        className="p-1 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Copy className="w-4 h-4" />}
      </button>
    </span>
  );
}
