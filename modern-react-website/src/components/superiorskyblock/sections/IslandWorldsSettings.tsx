import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { SelectInput, BooleanToggle, TextInput, SectionDivider, StringListEditor } from '../../wildstacker/FormComponents';

interface IslandWorldsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const IslandWorldsSettings: React.FC<IslandWorldsSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
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
      
      <SectionDivider
        title="World Permissions & Settings"
        description="Configure world-related permissions and settings"
      />
      
      <Row>
        <Col>
          <StringListEditor
            id="world-permissions"
            label="World Permissions"
            values={getConfigValue(['world-permissions'], [])}
            onChange={(values) => updateConfig(['world-permissions'], values)}
            helpText="Permissions players will have in the islands world, outside of islands"
            placeholder="Add permission..."
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="void-teleport-members"
            label="Void Teleport Members"
            value={getConfigValue(['void-teleport', 'members'], true)}
            onChange={(value) => updateConfig(['void-teleport', 'members'], value)}
            helpText="Should island members get teleported upon void fall?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="void-teleport-visitors"
            label="Void Teleport Visitors"
            value={getConfigValue(['void-teleport', 'visitors'], true)}
            onChange={(value) => updateConfig(['void-teleport', 'visitors'], value)}
            helpText="Should visitors get teleported upon void fall?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="visitors-damage"
            label="Visitors Damage"
            value={getConfigValue(['visitors-damage'], false)}
            onChange={(value) => updateConfig(['visitors-damage'], value)}
            helpText="Should visitors get damaged in other islands?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="coop-damage"
            label="Coop Damage"
            value={getConfigValue(['coop-damage'], true)}
            onChange={(value) => updateConfig(['coop-damage'], value)}
            helpText="Should coop members get damaged in islands they are coop with?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="teleport-on-pvp-enable"
            label="Teleport on PvP Enable"
            value={getConfigValue(['teleport-on-pvp-enable'], true)}
            onChange={(value) => updateConfig(['teleport-on-pvp-enable'], value)}
            helpText="Should visitors get teleported to spawn when pvp is enabled in an island?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="immune-to-pvp-when-teleport"
            label="PvP Immunity After Teleport"
            value={getConfigValue(['immune-to-pvp-when-teleport'], true)}
            onChange={(value) => updateConfig(['immune-to-pvp-when-teleport'], value)}
            helpText="Should visitors get immunity to pvp for 10 seconds when they teleport?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <StringListEditor
            id="pvp-worlds"
            label="PvP Worlds"
            values={getConfigValue(['pvp-worlds'], ['PvP'])}
            onChange={(values) => updateConfig(['pvp-worlds'], values)}
            helpText="A list of worlds that PvP will be enabled between island members"
            placeholder="Add world name..."
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <StringListEditor
            id="blocked-visitors-commands"
            label="Blocked Visitor Commands"
            values={getConfigValue(['blocked-visitors-commands'], [])}
            onChange={(values) => updateConfig(['blocked-visitors-commands'], values)}
            helpText="A list of commands that cannot be executed by visitors"
            placeholder="Add command..."
          />
        </Col>
      </Row>
    </Form>
  );
};

export default IslandWorldsSettings;
