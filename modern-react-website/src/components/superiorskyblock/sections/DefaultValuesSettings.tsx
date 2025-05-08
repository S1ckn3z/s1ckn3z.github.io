import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { NumberInput, StringListEditor, SectionDivider } from '../../wildstacker/FormComponents';

interface DefaultValuesSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
  updateNestedKeyValue: (path: string[], key: string, value: unknown) => void;
  deleteNestedKeyValue: (path: string[], key: string) => void;
}

const DefaultValuesSettings: React.FC<DefaultValuesSettingsProps> = ({
  getConfigValue,
  updateConfig,
  updateNestedKeyValue,
  deleteNestedKeyValue
}) => {
  return (
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
      
      <SectionDivider
        title="Role Limits"
        description="Configure default role limits for new islands"
      />
      
      <Row>
        <Col>
          <StringListEditor
            id="default-role-limits"
            label="Role Limits"
            values={getConfigValue(['default-values', 'role-limits'], [])}
            onChange={(values) => updateConfig(['default-values', 'role-limits'], values)}
            helpText="Format: '1:5' will set the limit of role with ID 1 (Moderator) to 5"
            placeholder="Add role limit (e.g., 1:5)..."
          />
        </Col>
      </Row>

      <SectionDivider
        title="Default Containers"
        description="Configure default items in containers for new islands"
      />

      <Row>
        <Col>
          <Form.Check
            type="switch"
            id="default-containers-enabled"
            label="Enable Default Containers"
            checked={getConfigValue(['default-containers', 'enabled'], false)}
            onChange={(e) => updateConfig(['default-containers', 'enabled'], e.target.checked)}
          />
        </Col>
      </Row>

      {getConfigValue(['default-containers', 'enabled'], false) && (
        <Row>
          <Col>
            <Card className="mb-3">
              <Card.Header>Container Contents</Card.Header>
              <Card.Body>
                {Object.entries(getConfigValue(['default-containers', 'containers'], {})).map(([containerType, slots]) => (
                  <div key={containerType} className="mb-4">
                    <h5>{containerType}</h5>
                    {Object.entries(slots as Record<string, {type: string, amount?: number}>).map(([slot, item]) => (
                      <div key={slot} className="mb-2 d-flex align-items-center">
                        <span className="me-2">Slot {slot}:</span>
                        <input
                          type="text"
                          value={item.type}
                          onChange={(e) => updateNestedKeyValue(
                            ['default-containers', 'containers', containerType, slot], 
                            'type', 
                            e.target.value
                          )}
                          className="form-control me-2"
                          placeholder="Item type (e.g., DIAMOND)"
                        />
                        <input
                          type="number"
                          value={item.amount || ''}
                          onChange={(e) => updateNestedKeyValue(
                            ['default-containers', 'containers', containerType, slot], 
                            'amount', 
                            e.target.value ? parseInt(e.target.value) : undefined
                          )}
                          className="form-control me-2"
                          placeholder="Amount (optional)"
                          min={1}
                        />
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => deleteNestedKeyValue(
                            ['default-containers', 'containers', containerType], 
                            slot
                          )}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    ))}

                    {/* Add new container item */}
                    <div className="d-flex mt-3">
                      <input
                        id={`new-${containerType}-slot`}
                        placeholder="Slot number"
                        className="form-control me-2"
                        type="number"
                        min={0}
                      />
                      <input
                        id={`new-${containerType}-type`}
                        placeholder="Item type (e.g., DIAMOND)"
                        className="form-control me-2"
                      />
                      <input
                        id={`new-${containerType}-amount`}
                        type="number"
                        placeholder="Amount (optional)"
                        className="form-control me-2"
                        min={1}
                      />
                      <Button 
                        variant="primary"
                        onClick={() => {
                          const slot = (document.getElementById(`new-${containerType}-slot`) as HTMLInputElement).value;
                          const type = (document.getElementById(`new-${containerType}-type`) as HTMLInputElement).value;
                          const amount = (document.getElementById(`new-${containerType}-amount`) as HTMLInputElement).value;
                          if (slot && type) {
                            updateNestedKeyValue(
                              ['default-containers', 'containers', containerType, slot], 
                              'type', 
                              type
                            );
                            if (amount) {
                              updateNestedKeyValue(
                                ['default-containers', 'containers', containerType, slot], 
                                'amount', 
                                parseInt(amount)
                              );
                            }
                            (document.getElementById(`new-${containerType}-slot`) as HTMLInputElement).value = '';
                            (document.getElementById(`new-${containerType}-type`) as HTMLInputElement).value = '';
                            (document.getElementById(`new-${containerType}-amount`) as HTMLInputElement).value = '';
                          }
                        }}
                      >
                        <i className="bi bi-plus"></i>
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add new container type */}
                <div className="d-flex mt-3">
                  <input
                    id="new-container-type"
                    placeholder="Container type (e.g., chest)"
                    className="form-control me-2"
                  />
                  <Button 
                    variant="primary"
                    onClick={() => {
                      const containerType = (document.getElementById('new-container-type') as HTMLInputElement).value;
                      if (containerType) {
                        updateNestedKeyValue(
                          ['default-containers', 'containers'], 
                          containerType, 
                          {}
                        );
                        (document.getElementById('new-container-type') as HTMLInputElement).value = '';
                      }
                    }}
                  >
                    <i className="bi bi-plus"></i> Add Container Type
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default DefaultValuesSettings;
