import type { Metadata } from "next";
import "@fontsource/geist/400.css";
import "@fontsource/geist/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Marketplace - Buy and Sell Locally",
  description: "A beautiful marketplace for buying and selling items locally",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-50">
      <body className="font-geist antialiased min-h-screen text-gray-900 bg-gray-50">
        <Header />
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
