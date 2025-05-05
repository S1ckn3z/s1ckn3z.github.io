// src/pages/HomePage.tsx
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="welcome-section">
            <h1>Welcome to ModernApp</h1>
            <p className="lead">
              A modern TypeScript React application with a clean, responsive design.
            </p>
            <Button variant="primary" size="lg">Get Started</Button>
          </div>
        </Col>
      </Row>
      
      <h2 className="section-title">Available Tools</h2>
      
      <Row className="g-4">
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
        
        {/* Tool 2 Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>
              <Card.Title>Document Manager</Card.Title>
              <Card.Text>
                Organize and manage your documents with powerful search and filtering.
              </Card.Text>
              <Button variant="outline-primary">Open Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tool 3 Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <Card.Title>Task Scheduler</Card.Title>
              <Card.Text>
                Plan and schedule your tasks with reminders and progress tracking.
              </Card.Text>
              <Button variant="outline-primary">Open Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tool 4 Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-chat-dots"></i>
              </div>
              <Card.Title>Team Chat</Card.Title>
              <Card.Text>
                Communicate with your team in real-time with messaging and file sharing.
              </Card.Text>
              <Button variant="outline-primary">Open Tool</Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Tool 5 Placeholder */}
        <Col xs={12} md={6} lg={4}>
          <Card className="tool-card">
            <Card.Body>
              <div className="tool-icon">
                <i className="bi bi-gear"></i>
              </div>
              <Card.Title>Settings</Card.Title>
              <Card.Text>
                Configure your application preferences and account settings.
              </Card.Text>
              <Button variant="outline-primary">Open Tool</Button>
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
                Extend your application with additional tools and integrations.
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