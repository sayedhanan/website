// src/components/CodeTabs.tsx
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

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

  const copyToClipboard = async (code: string, tabIndex: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [tabIndex]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [tabIndex]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Clean up the code - handle escaped characters and formatting
  const cleanCode = (code: string) => {
    if (!code) return '';
    return code
      .replace(/\\n/g, '\n')  // Convert \n to actual newlines
      .replace(/\\t/g, '\t')  // Convert \t to actual tabs
      .replace(/\\'/g, "'")   // Convert \' to '
      .replace(/\\"/g, '"')   // Convert \" to "
      .trim();
  };

  if (!data || data.length === 0) {
    return <div className="p-4 border border-red-500 text-red-500">No code data provided</div>;
  }

  const currentTab = data[activeTab];
  if (!currentTab) {
    return <div className="p-4 border border-red-500 text-red-500">Invalid tab data</div>;
  }

  const cleanedCode = cleanCode(currentTab.code);

  return (
    <div className={`my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      {/* Title */}
      {title && (
        <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h4>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex">
          {data.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === index
                  ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Copy Button */}
        <div className="flex items-center pr-2">
          <button
            onClick={() => copyToClipboard(cleanedCode, activeTab)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
            title="Copy code"
          >
            {copiedStates[activeTab] ? (
              <>
                <Check className="w-3 h-3 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content - Multiple approaches for maximum compatibility */}
      <div className="relative bg-gray-900">
        {/* Approach 1: Direct text content */}
        <div 
          className="p-4 overflow-x-auto text-sm leading-relaxed text-gray-100 font-mono"
          style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }}
        >
          {cleanedCode}
        </div>
        
        {/* Language indicator */}
        <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-gray-400 bg-gray-800 rounded">
          {currentTab.language}
        </div>
      </div>
    </div>
  );
}

// Simple component for quick usage with common languages
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
    bash: 'Bash'
  };

  const data = Object.entries(languages)
    .filter(([_, code]) => code && code.trim())
    .map(([lang, code]) => ({
      label: languageLabels[lang] || lang.charAt(0).toUpperCase() + lang.slice(1),
      language: lang === 'javascript' ? 'js' : lang === 'typescript' ? 'ts' : lang,
      code: code as string
    }));

  if (data.length === 0) {
    return <div className="p-4 border border-red-500 text-red-500">No valid code provided to QuickCodeTabs</div>;
  }

  return <CodeTabs data={data} title={title} />;
}