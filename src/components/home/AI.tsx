// File: AI.tsx
"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
}

const AIInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    type: 'ai',
    content: `🤖 Hello! I'm your AI assistant. I can help you learn more about my background, projects, and skills. What would you like to know?`,
  }]);
  const [input, setInput] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight });
  }, [messages]);

  const handleSendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { id: Date.now(), type: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiMessage: Message = { id: Date.now() + 1, type: 'ai', content: 'This is a placeholder response. AI functionality will be integrated soon! 🚀' };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div ref={contentRef} className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={msg.type === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[80%] p-2 rounded ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          className="bg-gray-700 flex-1 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button onClick={handleSendMessage} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Send
        </button>
      </div>
    </div>
  );
};

export default AIInterface;
