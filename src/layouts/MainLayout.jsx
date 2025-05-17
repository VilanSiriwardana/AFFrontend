import React from "react";
import Sidebar from "../components/UserManagement/Sidebar";
import BottomNav from "../components/UserManagement/BottomNav";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-darkBg text-white">
      <Sidebar />
      <BottomNav />
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
};

export default MainLayout;
