'use client';

import React, { useState, useRef, useEffect, KeyboardEvent, JSX } from 'react';

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
  const [commands, setCommands] = useState<Record<string, { desc: string; response: string[] }> | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 1) Fetch commands.json on mount
  useEffect(() => {
    fetch('/commands.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => setCommands(data))
      .catch(err => {
        console.error('Failed to load commands.json', err);
        setLines(prev => [
          ...prev,
          <div key="err-load" className="output error">
            ⚠️ Could not load commands. Check console.
          </div>
        ]);
      });
  }, []);

  // 2) Handle a user-entered command
  const handleCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    setHistory(h => [...h, cmd]);
    setHistoryIndex(history.length + 1);

    // echo the prompt + command
    setLines(prev => [
      ...prev,
      <div key={`cmd-${Date.now()}`} className="output">
        <span className="prompt">$</span> {raw}
      </div>
    ]);

    if (!commands) {
      // still loading
      setLines(prev => [
        ...prev,
        <div key={`err-${Date.now()}`} className="output error">
          Commands are still loading...
        </div>
      ]);
      setInput('');
      return;
    }

    const def = commands[cmd];
    if (def) {
      // special case: clear
      if (cmd === 'clear') {
        setLines([]);
      } else {
        // render each line of response
        const outputElems = def.response.map((line, i) => (
          <div key={`out-${Date.now()}-${i}`} className="output">
            {line}
          </div>
        ));
        setLines(prev => [...prev, ...outputElems]);
      }
    } else if (cmd) {
      // unknown
      setLines(prev => [
        ...prev,
        <div key={`err-${Date.now()}`} className="output error">
          Command not found: {cmd}<br />
          Type <span className="command">'help'</span> for available commands
        </div>
      ]);
    }

    setInput('');
  };

  // 3) Keyboard nav & submit
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.max(historyIndex - 1, 0);
      setHistoryIndex(idx);
      setInput(history[idx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.min(historyIndex + 1, history.length);
      setHistoryIndex(idx);
      setInput(idx < history.length ? history[idx] : '');
    }
  };

  // 4) Auto-scroll
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full max-w-lg border border-gray-700 rounded-xl overflow-hidden shadow-2xl bg-[#1a202c] text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-sm text-gray-400 ml-2">bash</div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-4 h-[400px] overflow-y-auto font-mono">
        {lines}
        <div className="input-line flex items-center mt-2">
          <span className="prompt mr-2 text-green-300">$</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            className="bg-transparent flex-1 focus:outline-none caret-green-500"
            style={{ color: '#fff' }}
          />
        </div>
      </div>
    </div>
  );
}
