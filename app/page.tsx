'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: '반갑습니다! 경상북도교육청 지능형 학교행정 컨시어지 **이지플로우(EasyFlow)**입니다. 행정 업무에 대해 궁금한 점을 물어봐 주세요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (data.answer) {
        setMessages(prev => [...prev, { role: 'bot', content: data.answer }]);
      } else {
        throw new Error(data.error || '답변을 가져오지 못했습니다.');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'bot', content: '⚠️ 오류가 발생했습니다: ' + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gbe-blue rounded-xl flex items-center justify-center">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">EasyFlow</h1>
            <p className="text-xs text-gbe-blue font-medium mt-1">AI 학교행정 컨시어지</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs px-2 py-1 bg-gbe-blue-light text-gbe-blue rounded-full font-semibold">Beta v2.5</span>
          <a href="/admin" className="text-xs text-gray-400 hover:text-gbe-blue transition-colors">관리자</a>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                <div className={`p-2 rounded-lg shrink-0 ${msg.role === 'user' ? 'bg-gbe-blue text-white ml-2' : 'bg-white border border-gray-200 text-gbe-blue'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gbe-blue text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white border border-gray-200 text-gbe-blue">
                  <Bot size={20} />
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-8 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="업무 지침이나 행정 절차에 대해 물어보세요..."
            className="w-full py-4 pl-6 pr-16 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gbe-blue focus:bg-white transition-all text-gray-900 placeholder-gray-400 shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
              input.trim() && !isLoading ? 'bg-gbe-blue text-white shadow-lg hover:bg-blue-700' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest font-medium">
          Gyeongbuk Provincial Office of Education • Intelligent Concierge Service
        </p>
      </footer>
    </div>
  );
}
