'use client';

import { useState } from 'react';
import { FileEdit, Upload, Wand2, ArrowRight, FileCheck, Loader2, Sparkles, AlertCircle, FileText } from 'lucide-react';

export default function DocumentAssistantPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const startAutoWrite = () => {
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="p-10 space-y-12 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">AI 문서 갱신 및 자동 작성 ✍️</h1>
          <p className="text-slate-500 font-medium text-lg">작년 파일을 기반으로 최신 데이터를 반영한 올해의 초안을 만듭니다.</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center space-x-2">
          <Sparkles className="text-blue-600 w-4 h-4" />
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">공공데이터 API 연동 중</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Step 1: Upload Last Year's File */}
        <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 text-lg">1</div>
            <h2 className="text-xl font-bold text-slate-800">기존 파일 업로드</h2>
          </div>

          <div className="flex-1 border-2 border-dashed border-slate-100 rounded-3xl p-12 flex flex-col items-center justify-center group hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white shadow-md rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 mb-6 transition-all">
              <Upload size={32} />
            </div>
            <p className="text-slate-500 font-bold mb-2">작년(2025학년도) 파일을 올려주세요</p>
            <p className="text-xs text-slate-400">HWP, PDF, DOCX 파일 지원</p>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <AlertCircle size={14} className="text-orange-500" />
              자동 업데이트 대상 정보
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <InfoTag label="학생/교직원 인원" />
              <InfoTag label="2026학년도 학사일정" />
              <InfoTag label="학교 교육목표/현황" />
              <InfoTag label="변경 법령/지침" />
            </div>
          </div>
        </div>

        {/* Step 2: AI Generation View */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white/60 text-lg">2</div>
            <h2 className="text-xl font-bold text-white">AI 초안 생성기</h2>
          </div>

          {!isProcessing && progress === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center border border-white/10">
                <Wand2 size={40} className="text-blue-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold">작업을 시작할 준비가 되었습니다.</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  공공데이터 API에서 실시간 학교 정보를 불러와 작년 파일과 병합합니다.
                </p>
              </div>
              <button 
                onClick={startAutoWrite}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-3"
              >
                <Sparkles size={20} />
                <span>AI 2026학년도 버전 작성 시작</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">프로세스 현황</span>
                  <span className="text-xs font-bold text-white/40">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 font-mono text-xs space-y-4 overflow-y-auto">
                <LogItem text="학습된 2025학년도 정보보안계획서 분석 중..." active={progress > 10} />
                <LogItem text="나이스(NEIS) 학교 현황 정보 매칭 완료" active={progress > 30} />
                <LogItem text="2026학년도 변경 지침 데이터 반영 중..." active={progress > 50} />
                <LogItem text="[표 1-3] 전교생 인원 통계 업데이트 (542명)" active={progress > 70} />
                <LogItem text="초안 문서(HWP 호환 형식) 렌더링 시작" active={progress > 90} />
                {progress === 100 && (
                  <div className="pt-4 animate-bounce">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-500/30">
                      작성 완료! 최종 검토를 시작하세요.
                    </span>
                  </div>
                )}
              </div>

              {progress === 100 && (
                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-white/10 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/20 transition-all flex items-center justify-center space-x-2">
                    <FileText size={18} />
                    <span>초안 미리보기</span>
                  </button>
                  <button className="flex-1 py-4 bg-blue-600 rounded-2xl font-bold text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                    <FileCheck size={18} />
                    <span>HWP 다운로드</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoTag({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
      <div className="w-1 h-1 bg-blue-400 rounded-full" />
      <span>{label}</span>
    </div>
  );
}

function LogItem({ text, active }: { text: string, active: boolean }) {
  return (
    <div className={`flex items-center space-x-3 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-20'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-600'}`} />
      <span>{text}</span>
    </div>
  );
}
