'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Info } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: '반갑습니다! 경상북도교육청 지능형 학교행정 컨시어지 **이지플로우(EasyFlow)**입니다. 행정 업무나 절차에 대해 궁금한 점을 물어봐 주세요.' }
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

    const userMessage = input.trim();
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || '답변을 생성하지 못했습니다.' }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[70%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-slate-200'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.content}
                
                {msg.role === 'assistant' && i > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button className="text-[10px] text-slate-400 hover:text-blue-600 font-bold">도움됨</button>
                      <button className="text-[10px] text-slate-400 hover:text-red-500 font-bold">부족함</button>
                    </div>
                    <Link href="/counseling">
                      <button className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold hover:bg-blue-100 transition-colors">
                        인생도서관 담당자에게 질문하기
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-blue-600">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none text-slate-400 text-sm">
                AI가 지식 베이스를 검색하고 있습니다...
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-12 left-0 right-0 flex justify-center">
            <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100 flex items-center space-x-2">
              <Info size={14} />
              <span>학습된 2026학년도 행정 가이드 기반으로 답변합니다.</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <input 
              type="text" 
              placeholder="업무 지침이나 행정 절차에 대해 물어보세요..." 
              className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-sm text-slate-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl transition-all ${
                isLoading || !input.trim() 
                  ? 'bg-slate-300 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
