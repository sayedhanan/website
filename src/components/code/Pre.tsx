'use client';

import React, { useState, useRef } from 'react';
import { Clipboard, Check } from 'lucide-react';

export interface PreProps extends React.HTMLAttributes<HTMLPreElement> {}

export default function Pre({ children, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    if (!ref.current) return;
    const text = ref.current.innerText;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={handleCopy}
        disabled={copied}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Clipboard size={16} />}
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}
