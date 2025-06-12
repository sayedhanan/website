// src/components/CodeTabs.tsx
'use client';

import { useState, useEffect } from 'react';
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
    const highlightAllTabs = async () => {
      const highlighted: { [key: number]: string } = {};
      for (let i = 0; i < data.length; i++) {
        const tab = data[i];
        const cleanedCode = cleanCode(tab.code);
        try {
          const html = await codeToHtml(cleanedCode, {
            lang: tab.language,
            theme: 'one-dark-pro',
          });
          const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
          highlighted[i] = codeMatch ? codeMatch[1] : html;
        } catch (error) {
          console.error(`Failed to highlight ${tab.language}:`, error);
          highlighted[i] = cleanedCode.replace(/[&<>'"]/g, (char) => {
            const escapeMap: { [key: string]: string } = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              "'": '&#39;',
              '"': '&quot;',
            };
            return escapeMap[char];
          });
        }
      }
      setHighlightedCode(highlighted);
    };

    if (data.length > 0) {
      highlightAllTabs();
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="p-4 border border-red-500 text-red-500 rounded-lg">
        No code data provided
      </div>
    );
  }

  const currentTab = data[activeTab];
  const cleanedCode = cleanCode(currentTab.code);

  return (
    <div
      className={`my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-md ${className}`}
    >
      {title && (
        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h4>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div role="tablist" className="flex">
          {data.map((tab, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeTab === index}
              onClick={() => setActiveTab(index)}
              className={`relative px-4 py-2 text-sm font-medium focus:outline-none transition-all duration-200 border-b-2 ${
                activeTab === index
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center pr-2">
          <button
            onClick={() => copyToClipboard(cleanedCode, activeTab)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            aria-label="Copy code"
          >
            {copiedStates[activeTab] ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="overflow-x-auto text-sm leading-relaxed bg-[#282c34] text-white font-mono rounded-b-lg m-0 p-3 sm:p-4">
          {highlightedCode[activeTab] ? (
            <code
              dangerouslySetInnerHTML={{ __html: highlightedCode[activeTab] }}
            />
          ) : (
            <code>{cleanedCode}</code>
          )}
        </pre>
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-800 rounded">
          {currentTab.language}
        </div>
      </div>
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
  title?: string;
}

export function QuickCodeTabs({ title, ...languages }: QuickCodeTabsProps) {
  const languageLabels: { [key: string]: string } = {
    python: 'Python',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    java: 'Java',
    go: 'Go',
    rust: 'Rust',
    cpp: 'C++',
    html: 'HTML',
    css: 'CSS',
    bash: 'Bash',
  };

  const data = Object.entries(languages)
    .filter(([_, code]) => code && code.trim())
    .map(([lang, code]) => ({
      label: languageLabels[lang] || lang.charAt(0).toUpperCase() + lang.slice(1),
      language: lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : lang,
      code: code as string,
    }));

  if (data.length === 0) {
    return (
      <div className="p-4 border border-red-500 text-red-500 rounded-lg">
        No valid code provided to QuickCodeTabs
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
  preHighlighted = false,
}: ServerCodeTabsProps) {
  if (!preHighlighted) {
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
            theme: 'one-dark-pro',
          });
          const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
          return {
            ...tab,
            code: codeMatch ? codeMatch[1] : html,
          };
        } catch (error) {
          console.error(`Failed to highlight ${tab.language}:`, error);
          return {
            ...tab,
            code: cleanedCode.replace(/[&<>'"]/g, (char) => {
              const escapeMap: { [key: string]: string } = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;',
              };
              return escapeMap[char];
            }),
          };
        }
      })
    );
    return <CodeTabs data={highlightedData} title={title} className={className} />;
  }

  return <CodeTabs data={data} title={title} className={className} />;
}
