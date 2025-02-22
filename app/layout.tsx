import "./globals.css"
import { Inter } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ClerkProvider } from "@clerk/nextjs"
import { ConvexClientProvider } from "./ConvexClientProvider"

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My App Title",
  description: "My app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexClientProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full">
                <SidebarTrigger />
                {children}
              </main>
            </SidebarProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
