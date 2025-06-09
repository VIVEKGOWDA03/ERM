import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../Compontes/Header";
import SideBar from "../../Compontes/SideBar";

const Adminlayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden"> 
      <Header />

      <main className="flex flex-1  overflow-hidden">
        <SideBar className="h-[100vh-64px]"/>

        <div className="flex-1 overflow-y-auto p-6 sm:p-1"> 
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Adminlayout;