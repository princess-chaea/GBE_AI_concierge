'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  X, 
  RefreshCw, 
  Database, 
  Layers, 
  Calendar as CalendarIcon,
  Search,
  Trash2,
  Tag
} from 'lucide-react';

export default function AdminPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentProcessing, setCurrentProcessing] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedCategory, setSelectedCategory] = useState('교무부');

  // 가상의 지식 통계 데이터 (추후 DB 연동)
  const stats = [
    { label: '전체 지식 조각', value: '1,245개', icon: <Database className="text-blue-500" /> },
    { label: '학습된 문서', value: '48건', icon: <FileText className="text-green-500" /> },
    { label: '최근 업데이트', value: '2026-04-24', icon: <CalendarIcon className="text-purple-500" /> },
    { label: '상담 누적 데이터', value: '156건', icon: <Layers className="text-orange-500" /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const uploadFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        try {
          const response = await fetch('/api/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              mimeType: file.type,
              metadata: {
                year: selectedYear,
                category: selectedCategory
              }
            }),
          });
          if (!response.ok) throw new Error('업로드 실패');
          resolve();
        } catch (error: any) {
          reject(error);
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    setStatus('loading');
    for (let i = 0; i < files.length; i++) {
      setCurrentProcessing(`${files[i].name} 학습 중...`);
      try { await uploadFile(files[i]); } catch (err) {
        setStatus('error');
        setMessage(`오류 발생: ${files[i].name}`);
        return;
      }
    }
    setStatus('success');
    setMessage(`${files.length}개의 지식을 ${selectedYear}년 ${selectedCategory} 데이터로 등록했습니다.`);
    setFiles([]);
  };

  return (
    <div className="p-10 space-y-10 animate-slide-up bg-slate-50 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">지식 관리 시스템 (Admin) ⚙️</h1>
          <p className="text-slate-500 font-medium text-lg">이지플로우의 AI 지식 베이스를 연도별/업무별로 정밀 제어합니다.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => {}} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center space-x-2">
            <RefreshCw size={16} />
            <span>서버 동기화</span>
          </button>
          <button 
            onClick={async () => {
              if (confirm('전체 지식을 초기화하시겠습니까?')) {
                const res = await fetch('/api/ingest', { method: 'DELETE' });
                if (res.ok) alert('초기화 완료');
              }
            }}
            className="px-5 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 transition-all flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>전체 초기화</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">{s.icon}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-xl font-black text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Knowledge Ingestion Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Upload className="text-blue-600" size={20} />
              지식 데이터 추가
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">대상 연도</label>
                  <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">업무 분류</label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  >
                    <option>교무부</option>
                    <option>행정실</option>
                    <option>정보부</option>
                    <option>학생부</option>
                    <option>방과후학교</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 group hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-blue-600 shadow-sm mb-4 transition-all">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-bold text-slate-500">파일을 드래그하거나 클릭</p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, TXT, 이미지 가능</p>
              </div>

              {files.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{f.name}</span>
                      <X size={14} className="text-slate-300 hover:text-red-500 cursor-pointer" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} />
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={files.length === 0 || status === 'loading'}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-slate-200 transition-all flex items-center justify-center space-x-2"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} />}
                <span>{status === 'loading' ? '처리 중...' : `${files.length}개 파일 학습 시작`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Knowledge Inventory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Layers className="text-purple-600" size={20} />
                지식 인벤토리 (Inventory)
              </h2>
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Search size={14} className="text-slate-400" />
                <input type="text" placeholder="검색..." className="bg-transparent border-none outline-none text-xs w-32" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">연도</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">부서</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">지식 명칭</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">학습 상태</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <InventoryRow year="2026" category="교무부" name="과학실 안전점검 매뉴얼.pdf" status="Active" />
                  <InventoryRow year="2026" category="행정실" name="2026학년도 예산 편성 지침.hwp" status="Active" />
                  <InventoryRow year="2025" category="정보부" name="정보보호 계획서(작년).pdf" status="Archived" />
                  <InventoryRow year="2026" category="학생부" name="상담 데이터 피드백 ( 누가기록 ).csv" status="Training" />
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/50 text-center">
              <span className="text-xs font-bold text-slate-400 cursor-pointer hover:text-blue-600 transition-colors underline underline-offset-4">지식 베이스 전체 데이터 로그 다운로드 (CSV)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InventoryRow({ year, category, name, status }: { year: string, category: string, name: string, status: string }) {
  return (
    <tr className="hover:bg-slate-50/30 transition-colors group">
      <td className="px-8 py-5">
        <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{year}</span>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center space-x-1 text-xs font-bold text-blue-600">
          <Tag size={12} />
          <span>{category}</span>
        </div>
      </td>
      <td className="px-8 py-5">
        <span className="text-sm font-bold text-slate-700 truncate block max-w-[200px]">{name}</span>
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center space-x-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : status === 'Training' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-xs font-bold text-slate-500">{status}</span>
        </div>
      </td>
      <td className="px-8 py-5 text-right">
        <Trash2 size={16} className="text-slate-300 hover:text-red-500 cursor-pointer ml-auto transition-colors" />
      </td>
    </tr>
  );
}
