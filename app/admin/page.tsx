'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [currentProcessing, setCurrentProcessing] = useState('');

  // 드래그 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 개별 파일 업로드 (Base64 변환 포함)
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
            }),
          });
          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || '업로드 실패');
          }
          resolve();
        } catch (error: any) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setStatus('loading');
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentProcessing(`${file.name} (${i + 1}/${files.length}) 학습 중...`);
      try {
        await uploadFile(file);
        successCount++;
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setMessage(`${file.name} 처리 중 오류: ${err.message}`);
        return;
      }
    }

    setStatus('success');
    setMessage(`${successCount}개의 파일 학습이 모두 완료되었습니다!`);
    setFiles([]);
  };

  const handleSync = async () => {
    setStatus('loading');
    setMessage('서버 폴더(data/documents)를 스캔 중입니다...');
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        setStatus('success');
        setMessage(`서버 동기화 완료: ${result.count}개의 새로운 문서를 학습했습니다.`);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(`동기화 실패: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gbe-blue rounded-2xl shadow-blue-100 shadow-lg">
              <Upload className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">지식 베이스 관리</h1>
              <p className="text-gray-500">학교 행정 문서를 업로드하고 AI를 동기화합니다.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSync}
              disabled={status === 'loading'}
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
              <span>서버 폴더 동기화</span>
            </button>
            <button
              onClick={async () => {
                if (confirm('모든 학습 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                  setStatus('loading');
                  try {
                    const res = await fetch('/api/ingest', { method: 'DELETE' });
                    if (res.ok) {
                      setStatus('success');
                      setMessage('모든 데이터를 삭제했습니다. 이제 깨끗하게 다시 학습시켜 보세요!');
                    }
                  } catch (err) {
                    setStatus('error');
                    setMessage('삭제 중 오류가 발생했습니다.');
                  }
                }
              }}
              disabled={status === 'loading'}
              className="flex items-center space-x-2 px-6 py-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all shadow-sm font-medium text-red-600"
            >
              <X className="w-4 h-4" />
              <span>데이터 전체 삭제</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gbe-blue" />
              신규 파일 추가
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                  status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-gbe-blue hover:bg-blue-50 cursor-pointer'
                }`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  multiple
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.png,.jpg,.jpeg"
                  disabled={status === 'loading'}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                  <div className="w-16 h-16 bg-blue-50 text-gbe-blue rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <span className="text-base font-semibold text-gray-900 text-center">파일을 드래그하거나 클릭하여 선택</span>
                  <span className="text-sm text-gray-500 mt-2 text-center">여러 개를 한꺼번에 올릴 수 있습니다 (PDF, TXT, 이미지)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={files.length === 0 || status === 'loading'}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                  files.length === 0 || status === 'loading' 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gbe-blue hover:bg-blue-700 hover:shadow-blue-200'
                }`}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{currentProcessing || '처리 중...'}</span>
                  </>
                ) : (
                  <span>{files.length}개 파일 학습 시작하기</span>
                )}
              </button>
            </form>
          </div>

          {/* Selected Files List */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col min-h-[400px]">
            <h2 className="text-lg font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gbe-green" />
                선택된 파일 리스트
              </span>
              <span className="text-sm font-normal text-gray-400">{files.length}개</span>
            </h2>

            {files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-60">
                <FileText className="w-12 h-12 mb-3" />
                <p>선택된 파일이 없습니다.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 pr-2 custom-scrollbar">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                        <p className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="p-1 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {status !== 'idle' && (
              <div className={`mt-6 p-4 rounded-2xl flex items-start space-x-3 animate-fade-in ${
                status === 'success' ? 'bg-green-50 text-green-800' : 
                status === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'
              }`}>
                {status === 'success' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : 
                 status === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5" /> : 
                 <Loader2 className="w-5 h-5 mt-0.5 animate-spin" />}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
