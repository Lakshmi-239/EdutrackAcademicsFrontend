import { useState } from "react";
import Side_Bar from "./Side_Bar";
import Top_Bar from "./Top_Bar";
import { Outlet } from "react-router-dom";
 
function Lay_Out() {
  const [collapsed, setCollapsed] = useState(true);
  const [isExamActive, setIsExamActive] = useState(false);
 
  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative">
     
      {!isExamActive && (
        <aside
          className="relative z-50 h-full border-r border-slate-800/40 bg-slate-900/40 backdrop-blur-md transition-all duration-300 shadow-2xl shrink-0"
          style={{ width: collapsed ? "80px" : "260px" }}
        >
          <Side_Bar collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
      )}
 
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden min-w-0">
       
        {!isExamActive && (
          <header className="h-[70px] w-full flex items-center z-40 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-md shrink-0">
            <Top_Bar />
          </header>
        )}
        <main className={`flex-1 overflow-y-auto relative ${!isExamActive ? 'p-6 bg-slate-950/50' : 'p-0 bg-slate-950'}`}>
         
          <Outlet context={{ setIsExamActive }} />
        </main>
      </div>
    </div>
  );
}
 
export default Lay_Out;
 