// src/components/deluxemenus/sections/MenuSettings.tsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { TextInput, NumberInput, SectionDivider, BooleanToggle } from '../../wildstacker/FormComponents';

interface MenuSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const MenuSettings: React.FC<MenuSettingsProps> = () => {
  return (
    <Form>
      <SectionDivider
        title="Default Menu Settings"
        description="Configure default settings for all menus"
      />
      
      <p className="alert alert-info">
        These settings provide information about common menu options. When editing individual menus, 
        you can customize these settings per menu.
      </p>
      
      <Row>
        <Col md={6}>
          <TextInput
            id="menu-title-format"
            label="Menu Title Format"
            value=""
            onChange={() => {}}
            disabled
            helpText="Set in individual menus using menu_title option"
          />
        </Col>
        
        <Col md={6}>
          <NumberInput
            id="default-menu-size"
            label="Default Menu Size"
            value={54}
            onChange={() => {}}
            disabled
            min={9}
            max={54}
            step={9}
            helpText="Set in individual menus using size option (9, 18, 27, 36, 45, or 54)"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Menu Opening Options"
        description="Configure how menus are opened"
      />
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="register-commands"
            label="Register Commands"
            value={false}
            onChange={() => {}}
            disabled
            helpText="Set in individual menus using register_command: true option"
          />
        </Col>
        
        <Col md={6}>
          <NumberInput
            id="update-interval"
            label="Update Interval"
            value={1}
            onChange={() => {}}
            disabled
            min={1}
            helpText="Set in individual menus using update_interval option"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Menu Configuration Reference"
        description="Common options for menu configuration"
      />
      
      <Row>
        <Col>
          <div className="p-3 border rounded">
            <h5>Available Menu Options</h5>
            <ul>
              <li><strong>menu_title</strong> - The title displayed at the top of the menu</li>
              <li><strong>open_command</strong> - Command(s) to open the menu</li>
              <li><strong>size</strong> - Inventory size (9, 18, 27, 36, 45, or 54)</li>
              <li><strong>open_requirement</strong> - Requirements to open the menu</li>
              <li><strong>register_command</strong> - Whether to register the command</li>
              <li><strong>update_interval</strong> - How often to update dynamic items (in seconds)</li>
              <li><strong>open_commands</strong> - Commands to execute when menu is opened</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default MenuSettings;
