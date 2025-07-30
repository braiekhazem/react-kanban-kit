import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="rkk-demo-app">
      <Header />
      <div className="rkk-demo-main">
        <Sidebar />
        <main className="rkk-demo-content">{children || <Outlet />}</main>
      </div>
    </div>
  );
};

export default Layout;
