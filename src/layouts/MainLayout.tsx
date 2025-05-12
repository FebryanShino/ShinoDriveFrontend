import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="w-full h-[100svh]">
      <AppSidebar />
      <main className="w-full h-[100dvh] p-3">
        <div className="py-4">
          <SidebarTrigger size="lg" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
