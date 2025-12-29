import React, { useState, useEffect, useRef } from 'react';
import { Message, SurveyData } from '../types';
import { Send, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
    surveyData: SurveyData;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ surveyData }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [model, setModel] = useState('gemini-3-flash-preview');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Chat (Mock)
    useEffect(() => {
        const startChat = async () => {
            // Mock initialization delay
            setTimeout(() => {
                setIsInitialized(true);

                let greetingText = "";

                if (surveyData.hasTopic) {
                    const subject = surveyData.topicDescription
                        ? `关于"${surveyData.topicDescription.substring(0, 15)}..."的选题`
                        : (surveyData.topicFile ? "您上传的选题草稿" : "您的选题");
                    greetingText = `我已经分析了您的初步信息。让我们一起来优化${subject}。您目前在这个选题上遇到的最大挑战是什么？`;
                } else {
                    greetingText = "您好！看来我们准备从零开始构思。为了帮您找到一个完美的论文选题，能先告诉我您的专业以及您最感兴趣的研究领域吗？";
                }

                setMessages([{
                    id: 'init',
                    role: 'model',
                    text: greetingText,
                    timestamp: Date.now()
                }]);
            }, 500);
        };

        if (surveyData.isComplete && !isInitialized) {
            startChat();
        }
    }, [surveyData, isInitialized]);

    const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setModel(newModel);
        // Mock model switch
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        // Mock AI Response
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "**[演示模式]** 这是一个模拟的AI回复。\n\n后端逻辑尚未连接，这里仅展示UI样式。\n\n您刚刚说：" + userMsg.text,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 h-16">
                <div>
                    {/* Icon removed */}
                </div>

                {/* Model Selector */}
                <div className="relative group">
                    <select
                        value={model}
                        onChange={handleModelChange}
                        className="appearance-none bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                        <option value="gemini-3-flash-preview">Gemini 3.0 Flash</option>
                        <option value="gemini-3-pro-preview">Gemini 3.0 Pro</option>
                        <option value="gemini-2.5-flash-latest">Gemini 2.5 Flash</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-indigo-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:translate-y-[-40%] transition-transform" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatContainerRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
                ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed
                ${msg.role === 'user'
                                    ? 'bg-slate-800 text-white rounded-tr-none'
                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                }`}>
                                {msg.role === 'model' ? (
                                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-1 prose-headings:my-2">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="flex gap-3 max-w-[70%]">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                <span className="text-xs text-slate-500">思考中...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto relative flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="询问关于研究方法、文献综述或优化题目..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none h-14 max-h-32"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="h-14 w-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-xs text-slate-400 mt-2">
                    AI模型可能会犯错，请核实重要信息。
                </p>
            </div>
        </div>
    );
};
