// src/components/deluxemenus/DeluxeMenusEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Nav, Tab, Button, Card, Tooltip, OverlayTrigger, Badge, Modal, Form, Alert } from 'react-bootstrap';
import './DeluxeMenusEditor.css';
import { createYaml, parseYaml } from '../../utils/YamlUtils';

// Import all section components
import GeneralSettings from './sections/GeneralSettings';
import MenuSettings from './sections/MenuSettings';
import ItemsSettings from './sections/ItemsSettings';
import CommandsSettings from './sections/CommandsSettings';
import PermissionsSettings from './sections/PermissionsSettings';
import YamlPreview from './sections/YamlPreview';
import MenuEditor from './sections/MenuEditor';

interface DeluxeMenusEditorProps {
  initialYaml: string;
}

// Type for configuration object
type ConfigObject = Record<string, unknown>;

/**
 * A unified editor component for DeluxeMenus configuration
 */
const DeluxeMenusEditor: React.FC<DeluxeMenusEditorProps> = ({ initialYaml }) => {
  // State for the complete configuration
  const [config, setConfig] = useState<ConfigObject>({});
  
  // YAML representation of the current configuration
  const [yamlContent, setYamlContent] = useState<string>(initialYaml);
  
  // Active section for navigation
  const [activeSection, setActiveSection] = useState<string>('general');
  
  // State for current menu being edited
  const [currentMenu, setCurrentMenu] = useState<string>('');
  const [menuConfig, setMenuConfig] = useState<ConfigObject>({});
  
  // State for UI enhancements
  const [showNewMenuModal, setShowNewMenuModal] = useState<boolean>(false);
  const [newMenuName, setNewMenuName] = useState<string>('');
  const [newMenuError, setNewMenuError] = useState<string>('');
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showDeleteMenuModal, setShowDeleteMenuModal] = useState<boolean>(false);
  const [menuToDelete, setMenuToDelete] = useState<string>('');
  
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
  
  // Show success alert for a few seconds
  const showSuccess = useCallback((message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  }, []);
  
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
  
  // Function to download the main YAML file
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
    showSuccess('Configuration downloaded successfully!');
  };

  // Function to download a standalone menu YAML file
  const downloadMenuYaml = (menuName: string): void => {
    const menuConfig = ((config['gui_menus'] || {}) as Record<string, unknown>)[menuName];
    
    if (menuConfig && typeof menuConfig === 'object') {
      try {
        // Generate YAML for just this menu
        const menuYaml = createYaml(menuConfig as Record<string, unknown>, true);
        
        // Download the file
        const blob = new Blob([menuYaml], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${menuName}.yml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSuccess(`Menu "${menuName}" downloaded successfully!`);
      } catch (error) {
        console.error('Error generating menu YAML:', error);
      }
    }
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
            showSuccess(`Imported ${file.name} successfully!`);
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
  
  // Load menu configuration
  const loadMenuConfig = (menuName: string): void => {
    const menuConfig = ((config['gui_menus'] || {}) as Record<string, unknown>)[menuName];
    
    if (menuConfig && typeof menuConfig === 'object') {
      setCurrentMenu(menuName);
      setMenuConfig(menuConfig as ConfigObject);
      setActiveSection('menuEditor');
    } else {
      // Create new menu config
      setCurrentMenu(menuName);
      setMenuConfig({
        menu_title: '&8New Menu',
        open_command: menuName.toLowerCase(),
        size: 27,
        items: {}
      });
      
      // Add to main config
      updateConfig(['gui_menus', menuName], {
        menu_title: '&8New Menu',
        open_command: menuName.toLowerCase(),
        size: 27,
        items: {}
      });
      
      setActiveSection('menuEditor');
      showSuccess(`Created new menu: ${menuName}`);
    }
  };

  // Function to create a reference to an external menu file
  const convertMenuToExternalFile = (menuName: string): void => {
    const menuConfig = ((config['gui_menus'] || {}) as Record<string, unknown>)[menuName];
    
    if (menuConfig && typeof menuConfig === 'object') {
      // First download the standalone menu file
      downloadMenuYaml(menuName);
      
      // Then update the main config to reference the external file
      updateConfig(['gui_menus', menuName], {
        file: `${menuName}.yml`
      });
      
      showSuccess(`Menu "${menuName}" converted to external file reference!`);
    }
  };
  
  // Update menu configuration
  const updateMenuConfig = (path: string[], value: unknown): void => {
    setMenuConfig(prevConfig => {
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
    
    // Update the main config
    updateConfig(['gui_menus', currentMenu, ...path], value);
  };
  
  // Function to format YAML with enhanced syntax highlighting
  const formatYaml = (yaml: string): string => {
    // Enhanced syntax highlighting for YAML
    return yaml
      .replace(/^([\w-]+):/gm, '<span class="yaml-key">$1:</span>')
      .replace(/: (true|false)/g, ': <span class="yaml-boolean">$1</span>')
      .replace(/: (\d+)/g, ': <span class="yaml-number">$1</span>')
      .replace(/: '(.+?)'/g, ': <span class="yaml-string">\'$1\'</span>')
      .replace(/: "(.+?)"/g, ': <span class="yaml-string">"$1"</span>')
      .replace(/^(\s*)(- )/gm, '$1<span class="yaml-list">$2</span>')
      .replace(/^(\s*#.*)$/gm, '<span class="yaml-comment">$1</span>')
      .replace(/(&[0-9a-fA-F])/g, '<span class="yaml-color-code">$1</span>');
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
  
  // Helper function to get menu names
  function getMenuNames(): string[] {
    const guiMenus = config['gui_menus'] as Record<string, unknown> | undefined;
    if (!guiMenus) {
      return [];
    }
    
    return Object.keys(guiMenus);
  }
  
  // Handle new menu creation
  const handleCreateNewMenu = () => {
    if (!newMenuName.trim()) {
      setNewMenuError('Menu name cannot be empty');
      return;
    }
    
    // Check if menu name already exists
    if (getMenuNames().includes(newMenuName)) {
      setNewMenuError('A menu with this name already exists');
      return;
    }
    
    // Create new menu
    loadMenuConfig(newMenuName);
    
    // Reset and close modal
    setNewMenuName('');
    setNewMenuError('');
    setShowNewMenuModal(false);
  };

  // Handle menu deletion
  const handleDeleteMenu = (menuName: string) => {
    setMenuToDelete(menuName);
    setShowDeleteMenuModal(true);
  };

  // Confirm menu deletion
  const confirmDeleteMenu = () => {
    if (menuToDelete) {
      // Create a copy of the current config
      const newConfig = { ...config };
      
      // Get the gui_menus object
      const guiMenus = newConfig['gui_menus'] as Record<string, unknown>;
      
      if (guiMenus && guiMenus[menuToDelete]) {
        // Delete the menu
        delete guiMenus[menuToDelete];
        
        // Update the config
        setConfig(newConfig);
        
        // If the deleted menu was being edited, clear the current menu
        if (currentMenu === menuToDelete) {
          setCurrentMenu('');
          setMenuConfig({});
          setActiveSection('general');
        }
        
        showSuccess(`Menu "${menuToDelete}" deleted successfully!`);
      }
      
      // Reset and close modal
      setMenuToDelete('');
      setShowDeleteMenuModal(false);
    }
  };

  return (
    <div className="unified-editor">
      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert 
          variant="success" 
          className="success-alert"
          onClose={() => setShowSuccessAlert(false)} 
          dismissible
        >
          {successMessage}
        </Alert>
      )}
      
      <Card className="editor-header-card mb-4">
        <Card.Body>
          <div className="editor-header">
            <div>
              <h2>DeluxeMenus Configuration Editor</h2>
              <p className="text-muted">Create and customize your menus in one place</p>
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
        </Card.Body>
      </Card>

      <Tab.Container activeKey={activeSection} onSelect={(k) => setActiveSection(k || 'general')}>
        <Row>
          <Col md={3}>
            <Card className="sidebar-card">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column config-nav">
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Configure global plugin settings</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="general" className="d-flex align-items-center">
                        <i className="bi bi-gear me-2"></i>
                        General Settings
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                  
                  <div className="nav-section-title mt-3 mb-2 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>GUI Menus</strong>
                      <Badge bg="info" pill>{getMenuNames().length}</Badge>
                    </div>
                  </div>
                  
                  <div className="menu-list">
                    {getMenuNames().map(menuName => (
                      <Nav.Item key={menuName}>
                        <div className="d-flex align-items-center menu-item-container">
                          <Nav.Link
                            onClick={() => loadMenuConfig(menuName)}
                            active={activeSection === 'menuEditor' && currentMenu === menuName}
                            className="menu-item flex-grow-1"
                          >
                            <i className="bi bi-grid me-2"></i> {menuName}
                          </Nav.Link>
                          <Button 
                            variant="link" 
                            className="menu-delete-btn text-danger p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMenu(menuName);
                            }}
                            title={`Delete ${menuName}`}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </Nav.Item>
                    ))}
                  </div>
                  
                  <Nav.Item>
                    <Nav.Link 
                      className="text-success add-menu-link"
                      onClick={() => setShowNewMenuModal(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i> Add Menu
                    </Nav.Link>
                  </Nav.Item>
                  
                  <div className="nav-section-title mt-3 mb-2 px-3">
                    <strong>Global Settings</strong>
                  </div>
                  
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Configure global menu settings</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="menuSettings">
                        <i className="bi bi-list-nested me-2"></i>
                        Menu Settings
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Configure global item settings</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="itemsSettings">
                        <i className="bi bi-box me-2"></i>
                        Items Settings
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Configure command settings</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="commandsSettings">
                        <i className="bi bi-terminal me-2"></i>
                        Commands Settings
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Configure permission settings</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="permissionsSettings">
                        <i className="bi bi-shield-lock me-2"></i>
                        Permissions Settings
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>View and copy the generated YAML</Tooltip>}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="yaml" className="yaml-preview-tab mt-3">
                        <i className="bi bi-code-square me-2"></i>
                        YAML Preview
                      </Nav.Link>
                    </Nav.Item>
                  </OverlayTrigger>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          <Col md={9}>
            <Card className="content-card">
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="general">
                    <GeneralSettings 
                      getConfigValue={getConfigValue} 
                      updateConfig={updateConfig} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="menuSettings">
                    <MenuSettings 
                      getConfigValue={getConfigValue} 
                      updateConfig={updateConfig} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="itemsSettings">
                    <ItemsSettings 
                      getConfigValue={getConfigValue} 
                      updateConfig={updateConfig} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="commandsSettings">
                    <CommandsSettings 
                      getConfigValue={getConfigValue} 
                      updateConfig={updateConfig} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="permissionsSettings">
                    <PermissionsSettings 
                      getConfigValue={getConfigValue} 
                      updateConfig={updateConfig} 
                    />
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="menuEditor">
                    {currentMenu && (
                      <MenuEditor 
                        menuName={currentMenu}
                        menuConfig={menuConfig}
                        updateMenuConfig={updateMenuConfig}
                        downloadMenuYaml={downloadMenuYaml}
                        convertMenuToExternalFile={convertMenuToExternalFile}
                      />
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="yaml">
                    <YamlPreview 
                      yamlContent={yamlContent} 
                      formatYaml={formatYaml} 
                      currentMenu={currentMenu}
                      menuConfig={menuConfig}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
      
      {/* New Menu Modal */}
      <Modal show={showNewMenuModal} onHide={() => setShowNewMenuModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Menu Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter menu name"
                value={newMenuName}
                onChange={(e) => {
                  setNewMenuName(e.target.value);
                  setNewMenuError('');
                }}
                isInvalid={!!newMenuError}
              />
              <Form.Control.Feedback type="invalid">
                {newMenuError}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                This will be used as the identifier for your menu.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewMenuModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateNewMenu}>
            Create Menu
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Menu Confirmation Modal */}
      <Modal show={showDeleteMenuModal} onHide={() => setShowDeleteMenuModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the menu <strong>{menuToDelete}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteMenuModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteMenu}>
            Delete Menu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeluxeMenusEditor;
