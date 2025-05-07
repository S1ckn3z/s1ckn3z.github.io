// src/components/wildstacker/UnifiedConfigEditor.tsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Nav, Tab, Card, Button } from 'react-bootstrap';
import { 
  TextInput, 
  NumberInput, 
  BooleanToggle, 
  StringListEditor, 
  SectionDivider
} from './FormComponents';
import { createYaml, parseYaml } from '../../utils/YamlUtils';

interface UnifiedConfigEditorProps {
  initialYaml: string;
}

// Type for configuration object
type ConfigObject = Record<string, unknown>;

/**
 * A unified editor component for the entire WildStacker configuration
 */
const UnifiedConfigEditor: React.FC<UnifiedConfigEditorProps> = ({ initialYaml }) => {
  // State for the complete configuration
  const [config, setConfig] = useState<ConfigObject>({});
  
  // YAML representation of the current configuration
  const [yamlContent, setYamlContent] = useState<string>(initialYaml);
  
  // Active section for navigation
  const [activeSection, setActiveSection] = useState<string>('general');
  
  // Parse the initial YAML to get the starting configuration
  useEffect(() => {
    try {
      const result = parseYaml(initialYaml);
      if (result.isValid && result.parsedData) {
        setConfig(result.parsedData);
      } else {
        console.error('Invalid YAML:', result.errors);
      }
    } catch (error) {
      console.error('Error parsing initial YAML:', error);
    }
  }, [initialYaml]);
  
  // Update YAML content when config changes
  useEffect(() => {
    if (Object.keys(config).length > 0) {
      try {
        // Extract header comment from initial YAML
        const headerMatch = initialYaml.match(/^([\s\S]*?)(?=\w+:)/);
        const headerComment = headerMatch ? headerMatch[0] : '';
        
        const newYaml = createYaml(config, true, headerComment);
        setYamlContent(newYaml);
      } catch (error) {
        console.error('Error generating YAML:', error);
      }
    }
  }, [config, initialYaml]);
  
  // Function to download the YAML file
  const downloadYaml = (): void => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Function to import a YAML file
  const importYaml = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setYamlContent(content);
        
        try {
          const result = parseYaml(content);
          if (result.isValid && result.parsedData) {
            setConfig(result.parsedData);
          } else {
            console.error('Invalid YAML:', result.errors);
          }
        } catch (error) {
          console.error('Error parsing imported YAML:', error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  // Function to update a specific field in the configuration
  const updateConfig = (path: string[], value: unknown): void => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      let current: Record<string, unknown> = newConfig;
      
      // Navigate to the nested property
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]] || typeof current[path[i]] !== 'object') {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      
      // Set the value
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };
  
  // Function to format YAML with basic syntax highlighting
  const formatYaml = (yaml: string): string => {
    // Simple syntax highlighting for YAML
    // WARNING: Using dangerouslySetInnerHTML below, ensure yamlContent is sanitized if needed
    return yaml
      .replace(/^([\w-]+):/gm, '<span class="yaml-key">$1:</span>')
      .replace(/: (true|false)/g, ': <span class="yaml-boolean">$1</span>')
      .replace(/: (\d+)/g, ': <span class="yaml-number">$1</span>')
      .replace(/: '(.+?)'/g, ': <span class="yaml-string">\'$1\'</span>')
      .replace(/: "(.+?)"/g, ': <span class="yaml-string">"$1"</span>')
      .replace(/^(\s*)(- )/gm, '$1<span class="yaml-list">$2</span>')
      .replace(/^(\s*#.*)$/gm, '<span class="yaml-comment">$1</span>');
  };

  // Helper function to get a nested value from the config
  function getConfigValue<T>(path: string[], defaultValue: T): T {
    let current: unknown = config;
    
    for (const key of path) {
      if (current === undefined || current === null || typeof current !== 'object') {
        return defaultValue;
      }
      current = (current as Record<string, unknown>)[key];
    }
    
    return (current !== undefined ? (current as T) : defaultValue);
  }

  return (
    <div className="unified-editor">
      <div className="editor-header mb-4">
        <div>
          <h2>WildStacker Configuration Editor</h2>
          <p className="text-muted">Edit your complete WildStacker configuration in one place</p>
        </div>
        <div className="editor-actions">
          <input
            type="file"
            id="yaml-upload"
            className="d-none"
            accept=".yml,.yaml"
            onChange={importYaml}
          />
          <label 
            htmlFor="yaml-upload" 
            className="btn btn-outline-primary me-2"
          >
            <i className="bi bi-upload me-1"></i>
            Import
          </label>
          <Button 
            variant="success" 
            onClick={downloadYaml}
          >
            <i className="bi bi-download me-1"></i>
            Download
          </Button>
        </div>
      </div>

      <Tab.Container activeKey={activeSection} onSelect={(k) => setActiveSection(k || 'general')}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column config-nav">
              <Nav.Item>
                <Nav.Link eventKey="general">General Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="items">Items Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="entities">Entities Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="spawners">Spawners Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="barrels">Barrels Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="buckets">Buckets Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stews">Stews Configuration</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="yaml" className="yaml-preview-tab">YAML Preview</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col md={9}>
            <Tab.Content>
              {/* General Settings Section */}
              <Tab.Pane eventKey="general">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Basic Settings"
                        description="Configure general plugin settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="give-item-name"
                            label="Give Item Name Format"
                            value={getConfigValue(['give-item-name'], '&6x{0} &f&o{1} {2}')}
                            onChange={(value) => updateConfig(['give-item-name'], value)}
                            helpText="{0} represents stack size, {1} represents entity/block type, {2} represents item type"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Inspect Tool"
                        description="Configure the tool used to inspect stacked objects"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="inspect-tool-type"
                            label="Tool Type"
                            value={getConfigValue(['inspect-tool', 'type'], 'STICK')}
                            onChange={(value) => updateConfig(['inspect-tool', 'type'], value)}
                            helpText="Material type for the inspect tool (e.g., STICK)"
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <TextInput
                            id="inspect-tool-name"
                            label="Tool Name"
                            value={getConfigValue(['inspect-tool', 'name'], '&6Inspect Tool')}
                            onChange={(value) => updateConfig(['inspect-tool', 'name'], value)}
                            helpText="Display name for the inspect tool (supports color codes)"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="inspect-tool-lore"
                            label="Tool Lore"
                            values={getConfigValue(['inspect-tool', 'lore'], ['&7Click on an object to get more details about it.'])}
                            onChange={(values) => updateConfig(['inspect-tool', 'lore'], values)}
                            helpText="Lore text for the inspect tool (supports color codes)"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Simulate Tool"
                        description="Configure the tool used to simulate stacking"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="simulate-tool-type"
                            label="Tool Type"
                            value={getConfigValue(['simulate-tool', 'type'], 'STICK')}
                            onChange={(value) => updateConfig(['simulate-tool', 'type'], value)}
                            helpText="Material type for the simulate tool (e.g., STICK)"
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <TextInput
                            id="simulate-tool-name"
                            label="Tool Name"
                            value={getConfigValue(['simulate-tool', 'name'], '&6Simulate Tool')}
                            onChange={(value) => updateConfig(['simulate-tool', 'name'], value)}
                            helpText="Display name for the simulate tool (supports color codes)"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="simulate-tool-lore"
                            label="Tool Lore"
                            values={getConfigValue(['simulate-tool', 'lore'], ['&7Click on two objects to check if they can stack together.'])}
                            onChange={(values) => updateConfig(['simulate-tool', 'lore'], values)}
                            helpText="Lore text for the simulate tool (supports color codes)"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Database Settings"
                        description="Configure database behavior"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="delete-invalid-worlds"
                            label="Delete Invalid Worlds"
                            value={getConfigValue(['database', 'delete-invalid-worlds'], false)}
                            onChange={(value) => updateConfig(['database', 'delete-invalid-worlds'], value)}
                            helpText="Should data of worlds that no longer exist be deleted?"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Kill Task Settings"
                        description="Configure automatic entity/item cleaning"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="kill-task-interval"
                            label="Auto-Kill Interval (seconds)"
                            value={getConfigValue(['kill-task', 'interval'], 0)}
                            onChange={(value) => updateConfig(['kill-task', 'interval'], value)}
                            min={0}
                            helpText="How much time should pass between auto-killing? Set to 0 to disable."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="kill-task-stacked-entities"
                            label="Kill Stacked Entities"
                            value={getConfigValue(['kill-task', 'stacked-entities'], true)}
                            onChange={(value) => updateConfig(['kill-task', 'stacked-entities'], value)}
                            helpText="Should the kill task remove stacked entities?"
                          />
                          
                          <BooleanToggle
                            id="kill-task-unstacked-entities"
                            label="Kill Unstacked Entities"
                            value={getConfigValue(['kill-task', 'unstacked-entities'], true)}
                            onChange={(value) => updateConfig(['kill-task', 'unstacked-entities'], value)}
                            helpText="Should the kill task remove unstacked entities?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="kill-task-stacked-items"
                            label="Kill Stacked Items"
                            value={getConfigValue(['kill-task', 'stacked-items'], true)}
                            onChange={(value) => updateConfig(['kill-task', 'stacked-items'], value)}
                            helpText="Should the kill task remove stacked items?"
                          />
                          
                          <BooleanToggle
                            id="kill-task-unstacked-items"
                            label="Kill Unstacked Items"
                            value={getConfigValue(['kill-task', 'unstacked-items'], true)}
                            onChange={(value) => updateConfig(['kill-task', 'unstacked-items'], value)}
                            helpText="Should the kill task remove unstacked items?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="kill-task-sync-clear-lagg"
                            label="Sync with ClearLagg"
                            value={getConfigValue(['kill-task', 'sync-clear-lagg'], false)}
                            onChange={(value) => updateConfig(['kill-task', 'sync-clear-lagg'], value)}
                            helpText="Should the plugin remove all stacked-entities when clearlagg removes items & entities?"
                          />
                        </Col>
                        <Col md={6}>
                          <TextInput
                            id="kill-task-time-command"
                            label="Time Command"
                            value={getConfigValue(['kill-task', 'time-command'], 'stacker timeleft')}
                            onChange={(value) => updateConfig(['kill-task', 'time-command'], value)}
                            helpText="Command for getting the next time until kill task will happen. Use '' to disable."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Items Configuration Section */}
              <Tab.Pane eventKey="items">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Items Configuration"
                        description="Configure how items are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="items-enabled"
                            label="Enable Item Stacking"
                            value={getConfigValue(['items', 'enabled'], false)}
                            onChange={(value) => updateConfig(['items', 'enabled'], value)}
                            helpText="Should items get stacked on the server?"
                          />
                          
                          <NumberInput
                            id="items-merge-radius-all"
                            label="Merge Radius"
                            value={getConfigValue(['items', 'merge-radius', 'all'], 5)}
                            onChange={(value) => updateConfig(['items', 'merge-radius', 'all'], value)}
                            min={1}
                            helpText="How many blocks from the item should be checked for other items to stack into?"
                          />
                          
                          <TextInput
                            id="items-custom-name"
                            label="Custom Display Name"
                            value={getConfigValue(['items', 'custom-name'], '&6x{0} &f&o{1}')}
                            onChange={(value) => updateConfig(['items', 'custom-name'], value)}
                            helpText="{0} represents stack amount, {1} represents display name, {2} represents display name in upper case"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="items-chunk-limit"
                            label="Chunk Limit"
                            value={getConfigValue(['items', 'chunk-limit'], 0)}
                            onChange={(value) => updateConfig(['items', 'chunk-limit'], value)}
                            min={0}
                            helpText="Maximum amount of item objects in a chunk. Set to 0 to disable."
                          />
                          
                          <BooleanToggle
                            id="items-particles"
                            label="Show Particles"
                            value={getConfigValue(['items', 'particles'], true)}
                            onChange={(value) => updateConfig(['items', 'particles'], value)}
                            helpText="Should particles be spawned when an item gets stacked?"
                          />
                          
                          <NumberInput
                            id="items-stack-interval"
                            label="Stack Interval (ticks)"
                            value={getConfigValue(['items', 'stack-interval'], 0)}
                            onChange={(value) => updateConfig(['items', 'stack-interval'], value)}
                            min={0}
                            helpText="How much time should pass between auto-stacking? Set to 0 to disable."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <StringListEditor
                            id="items-blacklist"
                            label="Blacklisted Items"
                            values={getConfigValue(['items', 'blacklist'], ['EXAMPLE_ITEM'])}
                            onChange={(values) => updateConfig(['items', 'blacklist'], values)}
                            helpText="Items that won't get stacked. Use material types like DIAMOND_SWORD, STONE, etc."
                            placeholder="Add item type..."
                          />
                        </Col>
                        
                        <Col md={6}>
                          <StringListEditor
                            id="items-whitelist"
                            label="Whitelisted Items"
                            values={getConfigValue(['items', 'whitelist'], [])}
                            onChange={(values) => updateConfig(['items', 'whitelist'], values)}
                            helpText="Only these items will get stacked if the list is not empty"
                            placeholder="Add item type..."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="items-disabled-worlds"
                            label="Disabled Worlds"
                            values={getConfigValue(['items', 'disabled-worlds'], ['disabled_world'])}
                            onChange={(values) => updateConfig(['items', 'disabled-worlds'], values)}
                            helpText="Worlds where items won't get stacked (case-sensitive)"
                            placeholder="Add world name..."
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Additional Settings"
                        description="Configure additional item stacking behavior"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="items-unstacked-custom-name"
                            label="Unstacked Custom Name"
                            value={getConfigValue(['items', 'unstacked-custom-name'], false)}
                            onChange={(value) => updateConfig(['items', 'unstacked-custom-name'], value)}
                            helpText="When enabled, all items will have a custom name (even if not stacked)"
                          />
                          
                          <BooleanToggle
                            id="items-fix-stack"
                            label="Fix Stack"
                            value={getConfigValue(['items', 'fix-stack'], false)}
                            onChange={(value) => updateConfig(['items', 'fix-stack'], value)}
                            helpText="When disabled, items with a max-stack of 1 will be added to inventories with a max-stack size of 64"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="items-item-display"
                            label="Item Display"
                            value={getConfigValue(['items', 'item-display'], false)}
                            onChange={(value) => updateConfig(['items', 'item-display'], value)}
                            helpText="When enabled, the item's name will be displayed instead of its type"
                          />
                          
                          <BooleanToggle
                            id="items-pickup-sound"
                            label="Pickup Sound"
                            value={getConfigValue(['items', 'pickup-sound'], true)}
                            onChange={(value) => updateConfig(['items', 'pickup-sound'], value)}
                            helpText="Should pickup-sound be enabled for stacked items?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="items-max-pickup-delay"
                            label="Max Pickup Delay"
                            value={getConfigValue(['items', 'max-pickup-delay'], false)}
                            onChange={(value) => updateConfig(['items', 'max-pickup-delay'], value)}
                            helpText="Should items with the max pickup delay get stacked?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="items-store-items"
                            label="Store Items"
                            value={getConfigValue(['items', 'store-items'], true)}
                            onChange={(value) => updateConfig(['items', 'store-items'], value)}
                            helpText="Should items get stored into the database?"
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Entities Configuration Section */}
              <Tab.Pane eventKey="entities">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Entities Configuration"
                        description="Configure how entities are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="entities-enabled"
                            label="Enable Entity Stacking"
                            value={getConfigValue(['entities', 'enabled'], true)}
                            onChange={(value) => updateConfig(['entities', 'enabled'], value)}
                            helpText="Should entities get stacked on the server?"
                          />
                          
                          <NumberInput
                            id="entities-merge-radius-all"
                            label="Merge Radius"
                            value={getConfigValue(['entities', 'merge-radius', 'all'], 10)}
                            onChange={(value) => updateConfig(['entities', 'merge-radius', 'all'], value)}
                            min={1}
                            helpText="How many blocks from the entity should be checked for other entities to stack into?"
                          />
                          
                          <TextInput
                            id="entities-custom-name"
                            label="Custom Display Name"
                            value={getConfigValue(['entities', 'custom-name'], '&6x{0} &f&o{1}{3}')}
                            onChange={(value) => updateConfig(['entities', 'custom-name'], value)}
                            helpText="{0} represents stack amount, {1} represents entity type, {2} entity type in upper case, {3} upgrade display name"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="entities-chunk-limit"
                            label="Chunk Limit"
                            value={getConfigValue(['entities', 'chunk-limit'], 0)}
                            onChange={(value) => updateConfig(['entities', 'chunk-limit'], value)}
                            min={0}
                            helpText="Maximum amount of entity objects in a chunk. Set to 0 to disable."
                          />
                          
                          <BooleanToggle
                            id="entities-particles"
                            label="Show Particles"
                            value={getConfigValue(['entities', 'particles'], true)}
                            onChange={(value) => updateConfig(['entities', 'particles'], value)}
                            helpText="Should particles be spawned when an entity gets stacked?"
                          />
                          
                          <NumberInput
                            id="entities-stack-interval"
                            label="Stack Interval (ticks)"
                            value={getConfigValue(['entities', 'stack-interval'], 4)}
                            onChange={(value) => updateConfig(['entities', 'stack-interval'], value)}
                            min={0}
                            helpText="How much time should pass between auto-stacking? Set to 0 to disable."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <StringListEditor
                            id="entities-blacklist"
                            label="Blacklisted Entities"
                            values={getConfigValue(['entities', 'blacklist'], [])}
                            onChange={(values) => updateConfig(['entities', 'blacklist'], values)}
                            helpText="Entities that won't get stacked. Use entity types like ZOMBIE, SKELETON, etc."
                            placeholder="Add entity type..."
                          />
                          
                          <StringListEditor
                            id="entities-disabled-worlds"
                            label="Disabled Worlds"
                            values={getConfigValue(['entities', 'disabled-worlds'], ['disabled_world'])}
                            onChange={(values) => updateConfig(['entities', 'disabled-worlds'], values)}
                            helpText="Worlds where entities won't get stacked (case-sensitive)"
                            placeholder="Add world name..."
                          />
                        </Col>
                        
                        <Col md={6}>
                          <StringListEditor
                            id="entities-whitelist"
                            label="Whitelisted Entities"
                            values={getConfigValue(['entities', 'whitelist'], [
                              'SPIDER', 'CAVE_SPIDER', 'CREEPER', 'SKELETON', 'ZOMBIE'
                            ])}
                            onChange={(values) => updateConfig(['entities', 'whitelist'], values)}
                            helpText="Only these entities will get stacked if the list is not empty"
                            placeholder="Add entity type..."
                          />
                          
                          <StringListEditor
                            id="entities-disabled-regions"
                            label="Disabled Regions"
                            values={getConfigValue(['entities', 'disabled-regions'], [])}
                            onChange={(values) => updateConfig(['entities', 'disabled-regions'], values)}
                            helpText="WorldGuard regions where entities won't get stacked"
                            placeholder="Add region name..."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="entities-name-blacklist"
                            label="Name Blacklist"
                            values={getConfigValue(['entities', 'name-blacklist'], [])}
                            onChange={(values) => updateConfig(['entities', 'name-blacklist'], values)}
                            helpText="Entities with these names won't get stacked. Color codes and regex are supported."
                            placeholder="Add name pattern..."
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Linked Entities"
                        description="Configure entities linked to spawners"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="entities-linked-enabled"
                            label="Enable Linked Entities"
                            value={getConfigValue(['entities', 'linked-entities', 'enabled'], false)}
                            onChange={(value) => updateConfig(['entities', 'linked-entities', 'enabled'], value)}
                            helpText="Should entities be linked to spawners?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="entities-linked-max-distance"
                            label="Maximum Distance"
                            value={getConfigValue(['entities', 'linked-entities', 'max-distance'], 10)}
                            onChange={(value) => updateConfig(['entities', 'linked-entities', 'max-distance'], value)}
                            min={1}
                            helpText="The maximum distance that the linked entity can be from the spawner"
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Spawners Configuration Section */}
              <Tab.Pane eventKey="spawners">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Spawners Configuration"
                        description="Configure how spawners are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="spawners-enabled"
                            label="Enable Spawner Stacking"
                            value={getConfigValue(['spawners', 'enabled'], false)}
                            onChange={(value) => updateConfig(['spawners', 'enabled'], value)}
                            helpText="Should spawners get stacked on the server?"
                          />
                          
                          <NumberInput
                            id="spawners-merge-radius-all"
                            label="Merge Radius"
                            value={getConfigValue(['spawners', 'merge-radius', 'all'], 1)}
                            onChange={(value) => updateConfig(['spawners', 'merge-radius', 'all'], value)}
                            min={1}
                            helpText="How many blocks from the spawner should be checked for other spawners to stack into?"
                          />
                          
                          <TextInput
                            id="spawners-custom-name"
                            label="Custom Display Name"
                            value={getConfigValue(['spawners', 'custom-name'], '&6x{0} &f&o{1}{3}')}
                            onChange={(value) => updateConfig(['spawners', 'custom-name'], value)}
                            helpText="{0} represents stack amount, {1} represents entity type, {2} entity type in upper case, {3} upgrade display name"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="spawners-chunk-limit"
                            label="Chunk Limit"
                            value={getConfigValue(['spawners', 'chunk-limit'], 0)}
                            onChange={(value) => updateConfig(['spawners', 'chunk-limit'], value)}
                            min={0}
                            helpText="Maximum amount of spawner objects in a chunk. Set to 0 to disable."
                          />
                          
                          <BooleanToggle
                            id="spawners-particles"
                            label="Show Particles"
                            value={getConfigValue(['spawners', 'particles'], true)}
                            onChange={(value) => updateConfig(['spawners', 'particles'], value)}
                            helpText="Should particles be spawned when a spawner gets stacked?"
                          />
                          
                          <BooleanToggle
                            id="spawners-chunk-merge"
                            label="Chunk Merge"
                            value={getConfigValue(['spawners', 'chunk-merge'], false)}
                            onChange={(value) => updateConfig(['spawners', 'chunk-merge'], value)}
                            helpText="Should the plugin try to find a spawner in the whole chunk instead of only in the provided radius?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <StringListEditor
                            id="spawners-blacklist"
                            label="Blacklisted Spawners"
                            values={getConfigValue(['spawners', 'blacklist'], [])}
                            onChange={(values) => updateConfig(['spawners', 'blacklist'], values)}
                            helpText="Spawners that won't get stacked. Use entity types like ZOMBIE, SKELETON, etc."
                            placeholder="Add entity type..."
                          />
                        </Col>
                        
                        <Col md={6}>
                          <StringListEditor
                            id="spawners-whitelist"
                            label="Whitelisted Spawners"
                            values={getConfigValue(['spawners', 'whitelist'], [])}
                            onChange={(values) => updateConfig(['spawners', 'whitelist'], values)}
                            helpText="Only these spawners will get stacked if the list is not empty"
                            placeholder="Add entity type..."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="spawners-disabled-worlds"
                            label="Disabled Worlds"
                            values={getConfigValue(['spawners', 'disabled-worlds'], ['disabled_world'])}
                            onChange={(values) => updateConfig(['spawners', 'disabled-worlds'], values)}
                            helpText="Worlds where spawners won't get stacked (case-sensitive)"
                            placeholder="Add world name..."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Barrels Configuration Section */}
              <Tab.Pane eventKey="barrels">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Barrels Configuration"
                        description="Configure how barrels (blocks) are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="barrels-enabled"
                            label="Enable Barrel Stacking"
                            value={getConfigValue(['barrels', 'enabled'], false)}
                            onChange={(value) => updateConfig(['barrels', 'enabled'], value)}
                            helpText="Should blocks get stacked into barrels on the server?"
                          />
                          
                          <NumberInput
                            id="barrels-merge-radius-all"
                            label="Merge Radius"
                            value={getConfigValue(['barrels', 'merge-radius', 'all'], 1)}
                            onChange={(value) => updateConfig(['barrels', 'merge-radius', 'all'], value)}
                            min={1}
                            helpText="How many blocks from the barrel should be checked for other blocks to stack into?"
                          />
                          
                          <TextInput
                            id="barrels-custom-name"
                            label="Custom Display Name"
                            value={getConfigValue(['barrels', 'custom-name'], '&6x{0} &f&o{1}')}
                            onChange={(value) => updateConfig(['barrels', 'custom-name'], value)}
                            helpText="{0} represents stack amount, {1} represents barrel type, {2} represents barrel type in upper case"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="barrels-chunk-limit"
                            label="Chunk Limit"
                            value={getConfigValue(['barrels', 'chunk-limit'], 0)}
                            onChange={(value) => updateConfig(['barrels', 'chunk-limit'], value)}
                            min={0}
                            helpText="Maximum amount of barrel objects in a chunk. Set to 0 to disable."
                          />
                          
                          <BooleanToggle
                            id="barrels-particles"
                            label="Show Particles"
                            value={getConfigValue(['barrels', 'particles'], true)}
                            onChange={(value) => updateConfig(['barrels', 'particles'], value)}
                            helpText="Should particles be spawned when a barrel gets stacked?"
                          />
                          
                          <BooleanToggle
                            id="barrels-chunk-merge"
                            label="Chunk Merge"
                            value={getConfigValue(['barrels', 'chunk-merge'], false)}
                            onChange={(value) => updateConfig(['barrels', 'chunk-merge'], value)}
                            helpText="Should the plugin try to find a block in the whole chunk instead of only in the provided radius?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <StringListEditor
                            id="barrels-blacklist"
                            label="Blacklisted Barrels"
                            values={getConfigValue(['barrels', 'blacklist'], [])}
                            onChange={(values) => updateConfig(['barrels', 'blacklist'], values)}
                            helpText="Barrels that won't get stacked. Use material types like STONE, DIRT, etc."
                            placeholder="Add material type..."
                          />
                        </Col>
                        
                        <Col md={6}>
                          <StringListEditor
                            id="barrels-whitelist"
                            label="Whitelisted Barrels"
                            values={getConfigValue(['barrels', 'whitelist'], [])}
                            onChange={(values) => updateConfig(['barrels', 'whitelist'], values)}
                            helpText="Only these barrels will get stacked if the list is not empty"
                            placeholder="Add material type..."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="barrels-disabled-worlds"
                            label="Disabled Worlds"
                            values={getConfigValue(['barrels', 'disabled-worlds'], ['disabled_world'])}
                            onChange={(values) => updateConfig(['barrels', 'disabled-worlds'], values)}
                            helpText="Worlds where barrels won't get stacked (case-sensitive)"
                            placeholder="Add world name..."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Buckets Configuration Section */}
              <Tab.Pane eventKey="buckets">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Buckets Configuration"
                        description="Configure how buckets are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="buckets-enabled"
                            label="Enable Bucket Stacking"
                            value={getConfigValue(['buckets', 'enabled'], false)}
                            onChange={(value) => updateConfig(['buckets', 'enabled'], value)}
                            helpText="Should buckets get stacked on the server?"
                          />
                          
                          <NumberInput
                            id="buckets-max-stack"
                            label="Max Stack Size"
                            value={getConfigValue(['buckets', 'max-stack'], 16)}
                            onChange={(value) => updateConfig(['buckets', 'max-stack'], value)}
                            min={1}
                            max={64}
                            helpText="The new max-stack size for buckets. Must be a number between 1 and 64."
                          />
                        </Col>
                        
                        <Col md={6}>
                          <StringListEditor
                            id="buckets-name-blacklist"
                            label="Name Blacklist"
                            values={getConfigValue(['buckets', 'name-blacklist'], ['&fGenbucket'])}
                            onChange={(values) => updateConfig(['buckets', 'name-blacklist'], values)}
                            helpText="A list of blacklisted bucket names."
                            placeholder="Add bucket name..."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Stews Configuration Section */}
              <Tab.Pane eventKey="stews">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Stews Configuration"
                        description="Configure how stews are stacked on your server"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="stews-enabled"
                            label="Enable Stew Stacking"
                            value={getConfigValue(['stews', 'enabled'], false)}
                            onChange={(value) => updateConfig(['stews', 'enabled'], value)}
                            helpText="Should stews get stacked on the server?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="stews-max-stack"
                            label="Max Stack Size"
                            value={getConfigValue(['stews', 'max-stack'], 16)}
                            onChange={(value) => updateConfig(['stews', 'max-stack'], value)}
                            min={1}
                            max={64}
                            helpText="The new max-stack size for stews. Must be a number between 1 and 64."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* YAML Preview Section */}
              <Tab.Pane eventKey="yaml">
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>YAML Preview</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(yamlContent);
                      }}
                    >
                      <i className="bi bi-clipboard me-1"></i>
                      Copy
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div 
                      className="yaml-preview" 
                      dangerouslySetInnerHTML={{ __html: formatYaml(yamlContent) }}
                    />
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default UnifiedConfigEditor;
