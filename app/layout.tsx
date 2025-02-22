import "./globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
              <AppSidebar />
              <main className="w-full">
                {children}
              </main>
            </SidebarProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
