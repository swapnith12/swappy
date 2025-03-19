"use client"; // Now this can be a Client Component

import { useState } from "react";
import localFont from "next/font/local";
import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SidebarProvider>
              <div className="flex min-h-screen w-screen">
                <AppSidebar />
                <main className="flex-1 flex items-center">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </HydrationBoundary>
        </QueryClientProvider>
      </body>
    </html>
  );
}
