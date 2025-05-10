// src/components/layout/Sidebar.tsx (update)
import React from 'react';
import { Nav } from 'react-bootstrap';
import './Sidebar.css';

type Page = 'home' | 'wildstacker' | 'superiorskyblock' | 'deluxemenus';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  activePage: Page;
  onNavigate: (page: Page) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, activePage, onNavigate }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>ModernApp</h3>
        <button className="btn d-md-none" onClick={toggleSidebar}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <Nav className="flex-column">
        <Nav.Link 
          active={activePage === 'home'} 
          onClick={() => onNavigate('home')}
        >
          <i className="bi bi-house me-2"></i>
          Home
        </Nav.Link>
        
        <Nav.Link 
          active={activePage === 'wildstacker'} 
          onClick={() => onNavigate('wildstacker')}
        >
          <i className="bi bi-layers me-2"></i>
          WildStacker Config
        </Nav.Link>
        
        <Nav.Link 
          active={activePage === 'superiorskyblock'} 
          onClick={() => onNavigate('superiorskyblock')}
        >
          <i className="bi bi-grid-3x3-gap me-2"></i>
          SuperiorSkyblock Config
        </Nav.Link>
        
        <Nav.Link 
          active={activePage === 'deluxemenus'} 
          onClick={() => onNavigate('deluxemenus')}
        >
          <i className="bi bi-menu-button-wide me-2"></i>
          DeluxeMenus Config
        </Nav.Link>
        
        <Nav.Link href="#">
          <i className="bi bi-graph-up me-2"></i>
          Analytics
        </Nav.Link>
        
        <Nav.Link href="#">
          <i className="bi bi-gear me-2"></i>
          Settings
        </Nav.Link>
      </Nav>
      <div className="sidebar-footer">
        <p>© 2025 ModernApp</p>
      </div>
    </div>
  );
};

export default Sidebar;