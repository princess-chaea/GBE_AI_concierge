'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, FileSearch, Plus, ChevronLeft, ChevronRight, CheckCircle2, Download, ExternalLink } from 'lucide-react';

export default function CalendarPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  return (
    <div className="p-10 h-full flex flex-col space-y-10 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">스마트 공문 달력 📅</h1>
          <p className="text-slate-500 font-medium text-lg">공문을 스캔하면 마감일과 필수 서식을 자동으로 찾아줍니다.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleScan}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all hover:-translate-y-1"
          >
            <FileSearch size={18} />
            <span>공문 스캔 및 등록</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 flex-1">
        {/* Left: Calendar View (Visual Placeholder) */}
        <div className="xl:col-span-2 bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800">2026년 4월</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronLeft size={20} /></button>
              <button className="px-4 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-600">오늘</button>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><ChevronRight size={20} /></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className="bg-slate-50 p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2; // Simple logic for April 2026
              const isToday = dayNum === 24;
              const hasTask = dayNum === 28 || dayNum === 30;
              return (
                <div key={i} className="bg-white min-h-[120px] p-3 relative hover:bg-slate-50 transition-colors">
                  <span className={`text-sm font-bold ${dayNum > 0 && dayNum <= 30 ? (isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md' : 'text-slate-700') : 'text-slate-200'}`}>
                    {dayNum > 0 && dayNum <= 30 ? dayNum : ''}
                  </span>
                  {hasTask && dayNum > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="px-2 py-1 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-md border border-orange-200 truncate">
                        [마감] 과학실 안전 점검
                      </div>
                      {dayNum === 28 && (
                        <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md border border-blue-200 truncate">
                          정보보안 교육 보고
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: AI Analysis Panel */}
        <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FileSearch className="text-blue-400" size={24} />
            AI 공문 분석 결과
          </h2>

          {isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <FileSearch className="text-blue-400 w-8 h-8" />
              </div>
              <p className="text-blue-400 font-bold">공문 텍스트 및 서식 추출 중...</p>
            </div>
          ) : scanComplete ? (
            <div className="flex-1 space-y-8 animate-slide-up">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center space-x-2 text-green-400 mb-3">
                  <CheckCircle2 size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">추출 완료</span>
                </div>
                <h3 className="text-lg font-bold mb-2">2026학년도 과학실 안전점검 보고</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">마감일: 2026-04-28 (화)</p>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2">
                  <p className="text-xs text-slate-300 font-medium">• 교무부-과학 전담 업무</p>
                  <p className="text-xs text-slate-300 font-medium">• 점검 리스트 및 사진 첨부 필수</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">RAG 매칭 서식</h4>
                <div className="space-y-3">
                  <FormLink label="과학실 안전점검표(초등).hwp" />
                  <FormLink label="결과 보고서 표준 양식.hwp" />
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                <Plus size={18} />
                <span>달력에 일정 확정하기</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Plus className="text-slate-600 w-10 h-10" />
              </div>
              <p className="text-slate-400 font-medium">분석할 공문을 업로드하거나<br />드래그해 주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FormLink({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex items-center space-x-3 truncate">
        <Download size={16} className="text-blue-400" />
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      <ExternalLink size={14} className="text-slate-600 group-hover:text-blue-400" />
    </div>
  );
}
