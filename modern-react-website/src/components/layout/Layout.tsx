// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar.tsx';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <header className="main-header">
          <button className="btn sidebar-toggle" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <div className="header-actions">
            <button className="btn btn-outline-secondary">
              <i className="bi bi-bell"></i>
            </button>
            <button className="btn btn-outline-secondary">
              <i className="bi bi-person-circle"></i>
            </button>
          </div>
        </header>
        
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;