import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { NumberInput, StringListEditor, SectionDivider, BooleanToggle } from '../../wildstacker/FormComponents';

interface CommandsCooldownsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
  updateNestedKeyValue: (path: string[], key: string, value: unknown) => void;
  deleteNestedKeyValue: (path: string[], key: string) => void;
}

const CommandsCooldownsSettings: React.FC<CommandsCooldownsSettingsProps> = ({
  getConfigValue,
  updateConfig,
  updateNestedKeyValue,
  deleteNestedKeyValue
}) => {
  return (
    <Form>
      <SectionDivider
        title="Commands Cooldown Configuration"
        description="Configure cooldowns for specific commands"
      />
      
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Header>Commands Cooldown</Card.Header>
            <Card.Body>
              {/* Display existing command cooldowns */}
              {Object.entries(getConfigValue(['commands-cooldown'], {} as Record<string, unknown>)).map(([command, cooldownObj]) => {
                if (typeof cooldownObj === 'object' && cooldownObj !== null) {
                  const cooldown = (cooldownObj as Record<string, unknown>).cooldown as number;
                  const bypassPermission = (cooldownObj as Record<string, unknown>)['bypass-permission'] as string;
                  
                  return (
                    <div key={command} className="mb-3 p-3 border rounded">
                      <div className="mb-2">
                        <strong>Command:</strong> {command}
                      </div>
                      <div className="mb-2 d-flex align-items-center">
                        <span className="me-2">Cooldown (ms):</span>
                        <input
                          type="number"
                          value={cooldown}
                          onChange={(e) => updateNestedKeyValue(['commands-cooldown', command], 'cooldown', parseInt(e.target.value))}
                          className="form-control me-2"
                          min={0}
                        />
                      </div>
                      <div className="mb-2 d-flex align-items-center">
                        <span className="me-2">Bypass Permission:</span>
                        <input
                          type="text"
                          value={bypassPermission}
                          onChange={(e) => updateNestedKeyValue(['commands-cooldown', command], 'bypass-permission', e.target.value)}
                          className="form-control me-2"
                          placeholder="Permission node"
                        />
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => deleteNestedKeyValue(['commands-cooldown'], command)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </Button>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Add new command cooldown */}
              <div className="mt-3 p-3 border rounded">
                <h6>Add New Command Cooldown</h6>
                <div className="mb-2">
                  <input
                    id="new-cooldown-command"
                    placeholder="Command name (e.g., recalc)"
                    className="form-control mb-2"
                  />
                </div>
                <div className="mb-2">
                  <input
                    id="new-cooldown-time"
                    type="number"
                    placeholder="Cooldown (ms)"
                    className="form-control mb-2"
                    min={0}
                  />
                </div>
                <div className="mb-2">
                  <input
                    id="new-cooldown-permission"
                    placeholder="Bypass permission (e.g., superior.cooldown.bypass.recalc)"
                    className="form-control mb-2"
                  />
                </div>
                <Button 
                  variant="primary"
                  onClick={() => {
                    const command = (document.getElementById('new-cooldown-command') as HTMLInputElement).value;
                    const cooldown = parseInt((document.getElementById('new-cooldown-time') as HTMLInputElement).value);
                    const permission = (document.getElementById('new-cooldown-permission') as HTMLInputElement).value;
                    
                    if (command && !isNaN(cooldown)) {
                      updateConfig(['commands-cooldown', command], {
                        cooldown: cooldown,
                        'bypass-permission': permission || undefined
                      });
                      
                      (document.getElementById('new-cooldown-command') as HTMLInputElement).value = '';
                      (document.getElementById('new-cooldown-time') as HTMLInputElement).value = '';
                      (document.getElementById('new-cooldown-permission') as HTMLInputElement).value = '';
                    }
                  }}
                >
                  <i className="bi bi-plus"></i> Add Command
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <SectionDivider
        title="Upgrade Cooldown"
        description="Set cooldown for upgrading island values"
      />
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="upgrade-cooldown"
            label="Upgrade Cooldown (ms)"
            value={getConfigValue(['upgrade-cooldown'], -1)}
            onChange={(value) => updateConfig(['upgrade-cooldown'], value)}
            min={-1}
            helpText="Cooldown for upgrading island values (-1 to disable)"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Recalc Task Configuration"
        description="Configure the recalculation task"
      />
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="recalc-task-timeout"
            label="Recalc Task Timeout (seconds)"
            value={getConfigValue(['recalc-task-timeout'], 10)}
            onChange={(value) => updateConfig(['recalc-task-timeout'], value)}
            min={0}
            helpText="Timeout for the recalculate task, in seconds (0 to disable)"
          />
        </Col>
        <Col md={6}>
          <NumberInput
            id="block-counts-save-threshold"
            label="Block Counts Save Threshold"
            value={getConfigValue(['block-counts-save-threshold'], 100)}
            onChange={(value) => updateConfig(['block-counts-save-threshold'], value)}
            min={1}
            helpText="Number of blocks to update before saving block counts to database"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Command Related Settings"
        description="Configure command-related functionality"
      />
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="ban-confirm"
            label="Ban Confirm GUI"
            value={getConfigValue(['ban-confirm'], true)}
            onChange={(value) => updateConfig(['ban-confirm'], value)}
            helpText="Should a confirm gui be displayed when /is ban is executed"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="disband-confirm"
            label="Disband Confirm GUI"
            value={getConfigValue(['disband-confirm'], true)}
            onChange={(value) => updateConfig(['disband-confirm'], value)}
            helpText="Should a confirm gui be displayed when /is disband is executed"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="kick-confirm"
            label="Kick Confirm GUI"
            value={getConfigValue(['kick-confirm'], true)}
            onChange={(value) => updateConfig(['kick-confirm'], value)}
            helpText="Should a confirm gui be displayed when /is kick is executed"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="leave-confirm"
            label="Leave Confirm GUI"
            value={getConfigValue(['leave-confirm'], true)}
            onChange={(value) => updateConfig(['leave-confirm'], value)}
            helpText="Should a confirm gui be displayed when /is leave is executed"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="disband-inventory-clear"
            label="Clear Inventory on Disband"
            value={getConfigValue(['disband-inventory-clear'], true)}
            onChange={(value) => updateConfig(['disband-inventory-clear'], value)}
            helpText="Should inventories of island members get cleared after disbanding their island?"
          />
        </Col>
        <Col md={6}>
          <NumberInput
            id="disband-count"
            label="Disband Count"
            value={getConfigValue(['disband-count'], 5)}
            onChange={(value) => updateConfig(['disband-count'], value)}
            min={0}
            helpText="The amount of times a player can disband an island (0 to disable)"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="schematic-name-argument"
            label="Schematic Name Argument"
            value={getConfigValue(['schematic-name-argument'], true)}
            onChange={(value) => updateConfig(['schematic-name-argument'], value)}
            helpText="Should there be a schematic-name argument in the create command?"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Disabled Commands & Hooks"
        description="Configure which commands and hooks should be disabled"
      />
      
      <Row>
        <Col md={6}>
          <StringListEditor
            id="disabled-commands"
            label="Disabled Commands"
            values={getConfigValue(['disabled-commands'], [])}
            onChange={(values) => updateConfig(['disabled-commands'], values)}
            helpText="A list of commands that should be disabled within the plugin"
            placeholder="Add command..."
          />
        </Col>
        
        <Col md={6}>
          <StringListEditor
            id="disabled-hooks"
            label="Disabled Hooks"
            values={getConfigValue(['disabled-hooks'], [])}
            onChange={(values) => updateConfig(['disabled-hooks'], values)}
            helpText="List of plugins that their hooks should not be enabled"
            placeholder="Add plugin name..."
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <StringListEditor
            id="disabled-events"
            label="Disabled Events"
            values={getConfigValue(['disabled-events'], [])}
            onChange={(values) => updateConfig(['disabled-events'], values)}
            helpText="A list of events that will not be fired (can increase performance)"
            placeholder="Add event name..."
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Command Aliases"
        description="Configure custom aliases for plugin commands"
      />
      
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Header>Command Aliases</Card.Header>
            <Card.Body>
              {/* Display existing command aliases */}
              {Object.entries(getConfigValue(['command-aliases'], {} as Record<string, unknown>)).map(([command, aliases]) => {
                if (Array.isArray(aliases)) {
                  return (
                    <div key={command} className="mb-3 p-3 border rounded">
                      <div className="mb-2">
                        <strong>Command:</strong> {command}
                      </div>
                      <div className="mb-2">
                        <strong>Aliases:</strong>
                        <StringListEditor
                          id={`command-aliases-${command}`}
                          label=""
                          values={aliases}
                          onChange={(values) => updateConfig(['command-aliases', command], values)}
                          placeholder="Add alias..."
                        />
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => deleteNestedKeyValue(['command-aliases'], command)}
                      >
                        <i className="bi bi-trash"></i> Remove
                      </Button>
                    </div>
                  );
                }
                return null;
              })}
              
              {/* Add new command alias */}
              <div className="mt-3 p-3 border rounded">
                <h6>Add New Command Alias</h6>
                <div className="mb-2">
                  <input
                    id="new-alias-command"
                    placeholder="Command name (e.g., island-info)"
                    className="form-control mb-2"
                  />
                </div>
                <div className="mb-2">
                  <input
                    id="new-alias-list"
                    placeholder="Aliases (comma separated, e.g., is-info,i-info)"
                    className="form-control mb-2"
                  />
                </div>
                <Button 
                  variant="primary"
                  onClick={() => {
                    const command = (document.getElementById('new-alias-command') as HTMLInputElement).value;
                    const aliasesStr = (document.getElementById('new-alias-list') as HTMLInputElement).value;
                    
                    if (command && aliasesStr) {
                      const aliases = aliasesStr.split(',').map(a => a.trim()).filter(a => a.length > 0);
                      if (aliases.length > 0) {
                        updateConfig(['command-aliases', command], aliases);
                        
                        (document.getElementById('new-alias-command') as HTMLInputElement).value = '';
                        (document.getElementById('new-alias-list') as HTMLInputElement).value = '';
                      }
                    }
                  }}
                >
                  <i className="bi bi-plus"></i> Add Aliases
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default CommandsCooldownsSettings;
