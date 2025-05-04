import React from "react";
import Sidebar from "../components/UserManagement/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-darkBg text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
};

export default MainLayout;
