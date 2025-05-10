// src/pages/HomePage.tsx (update)
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './HomePage.css';

type Page = 'home' | 'wildstacker' | 'superiorskyblock' | 'deluxemenus';

type HomePageProps = {
  onNavigate: (page: Page) => void;
};

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="welcome-section">
            <h1>Welcome to ModernApp</h1>
            <p className="lead">
              A modern TypeScript React application for managing Minecraft plugin configurations.
            </p>
            <Button variant="primary" size="lg">Get Started</Button>
          </div>
        </Col>
      </Row>
      
      <h2 className="section-title">Available Tools</h2>
      
      <Row className="g-4">
        {/* WildStacker Config Tool */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-layers"></i>
              </div>
              <Card.Title>WildStacker Config Editor</Card.Title>
              <Card.Text>
                Edit your WildStacker plugin configuration files with an interactive editor.
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => onNavigate('wildstacker')}
              >
                Open Tool
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* SuperiorSkyblock Config Tool */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-grid-3x3-gap"></i>
              </div>
              <Card.Title>SuperiorSkyblock Config Editor</Card.Title>
              <Card.Text>
                Edit your SuperiorSkyblock 2 plugin configuration with a powerful interactive editor.
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => onNavigate('superiorskyblock')}
              >
                Open Tool
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tool 1 Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-graph-up"></i>
              </div>
              <Card.Title>Analytics Dashboard</Card.Title>
              <Card.Text>
                Visualize your data with interactive charts and comprehensive analytics.
              </Card.Text>
              <Button variant="outline-primary">Open Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* DeluxeMenus Config Tool */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-menu-button-wide"></i>
              </div>
              <Card.Title>DeluxeMenus Config Editor</Card.Title>
              <Card.Text>
                Create and customize GUI menus for your Minecraft server with an interactive editor.
              </Card.Text>
              <Button 
                variant="primary" 
                onClick={() => onNavigate('deluxemenus')}
              >
                Open Tool
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Add New Tool Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card add-tool">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-plus-lg"></i>
              </div>
              <Card.Title>Add New Tool</Card.Title>
              <Card.Text>
                Extend your application with additional plugin configurations and tools.
              </Card.Text>
              <Button variant="primary">Add Tool</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
