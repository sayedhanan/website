'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';

type Command = {
  desc: string;
  execute: () => JSX.Element;
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<JSX.Element[]>([
    <div key="welcome" className="output">
      Welcome to Interactive Portfolio v1.0<br />
      Type <span className="command">'help'</span> for available commands
    </div>
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const contentRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, Command> = {
    help: {
      desc: 'Show available commands',
      execute: () => (
        <div className="output">
          Available commands:<br />
          {Object.entries(commands).map(([cmd, config]) => (
            <div key={cmd} className="flex gap-4">
              <span className="command flex-1">{cmd}</span>
              <span className="flex-[3]">{config.desc}</span>
            </div>
          ))}
        </div>
      )
    },
    about: {
      desc: 'About me',
      execute: () => (
        <div className="output">
          <span className="highlight">Full Stack Developer</span> with 3+ years experience<br />
          Specialized in React, Next.js, and modern web technologies<br />
          Passionate about UX and performance optimization<br />
          Tech stack: TypeScript, Node.js, Tailwind, PostgreSQL
        </div>
      )
    },
    projects: {
      desc: 'Show recent projects',
      execute: () => (
        <div className="output">
          <span className="highlight">2024:</span> E-commerce platform with real-time analytics<br />
          <span className="highlight">2023:</span> Healthcare management system<br />
          <span className="highlight">2022:</span> AI-powered content recommendation engine
        </div>
      )
    },
    skills: {
      desc: 'List technical skills',
      execute: () => (
        <div className="output">
          <div className="flex flex-wrap gap-2">
            {['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind', 'GraphQL', 'AWS', 'Docker'].map(skill => (
              <span key={skill} className="success bg-opacity-20 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )
    },
    contact: {
      desc: 'Show contact information',
      execute: () => (
        <div className="output">
          Email: <span className="highlight">hello@sayedhanan.com</span><br />
          GitHub: <span className="highlight">github.com/sayedhanan</span><br />
          LinkedIn: <span className="highlight">linkedin.com/in/sayedhanan</span>
        </div>
      )
    },
    clear: {
      desc: 'Clear terminal history',
      execute: () => {
        setLines([]);
        return <></>;
      }
    }
  };

  const handleCommand = (command: string) => {
    const cmd = command.trim().toLowerCase();
    const newHistory = [...history, cmd];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length);

    // Add command to output
    setLines(prev => [
      ...prev,
      <div key={`cmd-${Date.now()}`} className="output">
        <span className="prompt">$</span> {command}
      </div>
    ]);

    // Process command
    if (commands[cmd]) {
      setLines(prev => [...prev, commands[cmd].execute()]);
    } else if (cmd) {
      setLines(prev => [
        ...prev,
        <div key={`error-${Date.now()}`} className="output error">
          Command not found: {cmd}<br />
          Type <span className="command">'help'</span> for available commands
        </div>
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = Math.max(historyIndex - 1, 0);
      setHistoryIndex(newIndex);
      setInput(history[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = Math.min(historyIndex + 1, history.length);
      setHistoryIndex(newIndex);
      setInput(newIndex < history.length ? history[newIndex] : '');
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full max-w-lg border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-sm text-gray-400 ml-2">bash</div>
      </div>

      {/* Terminal content */}
      <div 
        ref={contentRef}
        className="bg-gray-900 p-4 h-[400px] overflow-y-auto font-mono"
      >
        {lines}
        <div className="input-line flex items-center mt-2">
          <span className="prompt text-green-400 mr-2">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="bg-transparent text-white flex-1 focus:outline-none caret-green-500"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}