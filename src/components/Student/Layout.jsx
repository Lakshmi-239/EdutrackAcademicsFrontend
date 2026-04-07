import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

function Layout() {

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="d-flex vh-100 w-100" style={{ height: "100vh", width: "100%" }}>

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column">

        <Topbar />

        {/* Content */}
        <div className="p-3 flex-grow-1 overflow-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default Layout;