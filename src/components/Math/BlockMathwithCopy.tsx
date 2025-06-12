'use client';

import { useState, useRef } from 'react';
import { BlockMath } from 'react-katex';
import { Copy, Check } from 'lucide-react';

interface DisplayMathWithCopyProps {
  children: string;
}

export default function DisplayMathWithCopy({ children }: DisplayMathWithCopyProps) {
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
    <div className="relative my-4">
      <BlockMath>{children}</BlockMath>
      <button
        onClick={handleCopy}
        aria-label="Copy LaTeX"
        className="absolute top-2 right-2 p-1 bg-[var(--color-surface)] rounded hover:bg-[var(--color-border)] transition"
      >
        {copied ? <Check className="w-5 h-5 text-[var(--color-success)]" /> : <Copy className="w-5 h-5" />}
      </button>
    </div>
  );
}
