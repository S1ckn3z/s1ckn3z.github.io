import React, { useState, useEffect } from 'react';
import { Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import './SuperiorSkyblockEditor.css';
import { createYaml, parseYaml } from '../../utils/YamlUtils';

// Import all section components
import GeneralSettings from './sections/GeneralSettings';
import DatabaseSettings from './sections/DatabaseSettings';
import DefaultValuesSettings from './sections/DefaultValuesSettings';
import IslandRolesSettings from './sections/IslandRolesSettings';
import IslandWorldsSettings from './sections/IslandWorldsSettings';
import SpawnSettings from './sections/SpawnSettings';
import SignsWarpsSettings from './sections/SignsWarpsSettings';
import StackedBlocksSettings from './sections/StackedBlocksSettings';
import CommandsCooldownsSettings from './sections/CommandsCooldownsSettings';
import MiscSettings from './sections/MiscSettings';
import YamlPreview from './sections/YamlPreview';

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
                <Nav.Link eventKey="signs-warps">Signs & Warps</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="stacked-blocks">Stacked Blocks</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="commands">Commands & Cooldowns</Nav.Link>
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
              <Tab.Pane eventKey="general">
                <GeneralSettings getConfigValue={getConfigValue} updateConfig={updateConfig} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="database">
                <DatabaseSettings getConfigValue={getConfigValue} updateConfig={updateConfig} />
              </Tab.Pane>
              
              <Tab.Pane eventKey="default-values">
                <DefaultValuesSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                  updateNestedKeyValue={updateNestedKeyValue}
                  deleteNestedKeyValue={deleteNestedKeyValue}
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="island-roles">
                <IslandRolesSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="island-worlds">
                <IslandWorldsSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="spawn">
                <SpawnSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="signs-warps">
                <SignsWarpsSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="stacked-blocks">
                <StackedBlocksSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                  updateNestedKeyValue={updateNestedKeyValue}
                  deleteNestedKeyValue={deleteNestedKeyValue}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="commands">
                <CommandsCooldownsSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                  updateNestedKeyValue={updateNestedKeyValue}
                  deleteNestedKeyValue={deleteNestedKeyValue}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="misc">
                <MiscSettings 
                  getConfigValue={getConfigValue} 
                  updateConfig={updateConfig}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="yaml">
                <YamlPreview yamlContent={yamlContent} formatYaml={formatYaml} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default SuperiorSkyblockEditor;
