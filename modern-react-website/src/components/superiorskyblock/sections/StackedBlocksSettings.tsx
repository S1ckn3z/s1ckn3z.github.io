import React from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { BooleanToggle, TextInput, StringListEditor, SectionDivider, SelectInput } from '../../wildstacker/FormComponents';

interface StackedBlocksSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
  updateNestedKeyValue: (path: string[], key: string, value: unknown) => void;
  deleteNestedKeyValue: (path: string[], key: string) => void;
}

const StackedBlocksSettings: React.FC<StackedBlocksSettingsProps> = ({
  getConfigValue,
  updateConfig,
  updateNestedKeyValue,
  deleteNestedKeyValue
}) => {
  return (
    <Form>
      <SectionDivider
        title="Stacked Blocks Configuration"
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
            id="default-blocks-stacker"
            label="Default Blocks Stacker"
            value={getConfigValue(['default-blocks-stacker'], true)}
            onChange={(value) => updateConfig(['default-blocks-stacker'], value)}
            helpText="Should blocks stacking be enabled by default for new players?"
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
      
      <Row>
        <Col>
          <StringListEditor
            id="stacked-blocks-disabled-worlds"
            label="Disabled Worlds"
            values={getConfigValue(['stacked-blocks', 'disabled-worlds'], [])}
            onChange={(values) => updateConfig(['stacked-blocks', 'disabled-worlds'], values)}
            helpText="A list of worlds that blocks cannot stack in"
            placeholder="Add world name..."
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Stacked Blocks Limits"
        description="Configure limits for stacked blocks"
      />
      
      <Row>
        <Col>
          <Card className="mb-3">
            <Card.Header>Block Limits</Card.Header>
            <Card.Body>
              {/* Dynamic block limits editor */}
              {Object.entries(getConfigValue(['stacked-blocks', 'limits'], {} as Record<string, number>)).map(([block, limit]) => (
                <div key={block} className="mb-2 d-flex align-items-center">
                  <span className="me-2">{block}:</span>
                  <input
                    type="number"
                    value={limit}
                    onChange={(e) => updateNestedKeyValue(['stacked-blocks', 'limits'], block, parseInt(e.target.value))}
                    className="form-control me-2"
                    min={0}
                  />
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => deleteNestedKeyValue(['stacked-blocks', 'limits'], block)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))}
              
              {/* Add new block limit */}
              <div className="d-flex mt-3">
                <input
                  id="new-stacked-block-type"
                  placeholder="Block type (e.g., EXAMPLE_BLOCK)"
                  className="form-control me-2"
                />
                <input
                  id="new-stacked-block-limit"
                  type="number"
                  placeholder="Limit"
                  className="form-control me-2"
                  min={0}
                />
                <Button 
                  variant="primary"
                  onClick={() => {
                    const blockType = (document.getElementById('new-stacked-block-type') as HTMLInputElement).value;
                    const limit = parseInt((document.getElementById('new-stacked-block-limit') as HTMLInputElement).value);
                    if (blockType && !isNaN(limit)) {
                      updateNestedKeyValue(['stacked-blocks', 'limits'], blockType, limit);
                      (document.getElementById('new-stacked-block-type') as HTMLInputElement).value = '';
                      (document.getElementById('new-stacked-block-limit') as HTMLInputElement).value = '';
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
        title="Deposit Menu Configuration"
        description="Configure the deposit menu for stacked blocks"
      />
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="deposit-menu-enabled"
            label="Enable Deposit Menu"
            value={getConfigValue(['stacked-blocks', 'deposit-menu', 'enabled'], true)}
            onChange={(value) => updateConfig(['stacked-blocks', 'deposit-menu', 'enabled'], value)}
            helpText="Should the menu be opened when shift-clicking stacked blocks?"
          />
        </Col>
        <Col md={6}>
          <TextInput
            id="deposit-menu-title"
            label="Menu Title"
            value={getConfigValue(['stacked-blocks', 'deposit-menu', 'title'], '&lDeposit Blocks')}
            onChange={(value) => updateConfig(['stacked-blocks', 'deposit-menu', 'title'], value)}
            helpText="The title of the deposit menu"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="World Border Configuration"
        description="Configure world border settings"
      />
      
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
            id="stop-leaving"
            label="Stop Leaving"
            value={getConfigValue(['stop-leaving'], false)}
            onChange={(value) => updateConfig(['stop-leaving'], value)}
            helpText="Stop players from leaving their island by walking through the border"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default StackedBlocksSettings;
