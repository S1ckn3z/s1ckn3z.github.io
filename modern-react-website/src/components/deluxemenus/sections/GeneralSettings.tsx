// src/components/deluxemenus/sections/GeneralSettings.tsx
import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { SelectInput, BooleanToggle, SectionDivider } from '../../wildstacker/FormComponents';

interface GeneralSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Global Configuration"
        description="Configure general plugin settings for DeluxeMenus"
      />
      
      <Row>
        <Col md={6}>
          <SelectInput
            id="debug-level"
            label="Debug Level"
            value={getConfigValue(['debug'], 'HIGHEST')}
            options={[
              { value: 'OFF', label: 'Off (No debug messages)' },
              { value: 'LOW', label: 'Low (Minimal debug messages)' },
              { value: 'MEDIUM', label: 'Medium (Standard debug messages)' },
              { value: 'HIGH', label: 'High (Detailed debug messages)' },
              { value: 'HIGHEST', label: 'Highest (Maximum debug messages)' }
            ]}
            onChange={(value) => updateConfig(['debug'], value)}
            helpText="The level of debug messages to show in console"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="check-updates"
            label="Check for Updates"
            value={getConfigValue(['check_updates'], true)}
            onChange={(value) => updateConfig(['check_updates'], value)}
            helpText="Should the plugin check for updates on startup?"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="GUI Menus"
        description="Manage your configured GUI menus"
      />
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <p className="mb-0">
                Your GUI menus are listed in the sidebar. Click on a menu to edit it, or click "Add Menu" to create a new one.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default GeneralSettings;