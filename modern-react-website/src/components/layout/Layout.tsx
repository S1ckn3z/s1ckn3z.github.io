// src/components/layout/Layout.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

type Page = 'home' | 'wildstacker';

type LayoutProps = {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
};

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activePage={activePage}
        onNavigate={onNavigate}
      />
      
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