"use client";

import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Bot, FileText } from 'lucide-react';

interface Command {
    description: string;
    execute: (args: string[]) => React.ReactNode[];
}

interface CommandData {
    personalInfo: {
        name: string;
        passion: string;
        current: string;
    };
    projects: string[];
    skills: {
        programming: string;
        ai: string;
        web: string;
        tools: string;
    };
    commands: Record<string, {
        description: string;
        type: string;
        content: string;
    }>;
}

interface UseTerminalReturn {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    lines: React.ReactNode[];
    handleKeyDown: (e: React.KeyboardEvent) => void;
}

const formatContent = (content: string, type: string, data: CommandData): React.ReactNode[] => {
    if (type === 'clear') return [];
    if (type === 'help') {
        return [
            <div key="help" className="space-y-1">
                <div className="text-cyan-400 mb-2">Available commands:</div>
                {Object.keys(data.commands).map(key => (
                    <div key={key}>• <span className="text-yellow-400">{key}</span> - {data.commands[key].description}</div>
                ))}
            </div>
        ];
    }

    if (type === 'about') {
        const { personalInfo } = data;
        return [
            <div key="about" className="space-y-1">
                <div>🚀 {personalInfo.name}</div>
                <div>💡 {personalInfo.passion}</div>
                <div>🎓 {personalInfo.current}</div>
            </div>
        ];
    }

    if (type === 'projects') {
        return [
            <div key="projects" className="space-y-1">
                <div className="text-cyan-400 mb-1">🚀 Projects:</div>
                {data.projects.map((project, i) => (
                    <div key={i}>• {project}</div>
                ))}
            </div>
        ];
    }

    if (type === 'skills') {
        const { skills } = data;
        return [
            <div key="skills" className="space-y-1">
                <div>💻 Programming: {skills.programming}</div>
                <div>🤖 AI/ML: {skills.ai}</div>
                <div>🌐 Web: {skills.web}</div>
                <div>🛠️ Tools: {skills.tools}</div>
            </div>
        ];
    }

    if (type === 'contact') {
        return [
            <div key="contact" className="space-y-1">
                <div>📧 Email: hello@sayedhanan.com</div>
                <div>🐙 GitHub: github.com/sayedhanan</div>
                <div>💼 LinkedIn: linkedin.com/in/sayedhanan</div>
                <div>🐦 Twitter: @sayedhanan</div>
            </div>
        ];
    }

    if (type === 'download') {
        return [
            <div key="download" className="space-y-1">
                <a
                    href={content}
                    download
                    className="flex items-center underline text-blue-400 hover:text-blue-300"
                >
                    <FileText className="w-4 h-4 mr-1" />
                    <span>Download my resume</span>
                </a>
            </div>
        ];
    }

    return [<div key="default">{content}</div>];
};

const createCommands = (data: CommandData): Record<string, Command> => {
    const commands: Record<string, Command> = {};
    Object.entries(data.commands).forEach(([key, cmd]) => {
        commands[key] = {
            description: cmd.description,
            execute: () => formatContent(cmd.content, cmd.type, data)
        };
    });
    return commands;
};

export const useCommandTerminal = (): UseTerminalReturn => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [lines, setLines] = useState<React.ReactNode[]>([]);
    const [commandData, setCommandData] = useState<CommandData | null>(null);

    useEffect(() => {
        const loadCommands = async () => {
            try {
                const response = await fetch('/commands.json');
                if (!response.ok) throw new Error('Failed to fetch commands');
                const data: CommandData = await response.json();
                setCommandData(data);
            } catch (error) {
                console.error('Failed to load commands:', error);
            }
        };
        loadCommands();
    }, []);

    useEffect(() => {
        setLines([
            <div key="welcome" className="mb-2">
                Hi, I&apos;m Hanan. Type <span className="text-cyan-400 font-semibold">help</span> to get started.
            </div>
        ]);
    }, []);

    const executeCommand = (commandText: string) => {
        if (!commandText.trim() || !commandData) return;
        const [cmd, ...args] = commandText.trim().split(' ');
        const commands = createCommands(commandData);
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
                    Command not found: {cmd}<br />Type <span className="text-cyan-400">help</span>
                </div>
            ]);
        } else {
            const output = command.execute(args);
            setLines(prev => [
                ...prev,
                commandLine,
                <div key={`out-${Date.now()}`} className="mb-2">{output}</div>
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

    return { input, setInput, lines, handleKeyDown };
};

interface CombineInterfaceProps {
    children: React.ReactNode;
    mode: 'terminal' | 'ai';
    onModeChange: (mode: 'terminal' | 'ai') => void;
}

export const CombineInterface: React.FC<CombineInterfaceProps> = ({ children, mode, onModeChange }) => (
    <div className="w-full max-w-2xl border border-gray-700 rounded-xl overflow-hidden shadow-2xl bg-slate-900 text-white">
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="text-sm text-gray-400 ml-2">
                    {mode === 'terminal' ? 'Terminal' : 'AI Assistant'}
                </div>
            </div>
            <button onClick={() => onModeChange(mode === 'terminal' ? 'ai' : 'terminal')} className="btn btn-secondary text-sm">
                {mode === 'terminal'
                    ? <><Bot className="w-4 h-4" /><span>AI</span></>
                    : <><TerminalIcon className="w-4 h-4" /><span>Terminal</span></>}
            </button>
        </div>
        <div className="p-4 h-[400px]">{children}</div>
    </div>
);
