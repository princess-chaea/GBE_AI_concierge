'use client';

import { useState } from 'react';
import { Library, Search, Download, FileText, Filter, MoreHorizontal, ExternalLink, Tag } from 'lucide-react';

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const mockForms = [
    { title: '과학실 안전점검 결과보고서(표준).hwp', category: '교무부', date: '2026-04-20', size: '45KB' },
    { title: '정보보안교육 이수 결과 서식.docx', category: '정보부', date: '2026-04-18', size: '120KB' },
    { title: '교직원 친목회비 납부 현황표.xlsx', category: '행정실', date: '2026-04-15', size: '32KB' },
    { title: '학생 기초학력 진단검사 실시 계획안.hwp', category: '교무부', date: '2026-04-10', size: '85KB' },
    { title: '학교 폭력 예방 교육 실적 보고.hwp', category: '학생부', date: '2026-04-05', size: '92KB' },
  ];

  return (
    <div className="p-10 space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">지능형 서식 자료실 📂</h1>
          <p className="text-slate-500 font-medium text-lg">필요한 서식을 AI가 검색하고 즉시 제공합니다.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all w-80">
            <Search className="text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="서식명이나 키워드로 검색..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">카테고리</h2>
          <div className="space-y-1">
            <CategoryItem label="전체보기" count={124} active />
            <CategoryItem label="교무부" count={42} />
            <CategoryItem label="행정실" count={28} />
            <CategoryItem label="정보부" count={15} />
            <CategoryItem label="학생부" count={19} />
            <CategoryItem label="방과후학교" count={20} />
          </div>

          <div className="mt-10 p-6 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <Bot className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 -rotate-12" />
            <h3 className="font-bold text-lg mb-3">AI 서식 매칭</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-6">찾으시는 서식이 없나요? 챗봇에게 공문을 보여주면 최적의 서식을 찾아드립니다.</p>
            <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all">AI에게 물어보기</button>
          </div>
        </div>

        {/* Content Table */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">파일명</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">부서</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">등록일</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">크기</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockForms.map((form, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{form.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{form.category}</span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400 font-medium">{form.date}</td>
                    <td className="px-8 py-6 text-sm text-slate-400 font-medium">{form.size}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all">
                          <Download size={18} />
                        </button>
                        <button className="p-2 hover:bg-slate-100 text-slate-400 rounded-lg">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex justify-center">
              <button className="text-sm font-bold text-slate-400 hover:text-blue-600 flex items-center space-x-2">
                <span>더 많은 서식 불러오기</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ label, count, active }: { label: string, count: number, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'
    }`}>
      <span className="text-sm font-bold">{label}</span>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
      }`}>{count}</span>
    </div>
  );
}

function Bot(props: any) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
