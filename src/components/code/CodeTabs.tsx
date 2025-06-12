// src/components/CodeTabs.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
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
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const copyToClipboard = async (code: string, tabIndex: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates((prev) => ({ ...prev, [tabIndex]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [tabIndex]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
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

  useEffect(() => {
    // Clear any existing timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    setIsLoading(true);

    // Debounce highlighting to prevent blocking
    highlightTimeoutRef.current = setTimeout(async () => {
      try {
        const highlighted: { [key: number]: string } = {};
        
        // Process tabs in batches to prevent blocking
        for (let i = 0; i < data.length; i++) {
          const tab = data[i];
          const cleanedCode = cleanCode(tab.code);
          
          try {
            const html = await codeToHtml(cleanedCode, {
              lang: tab.language,
              theme: 'github-dark',
            });
            highlighted[i] = html;
          } catch (error) {
            console.error(`Failed to highlight ${tab.language}:`, error);
            // Fallback with proper escaping
            const escapedCode = cleanedCode
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
            highlighted[i] = `<pre class="shiki github-dark" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code>${escapedCode}</code></pre>`;
          }
          
          // Yield control back to browser every few iterations
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

  if (!data || data.length === 0) {
    return (
      <div className="p-3 sm:p-4 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
        No code data provided
      </div>
    );
  }

  const currentTab = data[activeTab];
  const cleanedCode = cleanCode(currentTab.code);

  return (
    <div className={`my-4 sm:my-6 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm ${className}`}>
      
      {/* Optional Title */}
      {title && (
        <div className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {title}
          </h4>
        </div>
      )}

      {/* Header: Tabs + Copy Button */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 min-h-[48px]">
        
        {/* Tabs - Responsive scrolling */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-2 sm:px-4 py-2 space-x-1 min-w-max">
            {data.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded whitespace-nowrap transition-colors duration-200 ${
                  activeTab === index
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                disabled={isLoading}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex-shrink-0 px-2 sm:px-4 py-2">
          <button
            onClick={() => copyToClipboard(cleanedCode, activeTab)}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap"
            disabled={isLoading}
          >
            {copiedStates[activeTab] ? (
              <>
                <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-green-500 hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 flex-shrink-0" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block */}
      <div className="relative">
        {/* Language Badge - Responsive positioning */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 px-1.5 sm:px-2 py-1 text-xs bg-black/30 text-white rounded backdrop-blur-sm">
          {currentTab.language}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-20 backdrop-blur-sm">
            <div className="text-xs text-gray-400 animate-pulse">Highlighting...</div>
          </div>
        )}
        
        {/* Code Content */}
        <div className="overflow-auto max-h-[70vh] sm:max-h-[80vh]">
          {highlightedCode[activeTab] ? (
            <div 
              className="[&>pre]:m-0 [&>pre]:border-0 [&>pre]:rounded-none [&>pre]:bg-transparent [&>pre]:p-3 [&>pre]:sm:p-4 [&>pre]:text-xs [&>pre]:sm:text-sm [&>pre]:leading-relaxed [&>pre]:overflow-visible [&_code]:block [&_code]:min-w-max [&_code]:pr-8 [&_code]:sm:pr-12"
              dangerouslySetInnerHTML={{ __html: highlightedCode[activeTab] }}
            />
          ) : (
            <pre className="m-0 p-3 sm:p-4 bg-gray-900 text-gray-100 text-xs sm:text-sm font-mono leading-relaxed overflow-visible">
              <code className="block min-w-max pr-8 sm:pr-12">{cleanedCode}</code>
            </pre>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Quick setup component
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
    python: 'Python',
    javascript: 'JS',
    typescript: 'TS', 
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    cpp: 'C++',
    html: 'HTML',
    css: 'CSS',
    bash: 'Bash',
    json: 'JSON',
  };

  const languageMapping: { [key: string]: string } = {
    javascript: 'js',
    typescript: 'ts',
    cpp: 'cpp',
  };

  const data = Object.entries(languages)
    .filter(([_, code]) => code && code.trim())
    .map(([lang, code]) => ({
      label: languageLabels[lang] || lang,
      language: languageMapping[lang] || lang,
      code: code as string,
    }));

  if (data.length === 0) {
    return (
      <div className="p-3 sm:p-4 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg text-sm">
        No valid code provided
      </div>
    );
  }

  return <CodeTabs data={data} title={title} />;
}

// Server-side version with better error handling
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
          code: `<pre class="shiki github-dark" style="background-color:#0d1117;color:#e6edf3" tabindex="0"><code>${escapedCode}</code></pre>`
        };
      }
    })
  );

  return <CodeTabs data={highlightedData} title={title} className={className} />;
}