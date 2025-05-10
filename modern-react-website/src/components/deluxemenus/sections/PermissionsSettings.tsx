// src/components/deluxemenus/sections/PermissionsSettings.tsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider } from '../../wildstacker/FormComponents';

interface PermissionsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const PermissionsSettings: React.FC<PermissionsSettingsProps> = () => {
  return (
    <Form>
      <SectionDivider
        title="Requirements Reference"
        description="Guide for setting up permission and other requirements"
      />
      
      <Row>
        <Col>
          <div className="p-3 border rounded mb-3">
            <h5>Requirement Types</h5>
            <ul>
              <li><strong>has permission</strong> - Checks if a player has a specific permission</li>
              <li><strong>has money</strong> - Checks if a player has enough money (Vault required)</li>
              <li><strong>has item</strong> - Checks if a player has a specific item</li>
              <li><strong>javascript</strong> - Evaluates a JavaScript expression</li>
              <li><strong>string equals</strong> - Checks if a string equals another string</li>
              <li><strong>string contains</strong> - Checks if a string contains another string</li>
              <li><strong>string equals ignorecase</strong> - Case-insensitive string comparison</li>
              <li><strong>&gt;</strong> - Checks if a number is greater than another number</li>
              <li><strong>&gt;=</strong> - Checks if a number is greater than or equal to another number</li>
              <li><strong>==</strong> - Checks if a number is equal to another number</li>
              <li><strong>&lt;=</strong> - Checks if a number is less than or equal to another number</li>
              <li><strong>&lt;</strong> - Checks if a number is less than another number</li>
              <li><strong>regex matches</strong> - Checks if a string matches a regex pattern</li>
            </ul>
          </div>
        </Col>
      </Row>
      
      <SectionDivider
        title="Requirement Usage"
        description="Where and how to use requirements"
      />
      
      <Row>
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Requirement Locations</h5>
            <ul>
              <li><strong>open_requirement</strong> - For opening the menu</li>
              <li><strong>view_requirement</strong> - For seeing an item</li>
              <li><strong>left_click_requirement</strong> - For left-clicking</li>
              <li><strong>right_click_requirement</strong> - For right-clicking</li>
              <li><strong>shift_left_click_requirement</strong> - For shift + left-clicking</li>
              <li><strong>shift_right_click_requirement</strong> - For shift + right-clicking</li>
              <li><strong>middle_click_requirement</strong> - For middle-clicking</li>
            </ul>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Permission Example</h5>
            <pre className="p-2 bg-light rounded">
{`open_requirement:
  requirements:
    permission:
      type: has permission
      permission: 'deluxemenus.admin'
      deny_commands:
      - '[message] No permission!'`}
            </pre>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <div className="p-3 border rounded mb-3">
            <h5>Item Priority System</h5>
            <p>
              Items can have priority values to determine which is shown when multiple items could be in the same slot.
              Lower priority numbers = higher priority (1 is highest priority).
            </p>
            <p>
              Example use case: Show different items in the same slot based on permissions, with the highest priority
              item being shown to players who meet all requirements.
            </p>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default PermissionsSettings;