'use client';

import { useState } from 'react';
import { Users, Heart, MessageCircle, Star, Search, Filter, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';

export default function CounselingPage() {
  return (
    <div className="p-10 space-y-12 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">인생도서관 상담실 🤝</h1>
          <p className="text-slate-500 font-medium text-lg">선배 교사들의 지혜와 AI의 전문 지식이 만나 선생님의 고민을 해결합니다.</p>
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">
          <MessageCircle size={18} />
          <span>신규 상담 신청하기</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-blue-500" />} label="등록된 멘토" value="24명" />
        <StatCard icon={<MessageCircle className="text-green-500" />} label="누적 상담" value="1,240건" />
        <StatCard icon={<Star className="text-orange-500" />} label="평균 만족도" value="4.9/5" />
        <StatCard icon={<ShieldCheck className="text-purple-500" />} label="비밀 보장" value="100%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: AI Preliminary Counseling */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="text-indigo-600" />
              AI 사전 진단 및 가이드
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center space-y-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mx-auto">
                <MessageCircle size={32} className="text-indigo-600" />
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                멘토링 전에 AI와 먼저 대화해 보세요. <br />
                학교 폭력 대응, 학부모 상담 요령 등 **행정적/법률적 가이드**를 먼저 제안해 드립니다.
              </p>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                AI 사전 상담 시작
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">분야별 전문 상담사</h2>
              <div className="flex items-center space-x-2 text-sm text-slate-400 font-medium cursor-pointer hover:text-indigo-600">
                <span>전체보기</span>
                <Search size={14} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MentorCard 
                name="김행정 수석교사" 
                specialty="복잡한 행정 절차 / 공문 처리" 
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=mentor1"
              />
              <MentorCard 
                name="이생활 지도교사" 
                specialty="학생 생활지도 / 학부모 응대" 
                img="https://api.dicebear.com/7.x/avataaars/svg?seed=mentor2"
              />
            </div>
          </section>
        </div>

        {/* Right: Best Advice (RAG Knowledge) */}
        <div className="space-y-8">
          <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Heart className="text-red-400" size={20} />
              이달의 지혜 (Best Advice)
            </h2>
            <div className="space-y-6">
              <AdviceItem 
                tag="학급 경영"
                title="학기 초 학부모님과의 첫 전화 상담, 이것만은 꼭!"
                desc="공감과 경청의 태도가 가장 중요합니다. 먼저 칭찬으로 시작하세요."
              />
              <AdviceItem 
                tag="행정 꿀팁"
                title="나이스 결재선 지정, 헷갈리지 않는 명확한 기준"
                desc="학교 규정집 제 4조에 명시된 전결 규정을 확인하는 법을 알려드립니다."
              />
              <button className="w-full py-3 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-all border border-white/5">
                지혜 더 읽어보기
              </button>
            </div>
          </section>

          <div className="bg-indigo-50 rounded-[32px] p-8 border border-indigo-100 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <UserPlus size={24} />
            </div>
            <h3 className="font-bold text-indigo-900">지혜 나눔 멘토가 되어주세요</h3>
            <p className="text-xs text-indigo-600 leading-relaxed font-medium">선생님의 소중한 경험이 동료 교사에게 큰 힘이 됩니다.</p>
            <button className="text-xs font-black text-indigo-700 uppercase tracking-widest hover:underline mt-2">신청하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center space-x-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function MentorCard({ name, specialty, img }: { name: string, specialty: string, img: string }) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-5 group cursor-pointer">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
        <img src={img} alt={name} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{name}</h3>
        <p className="text-xs text-slate-400 font-medium mt-1">{specialty}</p>
      </div>
    </div>
  );
}

function AdviceItem({ tag, title, desc }: { tag: string, title: string, desc: string }) {
  return (
    <div className="space-y-2 border-b border-white/5 pb-6 last:border-0 last:pb-0">
      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{tag}</span>
      <h4 className="text-sm font-bold leading-snug">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
