import AppSidebar from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppBar from "./app-bar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        
 <AppBar/>
    <SidebarProvider> 
        
      <AppSidebar />
      <main className="relative left-5 top-24 right-5 w-full h-full bg-transparent">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider></>
  )
}