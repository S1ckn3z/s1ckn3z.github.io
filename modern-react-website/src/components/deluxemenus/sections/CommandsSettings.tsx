// src/components/deluxemenus/sections/CommandsSettings.tsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider } from '../../wildstacker/FormComponents';

interface CommandsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const CommandsSettings: React.FC<CommandsSettingsProps> = () => {
  return (
    <Form>
      <SectionDivider
        title="Commands Reference"
        description="Reference for available command types in DeluxeMenus"
      />
      
      <Row>
        <Col>
          <div className="p-3 border rounded mb-3">
            <h5>Click Command Types</h5>
            <ul>
              <li><strong>[console]</strong> - Execute a command from the console (eg. <code>[console] give %player_name% diamond 1</code>)</li>
              <li><strong>[player]</strong> - Execute a command as the player (eg. <code>[player] kit starter</code>)</li>
              <li><strong>[message]</strong> - Send a message to the player (eg. <code>[message] &aYou clicked an item!</code>)</li>
              <li><strong>[close]</strong> - Close the menu (eg. <code>[close]</code>)</li>
              <li><strong>[refresh]</strong> - Refresh the menu (eg. <code>[refresh]</code>)</li>
              <li><strong>[sound]</strong> - Play a sound (eg. <code>[sound] ENTITY_EXPERIENCE_ORB_PICKUP</code>)</li>
              <li><strong>[openguimenu]</strong> - Open another menu (eg. <code>[openguimenu] second_menu</code>)</li>
            </ul>
          </div>
        </Col>
      </Row>
      
      <SectionDivider
        title="Command Delay & Click Types"
        description="Options for command execution timing and click types"
      />
      
      <Row>
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Command Delay</h5>
            <p>You can add a delay to any command using <code>&lt;delay=ticks&gt;</code>.</p>
            <p>Example: <code>[message] This shows after 2 seconds&lt;delay=40&gt;</code></p>
            <p>Ticks are 1/20 of a second (20 ticks = 1 second)</p>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Click Type Commands</h5>
            <ul>
              <li><strong>left_click_commands</strong> - Left click</li>
              <li><strong>right_click_commands</strong> - Right click</li>
              <li><strong>shift_left_click_commands</strong> - Shift + Left click</li>
              <li><strong>shift_right_click_commands</strong> - Shift + Right click</li>
              <li><strong>middle_click_commands</strong> - Middle click</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default CommandsSettings;