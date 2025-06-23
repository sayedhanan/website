// src/components/CodeTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { codeToHtml } from 'shiki';

interface CodeTabsProps {
  data: Array<{
    label: string;
    language: string;
    code: string;
  }>;
  title?: string;
  className?: string;
}

export default function CodeTabs({ data, title, className = '' }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});
  const [highlightedCode, setHighlightedCode] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (code: string, tabIndex: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates((prev) => ({ ...prev, [tabIndex]: true }));
      
      // Add haptic feedback on supported devices
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [tabIndex]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedStates((prev) => ({ ...prev, [tabIndex]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [tabIndex]: false }));
        }, 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const cleanCode = (code: string) => {
    if (!code) return '';
    return code
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .trim();
  };

  const checkScrollButtons = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? tabsContainerRef.current.scrollLeft - scrollAmount
        : tabsContainerRef.current.scrollLeft + scrollAmount;
      
      tabsContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [data]);

  useEffect(() => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    setIsLoading(true);

    highlightTimeoutRef.current = setTimeout(async () => {
      try {
        const highlighted: { [key: number]: string } = {};
        
        for (let i = 0; i < data.length; i++) {
          const tab = data[i];
          const cleanedCode = cleanCode(tab.code);
          
          try {
            // Use your custom dark theme colors
            const html = await codeToHtml(cleanedCode, {
              lang: tab.language,
              theme: 'github-dark',
            });
            highlighted[i] = html;
          } catch (error) {
            console.error(`Failed to highlight ${tab.language}:`, error);
            const escapedCode = cleanedCode
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
            highlighted[i] = `<pre class="shiki" style="background-color:var(--color-surface);color:var(--color-primary-text)" tabindex="0"><code>${escapedCode}</code></pre>`;
          }
          
          if (i % 2 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
        
        setHighlightedCode(highlighted);
      } finally {
        setIsLoading(false);
      }
    }, 100);

    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [data]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('.code-tabs-container')) {
        if (e.key === 'ArrowLeft' && activeTab > 0) {
          e.preventDefault();
          setActiveTab(activeTab - 1);
        } else if (e.key === 'ArrowRight' && activeTab < data.length - 1) {
          e.preventDefault();
          setActiveTab(activeTab + 1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, data.length]);

  if (!data || data.length === 0) {
    return (
      <div className="p-3 sm:p-4 border border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-lg text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-error)] flex items-center justify-center text-white text-xs">!</div>
          <span>No code data provided</span>
        </div>
      </div>
    );
  }

  const currentTab = data[activeTab];
  const cleanedCode = cleanCode(currentTab.code);

  return (
    <div className={`code-tabs-container my-4 sm:my-6 rounded-xl border border-[var(--color-border)] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[var(--color-surface)] ${className}`}>
      {title && (
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-[var(--color-background)] to-[var(--color-surface)] border-b border-[var(--color-border)]">
          <h4 className="text-sm font-semibold text-[var(--color-primary-text)] truncate">
            {title}
          </h4>
        </div>
      )}

      <div className="flex items-center justify-between bg-[var(--color-background)] border-b border-[var(--color-border)] min-h-[52px]">
        <div className="flex items-center flex-1 overflow-hidden">
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs('left')}
              className="flex-shrink-0 p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface)] transition-colors duration-200 rounded-l"
              aria-label="Scroll tabs left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          
          <div 
            ref={tabsContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
            onScroll={checkScrollButtons}
          >
            <div className="flex items-center px-2 sm:px-4 py-2 space-x-1 min-w-max">
              {data.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-50 ${
                    activeTab === index
                      ? 'bg-[var(--color-accent)] text-white shadow-md'
                      : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:bg-[var(--color-surface)]'
                  }`}
                  disabled={isLoading}
                  aria-selected={activeTab === index}
                  role="tab"
                >
                  {tab.label}
                  {activeTab === index && (
                    <span className="ml-1 inline-block w-1 h-1 bg-white rounded-full opacity-75"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollTabs('right')}
              className="flex-shrink-0 p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface)] transition-colors duration-200 rounded-r"
              aria-label="Scroll tabs right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-shrink-0 px-2 sm:px-4 py-2">
          <button
            onClick={() => copyToClipboard(cleanedCode, activeTab)}
            className="flex items-center space-x-2 px-3 py-2 text-xs text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] rounded-lg hover:bg-[var(--color-surface)] transition-all duration-200 whitespace-nowrap border border-transparent hover:border-[var(--color-border)] group"
            disabled={isLoading}
            aria-label="Copy code to clipboard"
          >
            {copiedStates[activeTab] ? (
              <>
                <Check className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                <span className="text-[var(--color-success)] hidden sm:inline font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative bg-[var(--color-surface)]">
        <div className="absolute top-3 right-3 z-10 px-2 py-1 text-xs bg-[var(--color-primary-text)] bg-opacity-80 text-[var(--color-background)] rounded-md backdrop-blur-sm font-mono">
          {currentTab.language}
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 bg-[var(--color-surface)] bg-opacity-95 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-sm text-[var(--color-secondary-text)]">
              <div className="animate-spin w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent rounded-full"></div>
              <span>Highlighting code...</span>
            </div>
          </div>
        )}
        
        <div className="overflow-auto max-h-[70vh] sm:max-h-[80vh] w-full custom-scrollbar">
          {highlightedCode[activeTab] ? (
            <div 
              className="[&>pre]:m-0 [&>pre]:border-0 [&>pre]:rounded-none [&>pre]:bg-[var(--color-surface)] [&>pre]:p-4 [&>pre]:sm:p-6 [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:leading-relaxed [&>pre]:overflow-x-auto [&>pre]:w-full [&_code]:block [&_code]:whitespace-pre [&_code]:pr-10 [&_code]:sm:pr-16"
              dangerouslySetInnerHTML={{ __html: highlightedCode[activeTab] }}
            />
          ) : (
            <pre className="m-0 p-4 sm:p-6 bg-[var(--color-surface)] text-[var(--color-primary-text)] text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto w-full">
              <code className="block whitespace-pre pr-10 sm:pr-16">{cleanedCode}</code>
            </pre>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-background);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-border);
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-accent);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-border) var(--color-background);
        }
      `}</style>
    </div>
  );
}

interface QuickCodeTabsProps {
  python?: string;
  javascript?: string;
  typescript?: string;
  java?: string;
  go?: string;
  rust?: string;
  cpp?: string;
  html?: string;
  css?: string;
  bash?: string;
  json?: string;
  title?: string;
}

export function QuickCodeTabs({ title, ...languages }: QuickCodeTabsProps) {
  const languageLabels: { [key: string]: string } = {
    python: '🐍 Python',
    javascript: '📦 JavaScript',
    typescript: '🔷 TypeScript', 
    java: '☕ Java',
    go: '🚀 Go',
    rust: '🦀 Rust',
    cpp: '⚡ C++',
    html: '🌐 HTML',
    css: '🎨 CSS',
    bash: '💻 Bash',
    json: '📋 JSON',
  };

  const languageMapping: { [key: string]: string } = {
    javascript: 'js',
    typescript: 'ts',
    cpp: 'cpp',
  };

  const data = Object.entries(languages)
    .filter(([, code]) => code && code.trim())
    .map(([lang, code]) => ({
      label: languageLabels[lang] || lang,
      language: languageMapping[lang] || lang,
      code: code as string,
    }));

  if (data.length === 0) {
    return (
      <div className="p-3 sm:p-4 border border-[var(--color-error)] bg-[var(--color-error-bg)] text-[var(--color-error)] rounded-lg text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[var(--color-error)] flex items-center justify-center text-white text-xs">!</div>
          <span>No valid code provided</span>
        </div>
      </div>
    );
  }

  return <CodeTabs data={data} title={title} />;
}

interface ServerCodeTabsProps extends CodeTabsProps {
  preHighlighted?: boolean;
}

export async function ServerCodeTabs({
  data,
  title,
  className = '',
}: ServerCodeTabsProps) {
  const highlightedData = await Promise.all(
    data.map(async (tab) => {
      const cleanedCode = tab.code
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
        .trim();
      
      try {
        const html = await codeToHtml(cleanedCode, {
          lang: tab.language,
          theme: 'github-dark',
        });
        return { ...tab, code: html };
      } catch (error) {
        console.error(`Server highlighting failed for ${tab.language}:`, error);
        const escapedCode = cleanedCode
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
        return { 
          ...tab, 
          code: `<pre class="shiki" style="background-color:var(--color-surface);color:var(--color-primary-text)" tabindex="0"><code>${escapedCode}</code></pre>`
        };
      }
    })
  );

  return <CodeTabs data={highlightedData} title={title} className={className} />;
}