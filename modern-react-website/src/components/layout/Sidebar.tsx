// src/components/layout/Sidebar.tsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import './Sidebar.css';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>ModernApp</h3>
        <button className="btn d-md-none" onClick={toggleSidebar}>
          <i className="bi bi-x"></i>
        </button>
      </div>
      <Nav className="flex-column">
        <Nav.Link href="#" active>Home</Nav.Link>
        <Nav.Link href="#">Dashboard</Nav.Link>
        <Nav.Link href="#">Analytics</Nav.Link>
        <Nav.Link href="#">Settings</Nav.Link>
        <Nav.Link href="#">Profile</Nav.Link>
      </Nav>
      <div className="sidebar-footer">
        <p>© 2025 ModernApp</p>
      </div>
    </div>
  );
};

export default Sidebar;