// src/pages/DeluxeMenusPage.tsx
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './DeluxeMenusPage.css';
import DeluxeMenusEditor from '../components/deluxemenus/DeluxeMenusEditor';

// Initial YAML content from the config.yml file
const initialYaml = `# DeluxeMenus 1.14.1-DEV-184 main configuration file
#
# A full wiki on how to use this plugin can be found at:
# https://wiki.helpch.at/clips-plugins/deluxemenus

debug: HIGHEST
check_updates: true
gui_menus:
  basics_menu:
    file: basics_menu.yml
  advanced_menu:
    file: advanced_menu.yml
  requirements_menu:
    file: requirements_menu.yml`;

const DeluxeMenusPage: React.FC = () => {
  const [yamlContent] = useState<string>(initialYaml);
  
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="page-header">
            <h1>DeluxeMenus Configuration Editor</h1>
            <p className="lead">
              Create and customize your DeluxeMenus plugin configuration with an interactive editor. 
              Design GUI menus, configure items, and set up commands and requirements.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <DeluxeMenusEditor initialYaml={yamlContent} />
        </Col>
      </Row>
    </Container>
  );
};

export default DeluxeMenusPage;