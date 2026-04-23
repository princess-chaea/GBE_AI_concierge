'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('loading');
    setMessage('파일을 분석하고 학습하는 중입니다...');

    try {
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        const response = await fetch('/api/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64Data,
            mimeType: file.type,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(`${file.name} 학습이 완료되었습니다! 이제 채팅에서 질문해보세요.`);
          setFile(null);
        } else {
          throw new Error(result.error || '학습에 실패했습니다.');
        }
      };
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gbe-blue rounded-lg">
            <Upload className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">지식 베이스 학습</h1>
            <p className="text-sm text-gray-500">학교 행정 자료를 AI에게 가르칩니다.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
              file ? 'border-gbe-green bg-green-50' : 'border-gray-200 hover:border-gbe-blue hover:bg-blue-50'
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.txt,.png,.jpg,.jpeg"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              {file ? (
                <>
                  <FileText className="w-12 h-12 text-gbe-green mb-3" />
                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-900">파일을 선택하거나 드래그하세요</span>
                  <span className="text-xs text-gray-500 mt-1">PDF, TXT, 이미지 지원</span>
                </>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || status === 'loading'}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
              !file || status === 'loading' 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gbe-blue hover:bg-blue-700 hover:shadow-blue-200'
            }`}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>처리 중...</span>
              </>
            ) : (
              <span>학습 시작하기</span>
            )}
          </button>
        </form>

        {status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-xl flex items-start space-x-3 animate-fade-in ${
            status === 'success' ? 'bg-green-50 text-green-800' : 
            status === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
          }`}>
            {status === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : 
             status === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5" /> : 
             <Loader2 className="w-5 h-5 mt-0.5 animate-spin" />}
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-xs text-gray-400">
        &copy; 2026 경상북도교육청 이지플로우 AI 컨시어지
      </p>
    </div>
  );
}
