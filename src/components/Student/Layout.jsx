import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [collapsed, setCollapsed] = useState(true);
  // Ee state ni use chesi sidebar/topbar ni control chestham
  const [isExamActive, setIsExamActive] = useState(false);

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative">
      
      {/* 1. Sidebar: isExamActive true aithe hide aipothundi */}
      {!isExamActive && (
        <aside 
          className="relative z-50 h-full border-r border-slate-800/40 bg-slate-900/40 backdrop-blur-md transition-all duration-300 shadow-2xl shrink-0"
          style={{ width: collapsed ? "80px" : "260px" }}
        >
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
      )}

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden min-w-0">
        
        {/* 2. Topbar: isExamActive true aithe hide aipothundi */}
        {!isExamActive && (
          <header className="h-[70px] w-full flex items-center z-40 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md shrink-0">
            <Topbar />
          </header>
        )}

        {/* 3. Main Area: Content padding automatic ga adjust avtundi */}
        <main className={`flex-1 overflow-y-auto relative ${!isExamActive ? 'p-6 bg-slate-950/50' : 'p-0 bg-slate-950'}`}>
          {/* context={{ setIsExamActive }} dwara child page ki access isthunnam */}
          <Outlet context={{ setIsExamActive }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;