import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import {
  AuthButtons, LeftSidebar, RightSidebar
} from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexClientProvider } from "./ConvexClientProvider"

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snowball",
  description: "The multiplayer agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <Script src="https://elevenlabs.io/convai-widget/index.js" />
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexClientProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <LeftSidebar />
                <main className="flex-1 flex">
                  {children}
                </main>
                <RightSidebar />
              </div>
              <AuthButtons />
              <Toaster />
            </SidebarProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
