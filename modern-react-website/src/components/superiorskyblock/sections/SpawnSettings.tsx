import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider, StringListEditor, TextInput, BooleanToggle, NumberInput } from '../../wildstacker/FormComponents';

interface SpawnSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const SpawnSettings: React.FC<SpawnSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
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
              'CROPS_GROWTH', 'LAVA_FLOW', 'NATURAL_ANIMALS_SPAWN', 
              'SPAWNER_ANIMALS_SPAWN', 'TREE_GROWTH', 'WATER_FLOW'
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
      
      <SectionDivider
        title="Default Island Settings"
        description="Configure default settings for new islands"
      />
      
      <Row>
        <Col>
          <StringListEditor
            id="default-settings"
            label="Default Settings"
            values={getConfigValue(['default-settings'], [
              'CREEPER_EXPLOSION', 'NATURAL_ANIMALS_SPAWN', 'NATURAL_MONSTER_SPAWN',
              'SPAWNER_ANIMALS_SPAWN', 'SPAWNER_MONSTER_SPAWN', 'WATER_FLOW',
              'LAVA_FLOW', 'CROPS_GROWTH', 'TREE_GROWTH', 'FIRE_SPREAD', 'EGG_LAY'
            ])}
            onChange={(values) => updateConfig(['default-settings'], values)}
            helpText="A list of default settings for new islands"
            placeholder="Add setting..."
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Player Respawn Actions"
        description="Configure actions performed when a player respawns"
      />
      
      <Row>
        <Col>
          <StringListEditor
            id="player-respawn"
            label="Respawn Actions"
            values={getConfigValue(['player-respawn'], [
              'ISLAND_TELEPORT', 'SPAWN_TELEPORT'
            ])}
            onChange={(values) => updateConfig(['player-respawn'], values)}
            helpText="List of actions to perform in order when a player respawns"
            placeholder="Add action..."
          />
        </Col>
      </Row>
    </Form>
  );
};

export default SpawnSettings;
