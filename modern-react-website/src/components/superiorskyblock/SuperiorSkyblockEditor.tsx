// src/components/superiorskyblock/SuperiorSkyblockEditor.tsx
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Nav, Tab, Card, Button } from 'react-bootstrap';
import { 
  TextInput, 
  NumberInput, 
  BooleanToggle,
  SelectInput,
  StringListEditor,
  SectionDivider
} from '../wildstacker/FormComponents';
import './SuperiorSkyblockEditor.css';
import { createYaml, parseYaml } from '../../utils/YamlUtils';

interface SuperiorSkyblockEditorProps {
  initialYaml: string;
}

// Type for configuration object
type ConfigObject = Record<string, unknown>;

/**
 * A configuration editor component for SuperiorSkyblock 2
 */
const SuperiorSkyblockEditor: React.FC<SuperiorSkyblockEditorProps> = ({ initialYaml }) => {
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
  
  // Function to update a nested key-value property in the configuration
  const updateNestedKeyValue = (path: string[], key: string, value: unknown): void => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      let current: Record<string, unknown> = newConfig;
      
      // Navigate to the nested property
      for (let i = 0; i < path.length; i++) {
        if (!current[path[i]] || typeof current[path[i]] !== 'object') {
          current[path[i]] = {};
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      
      // Set the value for the key
      current[key] = value;
      return newConfig;
    });
  };
  
  // Function to delete a nested key-value property in the configuration
  const deleteNestedKeyValue = (path: string[], key: string): void => {
    setConfig(prevConfig => {
      const newConfig = { ...prevConfig };
      let current: Record<string, unknown> = newConfig;
      
      // Navigate to the nested property
      for (let i = 0; i < path.length; i++) {
        if (!current[path[i]] || typeof current[path[i]] !== 'object') {
          return prevConfig; // Path doesn't exist, return original config
        }
        current = current[path[i]] as Record<string, unknown>;
      }
      
      // Delete the key
      delete current[key];
      return newConfig;
    });
  };
  
  // Function to format YAML with basic syntax highlighting
  const formatYaml = (yaml: string): string => {
    // Simple syntax highlighting for YAML
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
          <h2>SuperiorSkyblock Configuration Editor</h2>
          <p className="text-muted">Edit your SuperiorSkyblock 2 configuration in one place</p>
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
                <Nav.Link eventKey="database">Database</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="default-values">Default Values</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="island-roles">Island Roles</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="island-worlds">Island Worlds</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="spawn">Spawn Settings</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="misc">Miscellaneous</Nav.Link>
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
                        title="Basic Configuration"
                        description="Configure general plugin settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="calc-interval"
                            label="Calculation Interval"
                            value={getConfigValue(['calc-interval'], 0)}
                            onChange={(value) => updateConfig(['calc-interval'], value)}
                            helpText="Time between auto calculations of all islands (0 to disable)"
                          />
                        </Col>
                        <Col md={6}>
                          <TextInput
                            id="island-command"
                            label="Island Command"
                            value={getConfigValue(['island-command'], 'island,is,islands')}
                            onChange={(value) => updateConfig(['island-command'], value)}
                            helpText="The main command and aliases (comma separated)"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="max-island-size"
                            label="Maximum Island Size"
                            value={getConfigValue(['max-island-size'], 200)}
                            onChange={(value) => updateConfig(['max-island-size'], value)}
                            min={50}
                            helpText="The maximum island size (don't change with running islands)"
                            required
                          />
                        </Col>
                        <Col md={6}>
                          <NumberInput
                            id="islands-height"
                            label="Islands Height"
                            value={getConfigValue(['islands-height'], 100)}
                            onChange={(value) => updateConfig(['islands-height'], value)}
                            min={50}
                            max={250}
                            helpText="The Y-level at which islands will be generated"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="world-borders"
                            label="World Borders"
                            value={getConfigValue(['world-borders'], true)}
                            onChange={(value) => updateConfig(['world-borders'], value)}
                            helpText="Enable per player world border in islands"
                          />
                        </Col>
                        <Col md={6}>
                          <BooleanToggle
                            id="default-world-border"
                            label="Default World Border"
                            value={getConfigValue(['default-world-border'], true)}
                            onChange={(value) => updateConfig(['default-world-border'], value)}
                            helpText="Should world borders be enabled by default for new players"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <SelectInput
                            id="default-border-color"
                            label="Default Border Color"
                            value={getConfigValue(['default-border-color'], 'BLUE')}
                            options={[
                              { value: 'BLUE', label: 'Blue' },
                              { value: 'GREEN', label: 'Green' },
                              { value: 'RED', label: 'Red' }
                            ]}
                            onChange={(value) => updateConfig(['default-border-color'], value)}
                            helpText="The default color for world borders"
                          />
                        </Col>
                        <Col md={6}>
                          <BooleanToggle
                            id="coop-members"
                            label="Coop Members"
                            value={getConfigValue(['coop-members'], true)}
                            onChange={(value) => updateConfig(['coop-members'], value)}
                            helpText="Whether coop members should be enabled or not"
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Database Settings Section */}
              <Tab.Pane eventKey="database">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Database Configuration"
                        description="Configure the database settings for SuperiorSkyblock"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <SelectInput
                            id="database-type"
                            label="Database Type"
                            value={getConfigValue(['database', 'type'], 'SQLite')}
                            options={[
                              { value: 'SQLite', label: 'SQLite (Local)' },
                              { value: 'MySQL', label: 'MySQL (Remote)' },
                              { value: 'MariaDB', label: 'MariaDB (Remote)' }
                            ]}
                            onChange={(value) => updateConfig(['database', 'type'], value)}
                            helpText="Type of database to use"
                            required
                          />
                          
                          <BooleanToggle
                            id="database-backup"
                            label="Backup on Startup"
                            value={getConfigValue(['database', 'backup'], true)}
                            onChange={(value) => updateConfig(['database', 'backup'], value)}
                            helpText="Whether the datastore folder should be backed up on startup"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Remote Database Settings"
                        description="These settings are only used for MySQL and MariaDB"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="database-address"
                            label="Database Address"
                            value={getConfigValue(['database', 'address'], 'localhost')}
                            onChange={(value) => updateConfig(['database', 'address'], value)}
                            helpText="The address of the database server"
                          />
                          
                          <NumberInput
                            id="database-port"
                            label="Database Port"
                            value={getConfigValue(['database', 'port'], 3306)}
                            onChange={(value) => updateConfig(['database', 'port'], value)}
                            min={1}
                            max={65535}
                            helpText="The port of the database server"
                          />
                          
                          <TextInput
                            id="database-db-name"
                            label="Database Name"
                            value={getConfigValue(['database', 'db-name'], 'SuperiorSkyblock')}
                            onChange={(value) => updateConfig(['database', 'db-name'], value)}
                            helpText="The name of the database"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <TextInput
                            id="database-user-name"
                            label="Username"
                            value={getConfigValue(['database', 'user-name'], 'root')}
                            onChange={(value) => updateConfig(['database', 'user-name'], value)}
                            helpText="The username for the database"
                          />
                          
                          <TextInput
                            id="database-password"
                            label="Password"
                            value={getConfigValue(['database', 'password'], 'root')}
                            onChange={(value) => updateConfig(['database', 'password'], value)}
                            helpText="The password for the database"
                          />
                          
                          <TextInput
                            id="database-prefix"
                            label="Table Prefix"
                            value={getConfigValue(['database', 'prefix'], '')}
                            onChange={(value) => updateConfig(['database', 'prefix'], value)}
                            helpText="Optional prefix for database tables"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="database-useSSL"
                            label="Use SSL"
                            value={getConfigValue(['database', 'useSSL'], false)}
                            onChange={(value) => updateConfig(['database', 'useSSL'], value)}
                            helpText="Whether to use SSL for the database connection"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="database-allowPublicKeyRetrieval"
                            label="Allow Public Key Retrieval"
                            value={getConfigValue(['database', 'allowPublicKeyRetrieval'], true)}
                            onChange={(value) => updateConfig(['database', 'allowPublicKeyRetrieval'], value)}
                            helpText="Allow the client to automatically request public keys from the server"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="database-waitTimeout"
                            label="Wait Timeout (ms)"
                            value={getConfigValue(['database', 'waitTimeout'], 600000)}
                            onChange={(value) => updateConfig(['database', 'waitTimeout'], value)}
                            min={0}
                            helpText="The number of milliseconds the server waits for activity on a connection"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="database-maxLifetime"
                            label="Max Lifetime (ms)"
                            value={getConfigValue(['database', 'maxLifetime'], 1800000)}
                            onChange={(value) => updateConfig(['database', 'maxLifetime'], value)}
                            min={0}
                            helpText="The maximum lifetime of a connection in the pool"
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Default Values Section */}
              <Tab.Pane eventKey="default-values">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Default Island Values"
                        description="Configure the default values for new islands"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="default-island-size"
                            label="Default Island Size"
                            value={getConfigValue(['default-values', 'island-size'], 20)}
                            onChange={(value) => updateConfig(['default-values', 'island-size'], value)}
                            min={10}
                            helpText="The default size of all islands"
                            required
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="default-team-limit"
                            label="Team Limit"
                            value={getConfigValue(['default-values', 'team-limit'], 4)}
                            onChange={(value) => updateConfig(['default-values', 'team-limit'], value)}
                            min={1}
                            helpText="Default team limit of islands"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="default-warps-limit"
                            label="Warps Limit"
                            value={getConfigValue(['default-values', 'warps-limit'], 3)}
                            onChange={(value) => updateConfig(['default-values', 'warps-limit'], value)}
                            min={0}
                            helpText="The amount of warps an island can have"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="default-coop-limit"
                            label="Coop Limit"
                            value={getConfigValue(['default-values', 'coop-limit'], 8)}
                            onChange={(value) => updateConfig(['default-values', 'coop-limit'], value)}
                            min={0}
                            helpText="Default coop limit of islands"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="default-crop-growth"
                            label="Crop Growth Multiplier"
                            value={getConfigValue(['default-values', 'crop-growth'], 1)}
                            onChange={(value) => updateConfig(['default-values', 'crop-growth'], value)}
                            min={0}
                            step={0.1}
                            helpText="Default crop-growth multiplier of islands"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="default-spawner-rates"
                            label="Spawner Rates Multiplier"
                            value={getConfigValue(['default-values', 'spawner-rates'], 1)}
                            onChange={(value) => updateConfig(['default-values', 'spawner-rates'], value)}
                            min={0}
                            step={0.1}
                            helpText="Default spawner-rates multiplier of islands"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <NumberInput
                            id="default-mob-drops"
                            label="Mob Drops Multiplier"
                            value={getConfigValue(['default-values', 'mob-drops'], 1)}
                            onChange={(value) => updateConfig(['default-values', 'mob-drops'], value)}
                            min={0}
                            step={0.1}
                            helpText="Default mob-drops multiplier of islands"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <NumberInput
                            id="default-bank-limit"
                            label="Bank Limit"
                            value={getConfigValue(['default-values', 'bank-limit'], -1)}
                            onChange={(value) => updateConfig(['default-values', 'bank-limit'], value)}
                            helpText="Default bank limit of islands (-1 for no limit)"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Block and Entity Limits"
                        description="Configure default limits for blocks and entities"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Header>Block Limits</Card.Header>
                            <Card.Body>
                              {/* Dynamic block limits editor */}
                              {Object.entries(getConfigValue(['default-values', 'block-limits'], {} as Record<string, number>)).map(([block, limit]) => (
                                <div key={block} className="mb-2 d-flex align-items-center">
                                  <span className="me-2">{block}:</span>
                                  <input
                                    type="number"
                                    value={limit}
                                    onChange={(e) => updateNestedKeyValue(['default-values', 'block-limits'], block, parseInt(e.target.value))}
                                    className="form-control me-2"
                                    min={0}
                                  />
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => deleteNestedKeyValue(['default-values', 'block-limits'], block)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              ))}
                              
                              {/* Add new block limit */}
                              <div className="d-flex mt-3">
                                <input
                                  id="new-block-type"
                                  placeholder="Block type (e.g., HOPPER)"
                                  className="form-control me-2"
                                />
                                <input
                                  id="new-block-limit"
                                  type="number"
                                  placeholder="Limit"
                                  className="form-control me-2"
                                  min={0}
                                />
                                <Button 
                                  variant="primary"
                                  onClick={() => {
                                    const blockType = (document.getElementById('new-block-type') as HTMLInputElement).value;
                                    const limit = parseInt((document.getElementById('new-block-limit') as HTMLInputElement).value);
                                    if (blockType && !isNaN(limit)) {
                                      updateNestedKeyValue(['default-values', 'block-limits'], blockType, limit);
                                      (document.getElementById('new-block-type') as HTMLInputElement).value = '';
                                      (document.getElementById('new-block-limit') as HTMLInputElement).value = '';
                                    }
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Header>Entity Limits</Card.Header>
                            <Card.Body>
                              {/* Dynamic entity limits editor */}
                              {Object.entries(getConfigValue(['default-values', 'entity-limits'], {} as Record<string, number>)).map(([entity, limit]) => (
                                <div key={entity} className="mb-2 d-flex align-items-center">
                                  <span className="me-2">{entity}:</span>
                                  <input
                                    type="number"
                                    value={limit}
                                    onChange={(e) => updateNestedKeyValue(['default-values', 'entity-limits'], entity, parseInt(e.target.value))}
                                    className="form-control me-2"
                                    min={0}
                                  />
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => deleteNestedKeyValue(['default-values', 'entity-limits'], entity)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              ))}
                              
                              {/* Add new entity limit */}
                              <div className="d-flex mt-3">
                                <input
                                  id="new-entity-type"
                                  placeholder="Entity type (e.g., MINECART)"
                                  className="form-control me-2"
                                />
                                <input
                                  id="new-entity-limit"
                                  type="number"
                                  placeholder="Limit"
                                  className="form-control me-2"
                                  min={0}
                                />
                                <Button 
                                  variant="primary"
                                  onClick={() => {
                                    const entityType = (document.getElementById('new-entity-type') as HTMLInputElement).value;
                                    const limit = parseInt((document.getElementById('new-entity-limit') as HTMLInputElement).value);
                                    if (entityType && !isNaN(limit)) {
                                      updateNestedKeyValue(['default-values', 'entity-limits'], entityType, limit);
                                      (document.getElementById('new-entity-type') as HTMLInputElement).value = '';
                                      (document.getElementById('new-entity-limit') as HTMLInputElement).value = '';
                                    }
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Generator Settings"
                        description="Configure default generator percentages for new islands"
                      />
                      
                      <Row>
                        <Col>
                          <Card className="mb-3">
                            <Card.Header>Normal Generator</Card.Header>
                            <Card.Body>
                              {/* Dynamic generator settings editor */}
                              {Object.entries(getConfigValue(['default-values', 'generator', 'normal'], {} as Record<string, number>)).map(([block, percentage]) => (
                                <div key={block} className="mb-2 d-flex align-items-center">
                                  <span className="me-2">{block}:</span>
                                  <input
                                    type="number"
                                    value={percentage}
                                    onChange={(e) => updateNestedKeyValue(['default-values', 'generator', 'normal'], block, parseInt(e.target.value))}
                                    className="form-control me-2"
                                    min={0}
                                    max={100}
                                  />
                                  <span className="me-2">%</span>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => deleteNestedKeyValue(['default-values', 'generator', 'normal'], block)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              ))}
                              
                              {/* Add new generator block */}
                              <div className="d-flex mt-3">
                                <input
                                  id="new-generator-block"
                                  placeholder="Block type (e.g., COBBLESTONE)"
                                  className="form-control me-2"
                                />
                                <input
                                  id="new-generator-percentage"
                                  type="number"
                                  placeholder="Percentage"
                                  className="form-control me-2"
                                  min={0}
                                  max={100}
                                />
                                <span className="me-2">%</span>
                                <Button 
                                  variant="primary"
                                  onClick={() => {
                                    const blockType = (document.getElementById('new-generator-block') as HTMLInputElement).value;
                                    const percentage = parseInt((document.getElementById('new-generator-percentage') as HTMLInputElement).value);
                                    if (blockType && !isNaN(percentage)) {
                                      updateNestedKeyValue(['default-values', 'generator', 'normal'], blockType, percentage);
                                      (document.getElementById('new-generator-block') as HTMLInputElement).value = '';
                                      (document.getElementById('new-generator-percentage') as HTMLInputElement).value = '';
                                    }
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Island Roles Section */}
              <Tab.Pane eventKey="island-roles">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Island Roles Configuration"
                        description="Configure the roles and permissions for islands"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Header>Guest Role</Card.Header>
                            <Card.Body>
                              <TextInput
                                id="guest-role-name"
                                label="Role Name"
                                value={getConfigValue(['island-roles', 'guest', 'name'], 'Guest')}
                                onChange={(value) => updateConfig(['island-roles', 'guest', 'name'], value)}
                                helpText="Display name for the guest role"
                              />
                              
                              <StringListEditor
                                id="guest-permissions"
                                label="Permissions"
                                values={getConfigValue(['island-roles', 'guest', 'permissions'], [])}
                                onChange={(values) => updateConfig(['island-roles', 'guest', 'permissions'], values)}
                                helpText="Permissions for guests (non-members)"
                                placeholder="Add permission..."
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Header>Coop Role</Card.Header>
                            <Card.Body>
                              <TextInput
                                id="coop-role-name"
                                label="Role Name"
                                value={getConfigValue(['island-roles', 'coop', 'name'], 'Coop')}
                                onChange={(value) => updateConfig(['island-roles', 'coop', 'name'], value)}
                                helpText="Display name for the coop role"
                              />
                              
                              <StringListEditor
                                id="coop-permissions"
                                label="Permissions"
                                values={getConfigValue(['island-roles', 'coop', 'permissions'], [
                                  'BREAK', 'BUILD', 'INTERACT', 'PICKUP_DROPS'
                                ])}
                                onChange={(values) => updateConfig(['island-roles', 'coop', 'permissions'], values)}
                                helpText="Permissions for coop members"
                                placeholder="Add permission..."
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Member Roles Ladder"
                        description="Configure the hierarchical roles for island members"
                      />
                      
                      {/* This would be more complex to implement fully in this demo */}
                      <p className="alert alert-info">
                        The full role ladder editor is complex and would require more advanced components.
                        In a complete implementation, this would allow editing the Member, Moderator, Admin, and Leader roles with their permissions.
                      </p>
                      
                      {/* Simplified version */}
                      <Card className="mb-3">
                        <Card.Header>Role Ladder Preview</Card.Header>
                        <Card.Body>
                          <ul className="list-group">
                            {Object.entries(getConfigValue(['island-roles', 'ladder'], {} as Record<string, Record<string, unknown>>)).map(([roleKey, role]) => (
                              <li key={roleKey} className="list-group-item">
                                <strong>{role.name as string}</strong> (Weight: {role.weight as number})
                                <div>
                                  <small>ID: {role.id as number}</small>
                                </div>
                                <div>
                                  <small>Permissions: {Array.isArray(role.permissions) ? role.permissions.length : 0} defined</small>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Island Worlds Section */}
              <Tab.Pane eventKey="island-worlds">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Island Worlds Configuration"
                        description="Configure the island worlds settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <SelectInput
                            id="default-world"
                            label="Default World"
                            value={getConfigValue(['worlds', 'default-world'], 'normal')}
                            options={[
                              { value: 'normal', label: 'Normal' },
                              { value: 'nether', label: 'Nether' },
                              { value: 'the_end', label: 'The End' }
                            ]}
                            onChange={(value) => updateConfig(['worlds', 'default-world'], value)}
                            helpText="The default world that will be used"
                            required
                          />
                        </Col>
                        
                        <Col md={6}>
                          <TextInput
                            id="world-name"
                            label="World Name"
                            value={getConfigValue(['worlds', 'world-name'], 'SuperiorWorld')}
                            onChange={(value) => updateConfig(['worlds', 'world-name'], value)}
                            helpText="The name of the islands world"
                            required
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Normal World"
                        description="Configure the normal world settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="normal-enabled"
                            label="Enable Normal World"
                            value={getConfigValue(['worlds', 'normal', 'enabled'], true)}
                            onChange={(value) => updateConfig(['worlds', 'normal', 'enabled'], value)}
                            helpText="Should the normal world be enabled?"
                          />
                          
                          <BooleanToggle
                            id="normal-unlock"
                            label="Unlock By Default"
                            value={getConfigValue(['worlds', 'normal', 'unlock'], true)}
                            onChange={(value) => updateConfig(['worlds', 'normal', 'unlock'], value)}
                            helpText="Should the normal world be unlocked by default to islands?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="normal-schematic-offset"
                            label="Schematic Offset"
                            value={getConfigValue(['worlds', 'normal', 'schematic-offset'], true)}
                            onChange={(value) => updateConfig(['worlds', 'normal', 'schematic-offset'], value)}
                            helpText="Should schematics in this world not be counted towards worth and level values?"
                          />
                          
                          <TextInput
                            id="normal-biome"
                            label="Default Biome"
                            value={getConfigValue(['worlds', 'normal', 'biome'], 'PLAINS')}
                            onChange={(value) => updateConfig(['worlds', 'normal', 'biome'], value)}
                            helpText="The default biome for the world (PLAINS if invalid)"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Nether World"
                        description="Configure the nether world settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="nether-enabled"
                            label="Enable Nether World"
                            value={getConfigValue(['worlds', 'nether', 'enabled'], false)}
                            onChange={(value) => updateConfig(['worlds', 'nether', 'enabled'], value)}
                            helpText="Should the nether world be enabled?"
                          />
                          
                          <BooleanToggle
                            id="nether-unlock"
                            label="Unlock By Default"
                            value={getConfigValue(['worlds', 'nether', 'unlock'], true)}
                            onChange={(value) => updateConfig(['worlds', 'nether', 'unlock'], value)}
                            helpText="Should the nether be unlocked by default to islands?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <TextInput
                            id="nether-name"
                            label="Nether World Name"
                            value={getConfigValue(['worlds', 'nether', 'name'], '')}
                            onChange={(value) => updateConfig(['worlds', 'nether', 'name'], value)}
                            helpText="Custom name for the nether (empty for <island-world>_nether)"
                          />
                          
                          <BooleanToggle
                            id="nether-schematic-offset"
                            label="Schematic Offset"
                            value={getConfigValue(['worlds', 'nether', 'schematic-offset'], true)}
                            onChange={(value) => updateConfig(['worlds', 'nether', 'schematic-offset'], value)}
                            helpText="Should schematics in this world not be counted towards worth and level values?"
                          />
                          
                          <TextInput
                            id="nether-biome"
                            label="Default Biome"
                            value={getConfigValue(['worlds', 'nether', 'biome'], 'NETHER_WASTES')}
                            onChange={(value) => updateConfig(['worlds', 'nether', 'biome'], value)}
                            helpText="The default biome for the nether world"
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="End World"
                        description="Configure the end world settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="end-enabled"
                            label="Enable End World"
                            value={getConfigValue(['worlds', 'end', 'enabled'], false)}
                            onChange={(value) => updateConfig(['worlds', 'end', 'enabled'], value)}
                            helpText="Should the end world be enabled?"
                          />
                          
                          <BooleanToggle
                            id="end-unlock"
                            label="Unlock By Default"
                            value={getConfigValue(['worlds', 'end', 'unlock'], false)}
                            onChange={(value) => updateConfig(['worlds', 'end', 'unlock'], value)}
                            helpText="Should the end be unlocked by default to islands?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <TextInput
                            id="end-name"
                            label="End World Name"
                            value={getConfigValue(['worlds', 'end', 'name'], '')}
                            onChange={(value) => updateConfig(['worlds', 'end', 'name'], value)}
                            helpText="Custom name for the end (empty for <island-world>_the_end)"
                          />
                          
                          <BooleanToggle
                            id="end-schematic-offset"
                            label="Schematic Offset"
                            value={getConfigValue(['worlds', 'end', 'schematic-offset'], true)}
                            onChange={(value) => updateConfig(['worlds', 'end', 'schematic-offset'], value)}
                            helpText="Should schematics in this world not be counted towards worth and level values?"
                          />
                          
                          <TextInput
                            id="end-biome"
                            label="Default Biome"
                            value={getConfigValue(['worlds', 'end', 'biome'], 'THE_END')}
                            onChange={(value) => updateConfig(['worlds', 'end', 'biome'], value)}
                            helpText="The default biome for the end world"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Card className="mb-3">
                            <Card.Header>Dragon Fight Settings</Card.Header>
                            <Card.Body>
                              <BooleanToggle
                                id="dragon-fight-enabled"
                                label="Enable Dragon Fights"
                                value={getConfigValue(['worlds', 'end', 'dragon-fight', 'enabled'], false)}
                                onChange={(value) => updateConfig(['worlds', 'end', 'dragon-fight', 'enabled'], value)}
                                helpText="Whether dragon fights should be enabled"
                              />
                              
                              <TextInput
                                id="dragon-fight-portal-offset"
                                label="Portal Offset"
                                value={getConfigValue(['worlds', 'end', 'dragon-fight', 'portal-offset'], '0, 0, 0')}
                                onChange={(value) => updateConfig(['worlds', 'end', 'dragon-fight', 'portal-offset'], value)}
                                helpText="The offset of the end portal from the middle of the island (x, y, z)"
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <SelectInput
                            id="worlds-difficulty"
                            label="Worlds Difficulty"
                            value={getConfigValue(['worlds', 'difficulty'], 'EASY')}
                            options={[
                              { value: 'PEACEFUL', label: 'Peaceful' },
                              { value: 'EASY', label: 'Easy' },
                              { value: 'NORMAL', label: 'Normal' },
                              { value: 'HARD', label: 'Hard' }
                            ]}
                            onChange={(value) => updateConfig(['worlds', 'difficulty'], value)}
                            helpText="The difficulty of the island worlds"
                            required
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Spawn Settings Section */}
              <Tab.Pane eventKey="spawn">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Spawn Island Configuration"
                        description="Configure the spawn island settings"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="spawn-location"
                            label="Spawn Location"
                            value={getConfigValue(['spawn', 'location'], 'SuperiorWorld, 0, 100, 0, 0, 0')}
                            onChange={(value) => updateConfig(['spawn', 'location'], value)}
                            helpText="The location of the spawn island (world, x, y, z, yaw, pitch)"
                            required
                          />
                          
                          <BooleanToggle
                            id="spawn-protection"
                            label="Spawn Protection"
                            value={getConfigValue(['spawn', 'protection'], true)}
                            onChange={(value) => updateConfig(['spawn', 'protection'], value)}
                            helpText="Should the spawn be protected?"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="spawn-world-border"
                            label="World Border"
                            value={getConfigValue(['spawn', 'world-border'], false)}
                            onChange={(value) => updateConfig(['spawn', 'world-border'], value)}
                            helpText="Should a world border be displayed in the spawn?"
                          />
                          
                          <NumberInput
                            id="spawn-size"
                            label="Spawn Size"
                            value={getConfigValue(['spawn', 'size'], 200)}
                            onChange={(value) => updateConfig(['spawn', 'size'], value)}
                            min={50}
                            helpText="The radius of the spawn island"
                            required
                          />
                          
                          <BooleanToggle
                            id="spawn-players-damage"
                            label="Players Damage"
                            value={getConfigValue(['spawn', 'players-damage'], false)}
                            onChange={(value) => updateConfig(['spawn', 'players-damage'], value)}
                            helpText="Should players get damage in the spawn?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="spawn-settings"
                            label="Spawn Settings"
                            values={getConfigValue(['spawn', 'settings'], [
                              'CROPS_GROWTH', 'LAVA_FLOW', 'WATER_FLOW', 'TREE_GROWTH'
                            ])}
                            onChange={(values) => updateConfig(['spawn', 'settings'], values)}
                            helpText="Settings that will be enabled for the spawn"
                            placeholder="Add setting..."
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="spawn-permissions"
                            label="Spawn Permissions"
                            values={getConfigValue(['spawn', 'permissions'], [])}
                            onChange={(values) => updateConfig(['spawn', 'permissions'], values)}
                            helpText="Permissions for the spawn island"
                            placeholder="Add permission..."
                          />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              {/* Miscellaneous Settings Section */}
              <Tab.Pane eventKey="misc">
                <Card>
                  <Card.Body>
                    <Form>
                      <SectionDivider
                        title="Stacked Blocks"
                        description="Configure settings related to stacked blocks"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="stacked-blocks-enabled"
                            label="Enable Stacked Blocks"
                            value={getConfigValue(['stacked-blocks', 'enabled'], true)}
                            onChange={(value) => updateConfig(['stacked-blocks', 'enabled'], value)}
                            helpText="If you want to globally disable stacked blocks, set this to false"
                          />
                          
                          <TextInput
                            id="stacked-blocks-custom-name"
                            label="Custom Name"
                            value={getConfigValue(['stacked-blocks', 'custom-name'], '&ex{0} {1}')}
                            onChange={(value) => updateConfig(['stacked-blocks', 'custom-name'], value)}
                            helpText="Custom name for the blocks. {0} represents stack size, {1} represents block type"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="stacked-blocks-auto-collect"
                            label="Auto Collect"
                            value={getConfigValue(['stacked-blocks', 'auto-collect'], false)}
                            onChange={(value) => updateConfig(['stacked-blocks', 'auto-collect'], value)}
                            helpText="Should blocks get added directly into the player's inventory?"
                          />
                          
                          <BooleanToggle
                            id="stacked-blocks-deposit-menu-enabled"
                            label="Deposit Menu Enabled"
                            value={getConfigValue(['stacked-blocks', 'deposit-menu', 'enabled'], true)}
                            onChange={(value) => updateConfig(['stacked-blocks', 'deposit-menu', 'enabled'], value)}
                            helpText="Should the menu be opened when shift-clicking stacked blocks?"
                          />
                          
                          <TextInput
                            id="stacked-blocks-deposit-menu-title"
                            label="Deposit Menu Title"
                            value={getConfigValue(['stacked-blocks', 'deposit-menu', 'title'], '&lDeposit Blocks')}
                            onChange={(value) => updateConfig(['stacked-blocks', 'deposit-menu', 'title'], value)}
                            helpText="The title of the deposit menu"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="stacked-blocks-whitelisted"
                            label="Whitelisted Blocks"
                            values={getConfigValue(['stacked-blocks', 'whitelisted'], ['DIAMOND_BLOCK'])}
                            onChange={(values) => updateConfig(['stacked-blocks', 'whitelisted'], values)}
                            helpText="A list of whitelisted blocks that will get stacked when players have stack mode toggled on"
                            placeholder="Add block type..."
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Island Names"
                        description="Configure settings related to island names"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <BooleanToggle
                            id="island-names-required-for-creation"
                            label="Required For Creation"
                            value={getConfigValue(['island-names', 'required-for-creation'], true)}
                            onChange={(value) => updateConfig(['island-names', 'required-for-creation'], value)}
                            helpText="Should creation of islands ask for name (/is create <name>)?"
                          />
                          
                          <NumberInput
                            id="island-names-max-length"
                            label="Maximum Length"
                            value={getConfigValue(['island-names', 'max-length'], 16)}
                            onChange={(value) => updateConfig(['island-names', 'max-length'], value)}
                            min={1}
                            helpText="The maximum length for names"
                          />
                          
                          <NumberInput
                            id="island-names-min-length"
                            label="Minimum Length"
                            value={getConfigValue(['island-names', 'min-length'], 3)}
                            onChange={(value) => updateConfig(['island-names', 'min-length'], value)}
                            min={1}
                            helpText="The minimum length for names"
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="island-names-color-support"
                            label="Color Support"
                            value={getConfigValue(['island-names', 'color-support'], true)}
                            onChange={(value) => updateConfig(['island-names', 'color-support'], value)}
                            helpText="Should names have color support enabled?"
                          />
                          
                          <BooleanToggle
                            id="island-names-island-top"
                            label="Display on Island Top"
                            value={getConfigValue(['island-names', 'island-top'], true)}
                            onChange={(value) => updateConfig(['island-names', 'island-top'], value)}
                            helpText="Should names be displayed on island-top?"
                          />
                          
                          <BooleanToggle
                            id="island-names-prevent-player-names"
                            label="Prevent Player Names"
                            value={getConfigValue(['island-names', 'prevent-player-names'], false)}
                            onChange={(value) => updateConfig(['island-names', 'prevent-player-names'], value)}
                            helpText="Should the plugin prevent players from using player names as island names?"
                          />
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col>
                          <StringListEditor
                            id="island-names-filtered-names"
                            label="Filtered Names"
                            values={getConfigValue(['island-names', 'filtered-names'], ['fuck', 'duck', 'hypixel'])}
                            onChange={(values) => updateConfig(['island-names', 'filtered-names'], values)}
                            helpText="A list of names that will be blacklisted"
                            placeholder="Add filtered name..."
                          />
                        </Col>
                      </Row>
                      
                      <SectionDivider
                        title="Miscellaneous Settings"
                        description="Additional configuration options for SuperiorSkyblock"
                      />
                      
                      <Row>
                        <Col md={6}>
                          <TextInput
                            id="island-level-formula"
                            label="Island Level Formula"
                            value={getConfigValue(['island-level-formula'], '{} / 2')}
                            onChange={(value) => updateConfig(['island-level-formula'], value)}
                            helpText="Formula to calculate the island level by it's worth. Use {} as a placeholder for worth."
                            required
                          />
                          
                          <BooleanToggle
                            id="rounded-island-level"
                            label="Rounded Island Level"
                            value={getConfigValue(['rounded-island-level'], false)}
                            onChange={(value) => updateConfig(['rounded-island-level'], value)}
                            helpText="Should the island levels be a rounded integer?"
                          />
                          
                          <TextInput
                            id="island-top-order"
                            label="Island Top Order"
                            value={getConfigValue(['island-top-order'], 'WORTH')}
                            onChange={(value) => updateConfig(['island-top-order'], value)}
                            helpText="How should the island top be ordered by default? Use WORTH, LEVEL, RATING or PLAYERS."
                            required
                          />
                        </Col>
                        
                        <Col md={6}>
                          <BooleanToggle
                            id="disband-inventory-clear"
                            label="Clear Inventory on Disband"
                            value={getConfigValue(['disband-inventory-clear'], true)}
                            onChange={(value) => updateConfig(['disband-inventory-clear'], value)}
                            helpText="Should inventories of island members get cleared after disbanding their island?"
                          />
                          
                          <BooleanToggle
                            id="teleport-on-join"
                            label="Teleport on Join"
                            value={getConfigValue(['teleport-on-join'], false)}
                            onChange={(value) => updateConfig(['teleport-on-join'], value)}
                            helpText="Should players get teleported to the island after they accept an invite?"
                          />
                          
                          <BooleanToggle
                            id="teleport-on-kick"
                            label="Teleport on Kick"
                            value={getConfigValue(['teleport-on-kick'], true)}
                            onChange={(value) => updateConfig(['teleport-on-kick'], value)}
                            helpText="Should players get teleported to spawn when they are kicked from their island?"
                          />
                          
                          <BooleanToggle
                            id="clear-on-join"
                            label="Clear Inventory on Join"
                            value={getConfigValue(['clear-on-join'], false)}
                            onChange={(value) => updateConfig(['clear-on-join'], value)}
                            helpText="Should the inventory of the players get cleared after they accept an invite?"
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

export default SuperiorSkyblockEditor;