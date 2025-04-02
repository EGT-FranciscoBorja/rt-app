import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StoreProvider from "./StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RT App",
  description: "RT App - Management System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <StoreProvider>
          {!children?.toString().includes('login') && <Navbar />}
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
