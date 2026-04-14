import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

function Layout() {
  // Sidebar is collapsed by default to match your state logic
  const [collapsed, setCollapsed] = useState(true);

  return (
    /* Main Wrapper: Uses the deep slate-950 from your landing page */
    /* text-slate-200 and no-underline reset helps kill the default blue link look */
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative font-sans text-slate-200">
      
      {/* 1. Theme Background Accents (Glows matching your landing page theme) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left Teal Glow */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'conic-gradient(from 90deg at 50%_50%, #0ea5e9, #10b981)' }}
        ></div>
        {/* Bottom Right Emerald Glow */}
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: '#10b981' }}
        ></div>
      </div>

      {/* 2. Sidebar Container: Fits to screen height, solidifies the glass effect */}
      <aside className="relative z-30 h-full border-r border-slate-800/40 bg-slate-900/40 backdrop-blur-md transition-all duration-300 shadow-2xl">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Topbar Header: Glassmorphism header matching the landing page Navbar */}
        {/* Height set to 70px to ensure a spacious, real-time app feel */}
        <header
          className="h-[70px] w-full flex items-center z-40 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md shadow-lg"
        >
          <div className="w-full h-full">
             <Topbar />
          </div>
        </header>

        {/* 4. Page Content Area: Using overflow-y-auto for the scrollable content */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-950/50">
          {/* Internal shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] pointer-events-none z-20"></div>
          
          {/* Content Wrapper with padding for the dashboard cards */}
          <div className="min-h-full w-full relative z-10 p-6">
            <Outlet />
          </div>
        </main>

        {/* Bottom Border Glow: A subtle accent matching the site's precision aesthetic */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"></div>
      </div>

      {/* Global CSS Overrides to fix blue links and scrollbars strictly */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Remove blue color and underlines from all anchor tags globally in layout */
        a, .nav-link { 
          text-decoration: none !important; 
          color: inherit !important; 
        }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
        
        /* Smooth transition for sidebar collapsing */
        aside { transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}} />
    </div>
  );
}

export default Layout;