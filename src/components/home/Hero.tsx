'use client';

import { cn } from '@/utils/cn';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Terminal from '@/components/home/Terminal';
import SubstackSignupForm from '../ui/SubstackSignupForm';

interface AnimatedTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterType?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  words,
  typingSpeed = 150,
  deletingSpeed = 75,
  pauseAfterType = 1500,
  className = '',
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const currentWord = useMemo(
    () => words[wordIndex % words.length],
    [wordIndex, words]
  );

  const handleTyping = useCallback(() => {
    if (!isDeleting) {
      if (display.length < currentWord.length) {
        setTimeout(() => {
          setDisplay(currentWord.slice(0, display.length + 1));
        }, typingSpeed);
      } else {
        setTimeout(() => setIsDeleting(true), pauseAfterType);
      }
    } else {
      if (display.length > 0) {
        setTimeout(() => {
          setDisplay(currentWord.slice(0, display.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [
    display,
    isDeleting,
    currentWord,
    typingSpeed,
    deletingSpeed,
    pauseAfterType,
    words.length,
  ]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (words.length > 0) {
      timeoutId = setTimeout(handleTyping, 0);
    }
    return () => clearTimeout(timeoutId);
  }, [handleTyping, words.length]);

  return (
    <span
      className={className}
      aria-live="polite"
      aria-label={`Currently showing: ${display}`}
    >
      {display}
      <span
        className="inline-block w-1 h-[1em] bg-[var(--color-primary-text)] ml-0.5 align-middle"
        style={{ animation: 'blink 1s step-start infinite' }}
        aria-hidden="true"
      />
    </span>
  );
};

export default function Hero() {
  const animatedWords = useMemo(() => ['A Student', 'A Curious Being'], []);

  return (
    <div
      aria-label="Homepage hero section"
      className={cn(
        'flex flex-col lg:flex-row items-start gap-10 py-8'
      )}
    >
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1 }
          50% { opacity: 0 }
        }
      `}</style>

      {/* Left: Text & Form */}
      <div className="w-full max-w-2xl mx-auto lg:mx-0 space-y-6">
        <h1
          className={cn(
            'text-4xl md:text-5xl lg:text-6xl',
            'font-bold leading-tight',
            'text-[var(--color-primary-text)]'
          )}
        >
          Hi, I&rsquo;m Sayed Hanan.
          <br />
          <AnimatedText
            words={animatedWords}
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          />
        </h1>

        <p
          className={cn(
            'text-xl md:text-2xl',
            'text-[var(--color-secondary-text)]',
            'max-w-2xl'
          )}
        >
          {/* I&rsquo;m studying software engineering and fascinated
          by AI. This is where I share my experiments, mistakes, and occasional
          wins. If you&rsquo;re also learning, maybe we can figure things out
          together. */}
          CS student trying to make sense of AI and software development.
          I put my notes and experiments here - some good, some terrible, all real. 
          Welcome to the mess.
        </p>

        <SubstackSignupForm />
      </div>

      {/* Right: Terminal */}
      <div className="w-full max-w-2xl mx-auto lg:mx-0 flex justify-center">
        <Terminal />
      </div>
    </div>
  );
}
