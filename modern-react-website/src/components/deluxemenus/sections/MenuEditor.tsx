// src/components/deluxemenus/sections/MenuEditor.tsx
import React, { useState } from 'react';
import { Form, Row, Col, Card, Button, Tabs, Tab, Badge, Tooltip, OverlayTrigger, Alert, Accordion, Modal } from 'react-bootstrap';
import { TextInput, StringListEditor, NumberInput, BooleanToggle, SectionDivider } from '../../wildstacker/FormComponents';

interface MenuEditorProps {
  menuName: string;
  menuConfig: Record<string, unknown>;
  updateMenuConfig: (path: string[], value: unknown) => void;
  downloadMenuYaml?: (menuName: string) => void;
  convertMenuToExternalFile?: (menuName: string) => void;
}

const MenuEditor: React.FC<MenuEditorProps> = ({ 
  menuName, 
  menuConfig, 
  updateMenuConfig,
  downloadMenuYaml,
  convertMenuToExternalFile
}) => {
  const [activeItemId, setActiveItemId] = useState<string>('');
  const [newItemId, setNewItemId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [showItemDeleteConfirm, setShowItemDeleteConfirm] = useState<boolean>(false);
  
  // Get menu size
  const menuSize = (menuConfig['size'] as number) || 27;
  
  // Get all menu items
  const items = (menuConfig['items'] as Record<string, unknown>) || {};
  
  // Function to handle item click in the grid
  const handleSlotClick = (slotNumber: number) => {
    // Find item in this slot
    let foundItem = '';
    Object.entries(items).forEach(([itemId, itemData]) => {
      if (typeof itemData === 'object' && itemData !== null) {
        const itemDataObj = itemData as Record<string, unknown>;
        const itemSlot = itemDataObj['slot'];
        const itemSlots = itemDataObj['slots'];
        
        if (itemSlot === slotNumber || (Array.isArray(itemSlots) && itemSlots.includes(slotNumber))) {
          foundItem = itemId;
        }
      }
    });
    
    if (foundItem) {
      setActiveItemId(foundItem);
      setActiveTab('items');
    } else {
      // Create new item in this slot
      const defaultItemId = `item_${slotNumber}`;
      setNewItemId(defaultItemId);
      setShowNewItemModal(true);
      setNewItemSlot(slotNumber);
    }
  };
  
  // State for new item modal
  const [showNewItemModal, setShowNewItemModal] = useState<boolean>(false);
  const [newItemSlot, setNewItemSlot] = useState<number>(0);
  const [newItemError, setNewItemError] = useState<string>('');
  
  // Function to add new item
  const addNewItem = () => {
    if (newItemId.trim() === '') {
      setNewItemError('Please enter an item ID');
      return;
    }
    
    // Check if item ID already exists
    if (items[newItemId]) {
      setNewItemError('Item ID already exists');
      return;
    }
    
    // Add new item
    updateMenuConfig(['items', newItemId], {
      material: 'STONE',
      slot: newItemSlot,
      display_name: '&fNew Item'
    });
    
    setActiveItemId(newItemId);
    setNewItemId('');
    setNewItemError('');
    setShowNewItemModal(false);
    setActiveTab('items');
  };
  
  // Get current active item
  const activeItem = activeItemId ? (items[activeItemId] as Record<string, unknown>) : null;
  
  // Calculate the number of rows needed
  const rows = Math.ceil(menuSize / 9);
  
  // Get material icon
  const getMaterialIcon = (material: string) => {
    const materialLower = material?.toLowerCase() || '';
    
    if (materialLower.includes('sword')) return 'bi-slash-lg';
    if (materialLower.includes('axe')) return 'bi-tree';
    if (materialLower.includes('pickaxe')) return 'bi-gem';
    if (materialLower.includes('shovel')) return 'bi-snow';
    if (materialLower.includes('hoe')) return 'bi-flower1';
    if (materialLower.includes('bow')) return 'bi-bullseye';
    if (materialLower.includes('arrow')) return 'bi-arrow-up-right';
    if (materialLower.includes('helmet') || materialLower.includes('cap')) return 'bi-person';
    if (materialLower.includes('chestplate') || materialLower.includes('tunic')) return 'bi-shield';
    if (materialLower.includes('leggings')) return 'bi-person-standing';
    if (materialLower.includes('boots')) return 'bi-boot';
    if (materialLower.includes('apple')) return 'bi-apple';
    if (materialLower.includes('bread')) return 'bi-bread-slice';
    if (materialLower.includes('fish') || materialLower.includes('cod') || materialLower.includes('salmon')) return 'bi-fish';
    if (materialLower.includes('potion')) return 'bi-droplet';
    if (materialLower.includes('book')) return 'bi-book';
    if (materialLower.includes('paper')) return 'bi-file-earmark';
    if (materialLower.includes('map')) return 'bi-map';
    if (materialLower.includes('compass')) return 'bi-compass';
    if (materialLower.includes('clock')) return 'bi-clock';
    if (materialLower.includes('head') || materialLower.includes('skull')) return 'bi-person-circle';
    
    // Default icon
    return 'bi-box';
  };
  
  // Function to get color from color code
  const getColorFromCode = (colorCode: string) => {
    const colorMap: Record<string, string> = {
      '0': '#000000', // Black
      '1': '#0000AA', // Dark Blue
      '2': '#00AA00', // Dark Green
      '3': '#00AAAA', // Dark Aqua
      '4': '#AA0000', // Dark Red
      '5': '#AA00AA', // Dark Purple
      '6': '#FFAA00', // Gold
      '7': '#AAAAAA', // Gray
      '8': '#555555', // Dark Gray
      '9': '#5555FF', // Blue
      'a': '#55FF55', // Green
      'b': '#55FFFF', // Aqua
      'c': '#FF5555', // Red
      'd': '#FF55FF', // Light Purple
      'e': '#FFFF55', // Yellow
      'f': '#FFFFFF', // White
    };
    
    if (colorCode && colorCode.length > 1 && colorCode.charAt(0) === '&') {
      const code = colorCode.charAt(1).toLowerCase();
      return colorMap[code] || null;
    }
    
    return null;
  };
  
  // Function to get display name preview
  const getDisplayNamePreview = (displayName: string) => {
    if (!displayName) return 'Unnamed Item';
    
    // Remove color codes for display
    return displayName.replace(/&[0-9a-fA-F]/g, '');
  };
  
  // Function to get color style for display name
  const getDisplayNameStyle = (displayName: string) => {
    if (!displayName) return {};
    
    // Get first color code
    const colorMatch = displayName.match(/&([0-9a-fA-F])/);
    if (colorMatch && colorMatch[1]) {
      const color = getColorFromCode(`&${colorMatch[1]}`);
      if (color) {
        return { color };
      }
    }
    
    return {};
  };

  return (
    <div>
      <div className="editor-header mb-4 d-flex justify-content-between align-items-center">
        <h3>
          Editing Menu: <span className="text-primary">{menuName}</span>
        </h3>
        <div className="menu-actions">
          {downloadMenuYaml && (
            <Button 
              variant="outline-primary" 
              className="me-2"
              onClick={() => downloadMenuYaml(menuName)}
              title="Download this menu as a standalone YAML file"
            >
              <i className="bi bi-download me-1"></i>
              Export Menu
            </Button>
          )}
          {convertMenuToExternalFile && (
            <Button 
              variant="outline-success"
              onClick={() => convertMenuToExternalFile(menuName)}
              title="Convert this menu to an external file reference in the main config"
            >
              <i className="bi bi-box-arrow-up-right me-1"></i>
              Export & Reference
            </Button>
          )}
        </div>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onSelect={(k) => k && setActiveTab(k)} 
        id="menu-editor-tabs" 
        className="mb-4"
      >
        <Tab eventKey="general" title={<><i className="bi bi-gear me-2"></i>General Settings</>}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <TextInput
                    id="menu-title"
                    label="Menu Title"
                    value={(menuConfig['menu_title'] as string) || ''}
                    onChange={(value) => updateMenuConfig(['menu_title'], value)}
                    helpText="The title shown at the top of the menu (supports color codes)"
                    required
                  />
                </Col>
                
                <Col md={6}>
                  <NumberInput
                    id="menu-size"
                    label="Menu Size"
                    value={(menuConfig['size'] as number) || 27}
                    onChange={(value) => updateMenuConfig(['size'], value)}
                    min={9}
                    max={54}
                    step={9}
                    helpText="Size of the menu (must be 9, 18, 27, 36, 45, or 54)"
                    required
                  />
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <TextInput
                    id="open-command"
                    label="Open Command"
                    value={(menuConfig['open_command'] as string) || ''}
                    onChange={(value) => updateMenuConfig(['open_command'], value)}
                    helpText="Command(s) to open this menu (comma-separated for multiple)"
                  />
                </Col>
                
                <Col md={6}>
                  <BooleanToggle
                    id="register-command"
                    label="Register Command"
                    value={(menuConfig['register_command'] as boolean) || false}
                    onChange={(value) => updateMenuConfig(['register_command'], value)}
                    helpText="Whether to register the command automatically"
                  />
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <NumberInput
                    id="update-interval"
                    label="Update Interval (seconds)"
                    value={(menuConfig['update_interval'] as number) || 1}
                    onChange={(value) => updateMenuConfig(['update_interval'], value)}
                    min={1}
                    helpText="How often to update placeholders in the menu"
                  />
                </Col>
              </Row>
              
              <SectionDivider
                title="Menu Commands"
                description="Commands to execute when menu is opened"
              />
              
              <Row>
                <Col>
                  <StringListEditor
                    id="open-commands"
                    label="Open Commands"
                    values={((menuConfig['open_commands'] as string[]) || [])}
                    onChange={(values) => updateMenuConfig(['open_commands'], values)}
                    helpText="Commands to execute when the menu is opened"
                    placeholder="Add command..."
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="items" title={<><i className="bi bi-grid-3x3 me-2"></i>Menu Items</>}>
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Menu Layout</span>
                  <Badge bg="info">Size: {menuSize}</Badge>
                </Card.Header>
                <Card.Body>
                  <Alert variant="info" className="mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    Click on a slot to edit an existing item or create a new one.
                  </Alert>
                  
                  {[...Array(rows)].map((_, rowIndex) => (
                    <div key={rowIndex} className="menu-grid">
                      {[...Array(9)].map((_, colIndex) => {
                        const slotNumber = rowIndex * 9 + colIndex;
                        
                        // Find if there's an item in this slot
                        let slotItem = null;
                        let slotItemId = '';
                        
                        Object.entries(items).forEach(([itemId, itemData]) => {
                          if (typeof itemData === 'object' && itemData !== null) {
                            const itemDataObj = itemData as Record<string, unknown>;
                            const itemSlot = itemDataObj['slot'];
                            const itemSlots = itemDataObj['slots'];
                            
                            if (itemSlot === slotNumber || (Array.isArray(itemSlots) && itemSlots.includes(slotNumber))) {
                              slotItem = itemDataObj;
                              slotItemId = itemId;
                            }
                          }
                        });
                        
                        return (
                          <OverlayTrigger
                            key={colIndex}
                            placement="top"
                            overlay={
                              <Tooltip>
                                {slotItem 
                                  ? `${slotItemId}: ${getDisplayNamePreview(slotItem['display_name'] as string)}`
                                  : `Empty Slot (${slotNumber})`
                                }
                              </Tooltip>
                            }
                          >
                            <div 
                              className={`menu-slot ${activeItemId === slotItemId ? 'active' : ''}`}
                              onClick={() => handleSlotClick(slotNumber)}
                            >
                              <div className="menu-slot-number">{slotNumber}</div>
                              {slotItem ? (
                                <div className="menu-slot-content">
                                  <div className="menu-slot-icon">
                                    <i className={`bi ${getMaterialIcon(slotItem['material'] as string)}`}></i>
                                  </div>
                                  <div style={getDisplayNameStyle(slotItem['display_name'] as string)}>
                                    {getDisplayNamePreview(slotItem['display_name'] as string)}
                                  </div>
                                </div>
                              ) : (
                                <div className="menu-slot-content text-muted">
                                  <i className="bi bi-plus"></i>
                                </div>
                              )}
                            </div>
                          </OverlayTrigger>
                        );
                      })}
                    </div>
                  ))}
                </Card.Body>
              </Card>
              
              <Card>
                <Card.Header>Add New Item</Card.Header>
                <Card.Body>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Item ID"
                      value={newItemId}
                      onChange={(e) => setNewItemId(e.target.value)}
                      className="me-2"
                    />
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setNewItemSlot(0);
                        setShowNewItemModal(true);
                      }}
                    >
                      <i className="bi bi-plus"></i> Add Item
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={4}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  {activeItemId ? (
                    <>
                      <span>Edit Item: <Badge bg="primary">{activeItemId}</Badge></span>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => setShowItemDeleteConfirm(true)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </>
                  ) : (
                    'Item Properties'
                  )}
                </Card.Header>
                <Card.Body>
                  {activeItem ? (
                    <Form>
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Basic Properties</Accordion.Header>
                          <Accordion.Body>
                            <TextInput
                              id="item-material"
                              label="Material"
                              value={(activeItem['material'] as string) || 'STONE'}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'material'], value)}
                              helpText="Material type (e.g., DIAMOND, STONE)"
                              required
                            />
                            
                            <NumberInput
                              id="item-slot"
                              label="Slot"
                              value={(activeItem['slot'] as number) || 0}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'slot'], value)}
                              min={0}
                              max={menuSize - 1}
                              helpText={`Slot number (0-${menuSize - 1})`}
                              required
                            />
                            
                            <NumberInput
                              id="item-amount"
                              label="Amount"
                              value={(activeItem['amount'] as number) || 1}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'amount'], value)}
                              min={1}
                              max={64}
                              helpText="Item stack size"
                            />
                          </Accordion.Body>
                        </Accordion.Item>
                        
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Display Settings</Accordion.Header>
                          <Accordion.Body>
                            <TextInput
                              id="item-display-name"
                              label="Display Name"
                              value={(activeItem['display_name'] as string) || ''}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'display_name'], value)}
                              helpText="Item name (supports color codes)"
                            />
                            
                            <StringListEditor
                              id="item-lore"
                              label="Lore"
                              values={((activeItem['lore'] as string[]) || [])}
                              onChange={(values) => updateMenuConfig(['items', activeItemId, 'lore'], values)}
                              helpText="Item lore (supports color codes)"
                              placeholder="Add lore line..."
                            />
                          </Accordion.Body>
                        </Accordion.Item>
                        
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>Advanced Settings</Accordion.Header>
                          <Accordion.Body>
                            <NumberInput
                              id="item-priority"
                              label="Priority"
                              value={(activeItem['priority'] as number) || 0}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'priority'], value)}
                              min={0}
                              helpText="Item priority (lower number = higher priority)"
                            />
                            
                            <BooleanToggle
                              id="item-update"
                              label="Update Placeholders"
                              value={(activeItem['update'] as boolean) || false}
                              onChange={(value) => updateMenuConfig(['items', activeItemId, 'update'], value)}
                              helpText="Should placeholders be updated based on the interval?"
                            />
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                      
                      <Card className="mt-3">
                        <Card.Header>Click Commands</Card.Header>
                        <Card.Body>
                          <StringListEditor
                            id="left-click-commands"
                            label="Left Click Commands"
                            values={((activeItem['left_click_commands'] as string[]) || [])}
                            onChange={(values) => updateMenuConfig(['items', activeItemId, 'left_click_commands'], values)}
                            helpText="Commands when left-clicking"
                            placeholder="Add command..."
                          />
                          
                          <StringListEditor
                            id="right-click-commands"
                            label="Right Click Commands"
                            values={((activeItem['right_click_commands'] as string[]) || [])}
                            onChange={(values) => updateMenuConfig(['items', activeItemId, 'right_click_commands'], values)}
                            helpText="Commands when right-clicking"
                            placeholder="Add command..."
                          />
                        </Card.Body>
                      </Card>
                      
                      {/* Item Delete Confirmation */}
                      {showItemDeleteConfirm && (
                        <Alert variant="danger" className="mt-3">
                          <p>Are you sure you want to delete this item?</p>
                          <div className="d-flex justify-content-end">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="me-2"
                              onClick={() => setShowItemDeleteConfirm(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => {
                                // Delete item
                                const newItems = { ...items };
                                delete newItems[activeItemId];
                                updateMenuConfig(['items'], newItems);
                                setActiveItemId('');
                                setShowItemDeleteConfirm(false);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </Alert>
                      )}
                    </Form>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-grid-3x3 fs-1 text-muted"></i>
                      <p className="mt-3">Click on a slot to edit its item, or create a new item using the form below.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="requirements" title={<><i className="bi bi-shield-check me-2"></i>Requirements</>}>
          {activeItemId && activeItem ? (
            <Card>
              <Card.Header>Requirements for: {activeItemId}</Card.Header>
              <Card.Body>
                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  Requirements are configured as nested YAML structures. Edit them directly in the YAML preview tab for now.
                </Alert>
                
                <div className="p-3 border rounded mb-3">
                  <h5>Example Requirement</h5>
                  <pre className="p-2 bg-light rounded">
                  {`view_requirement:
  requirements:
    permission:
      type: has permission
      permission: 'deluxemenus.admin'`}
                  </pre>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="warning">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Select an item first to configure its requirements.
            </Alert>
          )}
        </Tab>
      </Tabs>
      
      {/* New Item Modal */}
      <Modal show={showNewItemModal} onHide={() => setShowNewItemModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Item ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item ID"
                value={newItemId}
                onChange={(e) => {
                  setNewItemId(e.target.value);
                  setNewItemError('');
                }}
                isInvalid={!!newItemError}
              />
              <Form.Control.Feedback type="invalid">
                {newItemError}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                This will be used as the identifier for your item.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Slot</Form.Label>
              <Form.Control
                type="number"
                value={newItemSlot}
                onChange={(e) => setNewItemSlot(parseInt(e.target.value))}
                min={0}
                max={menuSize - 1}
              />
              <Form.Text className="text-muted">
                The slot number where this item will be placed.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewItemModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addNewItem}>
            Create Item
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuEditor;
