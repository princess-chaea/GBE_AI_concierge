'use client';

import { 
  FileEdit, 
  Calendar as CalendarIcon, 
  FileText, 
  ArrowRight,
  Plus,
  Bot,
  Zap,
  TrendingUp,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="p-10 space-y-12 animate-slide-up">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">AI 교무 Cockpit 🚀</h1>
          <p className="text-lg text-slate-500 font-medium">선생님의 오늘 업무를 AI가 미리 분석해 보았습니다.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Plus size={18} />
            <span>신규 업무 등록</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1">
            <Zap size={18} />
            <span>AI 자동 분석 시작</span>
          </button>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard 
          icon={<TrendingUp className="text-orange-500" />} 
          title="공문 일정 추출" 
          description="오늘 접수된 [2026학년도 과학실 안전교육...] 외 2건의 마감 일정을 달력에 등록했습니다."
          color="bg-orange-50"
        />
        <InsightCard 
          icon={<FileText className="text-blue-500" />} 
          title="문서 갱신 추천" 
          description="작년 [기초학력 진단검사 계획] 파일을 발견했습니다. 올해 버전으로 자동 작성을 시작할까요?"
          color="bg-blue-50"
        />
        <InsightCard 
          icon={<Clock className="text-purple-500" />} 
          title="필요 서식 준비됨" 
          description="내일 예정된 [교직원 정보보안 교육]에 필요한 서식 2종을 미리 서식함에 담아두었습니다."
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Core Task 1: Auto Update */}
        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col group hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileEdit className="text-blue-600 w-7 h-7" />
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">Proactive</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">AI 문서 갱신 & 자동 작성</h2>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            작년 파일을 업로드하면 공공데이터(인원, 학교 현황 등)를 분석하여 **2026학년도 버전**으로 자동 초안을 잡습니다. 반복되는 문서 작업을 획기적으로 줄여줍니다.
          </p>
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
            <Link href="/doc" className="text-sm font-bold text-blue-600 hover:underline flex items-center space-x-2">
              <span>작업 공간으로 이동</span>
              <ArrowRight size={16} />
            </Link>
            <div className="text-xs text-slate-400">최근 업데이트: 2시간 전</div>
          </div>
        </section>

        {/* Core Task 2: Smart Calendar */}
        <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col group hover:border-green-200 transition-all">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarIcon className="text-green-600 w-7 h-7" />
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">Automation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">공문 기반 스마트 달력</h2>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            공문을 스캔해 올리면 **마감일, 사업 내용, 관련 서식**을 AI가 추출하여 통합 달력에 등록합니다. 이제 중요한 마감 기한을 놓칠 걱정이 없습니다.
          </p>
          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
            <Link href="/calendar" className="text-sm font-bold text-green-600 hover:underline flex items-center space-x-2">
              <span>달력 확인하기</span>
              <ArrowRight size={16} />
            </Link>
            <div className="text-xs text-slate-400">등록된 일정: 15건</div>
          </div>
        </section>
      </div>

      {/* 24/7 AI Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/10 rounded-full text-[10px] font-bold mb-6 backdrop-blur-md border border-white/10">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-widest">24/7 AI Concierge Active</span>
          </div>
          <h2 className="text-3xl font-bold mb-5 leading-tight">선생님의 행정 고민, 밤낮없이 들어드립니다.</h2>
          <p className="text-slate-400 text-base mb-8 leading-relaxed max-w-xl">
            이지플로우 챗봇은 모든 학교 행정 매뉴얼을 학습했습니다. <br />
            서식 위치부터 복잡한 공문 처리 절차까지, 언제든 질문하세요.
          </p>
          <Link href="/chat">
            <button className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center space-x-3 shadow-lg shadow-blue-900/50">
              <Bot size={18} />
              <span>AI 컨시어지 대화 시작</span>
            </button>
          </Link>
        </div>
        <Bot className="absolute bottom-[-20%] right-[-5%] w-80 h-80 text-white/5 -rotate-12 pointer-events-none" />
      </div>
    </div>
  );
}

function InsightCard({ icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-default">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
    </div>
  );
}
