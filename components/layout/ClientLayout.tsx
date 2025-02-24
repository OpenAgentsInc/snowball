'use client';

import { ConvexClientProvider } from "@/app/ConvexClientProvider"
import {
  AuthButtons, LeftSidebar, RightSidebar
} from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AnimatorGeneralProvider } from "@arwes/react"
import { ClerkProvider } from "@clerk/nextjs"
import { ArwesBackground } from "./ArwesBackground"

const animatorGeneral = {
  duration: {
    enter: 0.2,
    exit: 0.2,
    stagger: 0.04
  }
};

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <AnimatorGeneralProvider {...animatorGeneral}>
          <ArwesBackground />
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              {/* <div className="w-64 border-r border-white/20 backdrop-blur-sm">
                <LeftSidebar />
              </div> */}
              <main className="flex-1 flex">
                <div className="w-full max-w-7xl mx-auto px-4 py-6">
                  {children}
                </div>
              </main>
              {/* <div className="w-64 border-l border-white/20 backdrop-blur-sm">
                <RightSidebar />
              </div> */}
            </div>
            <div className="fixed bottom-4 right-4 z-50">
              <AuthButtons />
            </div>
            <Toaster />
          </SidebarProvider>
        </AnimatorGeneralProvider>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
