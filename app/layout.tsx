import type { Metadata } from "next";
import "./globals.css";

export const viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  title: "玺月餐厅",
  referrer: "no-referrer",
  description: "一起安排宝宝的三餐，收藏家的味道。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
