import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Bot } from 'lucide-react';

// Simple, clean command structure
interface Command {
  description: string;
  execute: (args: string[]) => React.ReactNode[];
}

// All commands in one clean object
const createCommands = (): Record<string, Command> => {
  const personalInfo = {
    name: "CS/AI Student & Full Stack Developer",
    passion: "Passionate about machine learning and web technologies",
    current: "Currently exploring: Deep Learning, React, Next.js"
  };

  const projects = [
    "AI-powered recommendation system (2024)",
    "Real-time chat application with WebSocket",
    "Neural network visualization tool",
    "Automated trading bot prototype"
  ];

  const skills = {
    programming: "Python, JavaScript, TypeScript, Java",
    ai: "TensorFlow, PyTorch, scikit-learn, OpenAI API",
    web: "React, Next.js, Node.js, Express, PostgreSQL",
    tools: "Docker, AWS, Git, Linux"
  };

  return {
    help: {
      description: "Show available commands",
      execute: () => [
        <div key="help" className="space-y-1">
          <div className="text-cyan-400 mb-2">Available commands:</div>
          <div>• <span className="text-yellow-400">help</span> - Show this help message</div>
          <div>• <span className="text-yellow-400">about</span> - About me</div>
          <div>• <span className="text-yellow-400">projects</span> - Recent projects</div>
          <div>• <span className="text-yellow-400">skills</span> - Technical skills</div>
          <div>• <span className="text-yellow-400">contact</span> - Contact information</div>
          <div>• <span className="text-yellow-400">clear</span> - Clear terminal</div>
        </div>
      ]
    },

    about: {
      description: "About me",
      execute: () => [
        <div key="about" className="space-y-1">
          <div>🚀 {personalInfo.name}</div>
          <div>{personalInfo.passion}</div>
          <div>Building the future, one algorithm at a time</div>
          <div className="text-gray-400">{personalInfo.current}</div>
        </div>
      ]
    },

    projects: {
      description: "Show recent projects",
      execute: () => [
        <div key="projects" className="space-y-1">
          <div className="text-cyan-400 mb-1">🚀 Recent Projects:</div>
          {projects.map((project, i) => (
            <div key={i}>• {project}</div>
          ))}
        </div>
      ]
    },

    skills: {
      description: "List technical skills",
      execute: () => [
        <div key="skills" className="space-y-1">
          <div>💻 Programming: {skills.programming}</div>
          <div>🤖 AI/ML: {skills.ai}</div>
          <div>🌐 Web: {skills.web}</div>
          <div>☁️ Tools: {skills.tools}</div>
        </div>
      ]
    },

    contact: {
      description: "Show contact information",
      execute: () => [
        <div key="contact" className="space-y-1">
          <div>📧 Email: hello@sayedhanan.com</div>
          <div>🐙 GitHub: github.com/sayedhanan</div>
          <div>💼 LinkedIn: linkedin.com/in/sayedhanan</div>
          <div>🐦 Twitter: @sayedhanan</div>
        </div>
      ]
    },

    clear: {
      description: "Clear terminal history",
      execute: () => []
    }
  };
};

const useTerminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lines, setLines] = useState<React.ReactNode[]>([]);

  const commands = createCommands();

  useEffect(() => {
    setLines([
      <div key="welcome" className="mb-2">
        Hi, I’m Hanan, this terminal is your guide. Type a command to begin.<br />
        Type <span className="text-cyan-400 font-semibold">help</span> for available commands
      </div>
    ]);
  }, []);

  const executeCommand = (commandText: string) => {
    if (!commandText.trim()) return;

    const [cmd, ...args] = commandText.trim().split(' ');
    const command = commands[cmd.toLowerCase()];

    setHistory(prev => [...prev.slice(-49), commandText]);
    setHistoryIndex(-1);

    const commandLine = (
      <div key={`cmd-${Date.now()}`} className="mb-1">
        <span className="text-green-400">$</span> {commandText}
      </div>
    );

    if (cmd.toLowerCase() === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    if (!command) {
      setLines(prev => [
        ...prev,
        commandLine,
        <div key={`err-${Date.now()}`} className="text-red-400 mb-2">
          Command not found: {cmd}<br />
          Type <span className="text-cyan-400">help</span> for available commands
        </div>
      ]);
    } else {
      const output = command.execute(args);
      setLines(prev => [
        ...prev,
        commandLine,
        <div key={`out-${Date.now()}`} className="mb-2">
          {output}
        </div>
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        executeCommand(input);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (history.length > 0) {
          const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1;
          if (newIndex >= history.length) {
            setHistoryIndex(-1);
            setInput('');
          } else {
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
          }
        }
        break;
    }
  };

  return {
    input,
    setInput,
    lines,
    handleKeyDown,
    executeCommand,
    commands: Object.keys(commands)
  };
};

const AIInterface = () => {
  const [messages, setMessages] = useState<Array<{ id: number, type: 'user' | 'ai', content: string }>>([
    {
      id: 1,
      type: 'ai',
      content: '🤖 Hello! I\'m your AI assistant. I can help you learn more about my background, projects, and skills. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai' as const,
        content: 'This is a placeholder response. AI functionality will be integrated soon! 🚀'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed space-y-3"
      >
        {messages.map((message) => (
          <div key={message.id} className={`${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[80%] p-2 rounded ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-100'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-gray-700 flex-1 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="Ask me anything..."
          autoFocus
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default function Terminal() {
  const [mode, setMode] = useState<'terminal' | 'ai'>('terminal');
  const { input, setInput, lines, handleKeyDown } = useTerminal();
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'terminal') {
      if (terminalContentRef.current) {
        terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [lines, mode]);

  const handleTerminalClick = () => {
    if (mode === 'terminal' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-2xl border border-gray-700 rounded-xl overflow-hidden shadow-2xl bg-slate-900 text-white">
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="text-sm text-gray-400 ml-2">
            {mode === 'terminal' ? 'Terminal' : 'Ai-Assistant'}
          </div>
        </div>
        <button
          onClick={() => setMode(mode === 'terminal' ? 'ai' : 'terminal')}
          className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          {mode === 'terminal' ? (
            <>
              <Bot className="w-4 h-4" />
              <span>AI</span>
            </>
          ) : (
            <>
              <TerminalIcon className="w-4 h-4" />
              <span>Terminal</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 h-[400px]">
        {mode === 'terminal' ? (
          <div
            className="h-full overflow-y-auto font-mono text-sm leading-relaxed cursor-text"
            ref={terminalContentRef}
            onClick={handleTerminalClick}
          >
            {lines}
            <div className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent flex-1 focus:outline-none text-white caret-green-400"
                autoFocus
                spellCheck={false}
                placeholder=""
              />
            </div>
          </div>
        ) : (
          <AIInterface />
        )}
      </div>
    </div>
  );
}
