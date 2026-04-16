import { useState } from "react";
import SideBar from "./Side_Bar";
import TopBar from "./Top_Bar";
import { Outlet } from "react-router-dom";

function LayOut() {

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="d-flex vh-100 w-100" style={{ height: "100vh", width: "100%" }}>

      {/* SideBar */}
      <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div className="flex-grow-1 d-flex flex-column">

        <TopBar />

        {/* Content */}
        <div className="p-3 flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default LayOut;

