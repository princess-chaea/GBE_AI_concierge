'use client';

import './globals.css';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  Calendar, 
  MessageSquare, 
  Settings, 
  FileText, 
  Library,
  Users,
  Zap,
  Bell,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="ko">
      <body className="antialiased">
        <div className="flex h-screen bg-slate-50 overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-6 flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <img src="/gbe_symbol.jpg" alt="GBE Symbol" className="w-10 h-10 object-contain rounded-lg" />
                <span className="text-xl font-bold tracking-tighter text-slate-900">이지플로우</span>
              </div>
              <div className="px-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">GBE AI Concierge</span>
              </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
              <SidebarItem 
                href="/" 
                icon={<LayoutDashboard size={20} />} 
                label="워크스페이스" 
                active={pathname === '/'} 
              />
              <SidebarItem 
                href="/doc" 
                icon={<FileEdit size={20} />} 
                label="AI 문서 작성" 
                active={pathname === '/doc'} 
              />
              <SidebarItem 
                href="/calendar" 
                icon={<Calendar size={20} />} 
                label="스마트 달력" 
                active={pathname === '/calendar'} 
              />
              <SidebarItem 
                href="/chat" 
                icon={<MessageSquare size={20} />} 
                label="업무상담 챗봇" 
                active={pathname === '/chat'} 
              />
              <SidebarItem 
                href="/forms" 
                icon={<Library size={20} />} 
                label="서식 자료실" 
                active={pathname === '/forms'} 
              />
              <SidebarItem 
                href="/counseling" 
                icon={<Users size={20} />} 
                label="인생도서관 상담" 
                active={pathname === '/counseling'} 
              />
              
              <div className="pt-8 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">System</div>
              <SidebarItem 
                href="/admin" 
                icon={<Settings size={20} />} 
                label="지식 관리 (Admin)" 
                active={pathname === '/admin'} 
              />
            </nav>

            <div className="p-6 mt-auto border-t border-slate-50 flex flex-col items-center space-y-4">
              <img src="/gbe_signature.png" alt="GBE Signature" className="w-40 opacity-80 grayscale hover:grayscale-0 transition-all" />
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Agent Online</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-4 bg-slate-100 px-3 py-1.5 rounded-lg w-80 border border-slate-200">
                <Search className="text-slate-400 w-3.5 h-3.5" />
                <input 
                  type="text" 
                  placeholder="통합 검색..." 
                  className="bg-transparent border-none focus:outline-none text-xs w-full text-slate-600"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Bell className="text-slate-500 w-5 h-5 cursor-pointer hover:text-blue-600 transition-colors" />
                <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher" alt="profile" />
                </div>
              </div>
            </header>

            {/* Viewport */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

function SidebarItem({ href, icon, label, active }: { href: string, icon: any, label: string, active: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all group ${
        active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
      }`}>
        <div className={active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}>
          {icon}
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
    </Link>
  );
}
