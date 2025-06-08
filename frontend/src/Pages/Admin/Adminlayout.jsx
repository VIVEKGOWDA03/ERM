import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Compontes/Header";
import SideBar from "../../Compontes/SideBar";

const Adminlayout = () => {
  return (
    // Outer container: Full height, flex column (Header on top, main content below)
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden"> {/* Added h-screen, proper bg-color */}
      {/* Common Header */}
      <Header />

      {/* Main content area: Sidebar and Outlet content side-by-side */}
      <main className="flex flex-1  overflow-hidden"> {/* flex-1 to take remaining height, overflow-hidden for internal content */}
        {/* Sidebar container: SideBar component now controls its own width */}
        {/* No w-[20vw] here; SideBar.jsx defines w-64 */}
        <SideBar className="h-[100vh-64px]"/>

        {/* Content area: Takes up remaining space */}
        <div className="flex-1 overflow-y-auto p-6"> {/* flex-1 to fill space, overflow-y-auto for scrolling content, add padding */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Adminlayout;