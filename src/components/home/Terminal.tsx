// Terminal.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import AIInterface from './AI';
import { CombineInterface, useCommandTerminal } from './CombineInterface';

const TerminalInterface: React.FC = () => {
  const { input, setInput, lines, handleKeyDown } = useCommandTerminal();
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalContentRef.current?.scrollTo({ top: terminalContentRef.current.scrollHeight });
    inputRef.current?.focus();
  }, [lines]);

  const handleTerminalClick = () => inputRef.current?.focus();

  return (
    <div ref={terminalContentRef} onClick={handleTerminalClick} className="h-full overflow-y-auto font-mono text-sm leading-relaxed cursor-text" >
      {lines}
      <div className="flex items-center">
        <span className="text-green-400 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent flex-1 focus:outline-none text-white caret-green-400"
          spellCheck={false}
        />
      </div>
    </div>
  );
};

const Terminal: React.FC = () => {
  const [mode, setMode] = useState<'terminal' | 'ai'>('terminal');

  return (
    <CombineInterface mode={mode} onModeChange={setMode}>
      {mode === 'terminal' ? <TerminalInterface /> : <AIInterface />}
    </CombineInterface>
  );
};

export default Terminal;








