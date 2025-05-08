import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider, StringListEditor, TextInput, BooleanToggle, NumberInput } from '../../wildstacker/FormComponents';

interface SignsWarpsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const SignsWarpsSettings: React.FC<SignsWarpsSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Warp Sign Configuration"
        description="Configure island warp signs"
      />
      
      <Row>
        <Col md={6}>
          <TextInput
            id="sign-warp-line"
            label="Warp Sign Line"
            value={getConfigValue(['sign-warp-line'], '[IslandWarp]')}
            onChange={(value) => updateConfig(['sign-warp-line'], value)}
            helpText="Set the line to create the warp sign"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="warp-categories"
            label="Enable Warp Categories"
            value={getConfigValue(['warp-categories'], true)}
            onChange={(value) => updateConfig(['warp-categories'], value)}
            helpText="Should players be able to create warp categories?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <StringListEditor
            id="sign-warp"
            label="Warp Sign Lines"
            values={getConfigValue(['sign-warp'], [
              '&a[Island Warp]', '', '', ''
            ])}
            onChange={(values) => updateConfig(['sign-warp'], values)}
            helpText="Set the lines of the island warp sign"
            placeholder="Add line..."
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Visitors Sign Configuration"
        description="Configure visitors sign settings"
      />
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="visitors-sign-required-for-visit"
            label="Required For Visit"
            value={getConfigValue(['visitors-sign', 'required-for-visit'], true)}
            onChange={(value) => updateConfig(['visitors-sign', 'required-for-visit'], value)}
            helpText="Whether a visitors sign is required for others to visit islands"
          />
          
          <TextInput
            id="visitors-sign-line"
            label="Sign Line"
            value={getConfigValue(['visitors-sign', 'line'], '[Welcome]')}
            onChange={(value) => updateConfig(['visitors-sign', 'line'], value)}
            helpText="Set the line to create the visitors sign"
          />
        </Col>
        
        <Col md={6}>
          <TextInput
            id="visitors-sign-active"
            label="Active Sign Line"
            value={getConfigValue(['visitors-sign', 'active'], '&a[Welcome]')}
            onChange={(value) => updateConfig(['visitors-sign', 'active'], value)}
            helpText="The line that will be displayed when the sign is active"
          />
          
          <TextInput
            id="visitors-sign-inactive"
            label="Inactive Sign Line"
            value={getConfigValue(['visitors-sign', 'inactive'], '&c[Welcome]')}
            onChange={(value) => updateConfig(['visitors-sign', 'inactive'], value)}
            helpText="The line that will be displayed when the sign is inactive"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Preview & Teleportation Settings"
        description="Configure island preview and teleportation settings"
      />
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="warps-warmup"
            label="Warps Warmup (ms)"
            value={getConfigValue(['warps-warmup'], 0)}
            onChange={(value) => updateConfig(['warps-warmup'], value)}
            min={0}
            helpText="Delay before getting teleported to a warp (in milliseconds)"
          />
          
          <NumberInput
            id="home-warmup"
            label="Home Warmup (ms)"
            value={getConfigValue(['home-warmup'], 0)}
            onChange={(value) => updateConfig(['home-warmup'], value)}
            min={0}
            helpText="Delay before getting teleported to your island (in milliseconds)"
          />
        </Col>
        
        <Col md={6}>
          <NumberInput
            id="visit-warmup"
            label="Visit Warmup (ms)"
            value={getConfigValue(['visit-warmup'], 0)}
            onChange={(value) => updateConfig(['visit-warmup'], value)}
            min={0}
            helpText="Delay before getting teleported to another island (in milliseconds)"
          />
          
          <NumberInput
            id="charge-on-warp"
            label="Charge on Warp"
            value={getConfigValue(['charge-on-warp'], 0)}
            onChange={(value) => updateConfig(['charge-on-warp'], value)}
            min={0}
            helpText="Amount of money to charge when using island warps (0 to disable)"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="public-warps"
            label="Public Warps by Default"
            value={getConfigValue(['public-warps'], false)}
            onChange={(value) => updateConfig(['public-warps'], value)}
            helpText="Should island warps be public by default?"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="delete-unsafe-warps"
            label="Delete Unsafe Warps"
            value={getConfigValue(['delete-unsafe-warps'], true)}
            onChange={(value) => updateConfig(['delete-unsafe-warps'], value)}
            helpText="Delete unsafe warps when players try to teleport to them automatically"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="teleport-on-join"
            label="Teleport on Join"
            value={getConfigValue(['teleport-on-join'], false)}
            onChange={(value) => updateConfig(['teleport-on-join'], value)}
            helpText="Should players get teleported to the island after they accept an invite?"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="teleport-on-kick"
            label="Teleport on Kick"
            value={getConfigValue(['teleport-on-kick'], true)}
            onChange={(value) => updateConfig(['teleport-on-kick'], value)}
            helpText="Should players get teleported to spawn when they are kicked from their island?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
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
  );
};

export default SignsWarpsSettings;
