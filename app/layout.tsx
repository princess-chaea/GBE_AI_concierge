import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyFlow - AI 학교행정 컨시어지",
  description: "경상북도교육청 지능형 학교행정 업무 지원 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body class="antialiased">
        {children}
      </body>
    </html>
  );
}
