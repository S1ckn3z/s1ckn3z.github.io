import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider, StringListEditor, TextInput, BooleanToggle, NumberInput } from '../../wildstacker/FormComponents';

interface MiscSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const MiscSettings: React.FC<MiscSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Island Names Configuration"
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
        title="Island Chest Configuration"
        description="Configure the island chest functionality"
      />
      
      <Row>
        <Col md={6}>
          <TextInput
            id="island-chests-chest-title"
            label="Chest Title"
            value={getConfigValue(['island-chests', 'chest-title'], '&4Island Chest')}
            onChange={(value) => updateConfig(['island-chests', 'chest-title'], value)}
            helpText="The chest title for island chests"
          />
        </Col>
        <Col md={6}>
          <NumberInput
            id="island-chests-default-pages"
            label="Default Pages"
            value={getConfigValue(['island-chests', 'default-pages'], 0)}
            onChange={(value) => updateConfig(['island-chests', 'default-pages'], value)}
            min={0}
            helpText="Default amount of pages (0 to not have any pages by default)"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="island-chests-default-size"
            label="Default Size"
            value={getConfigValue(['island-chests', 'default-size'], 3)}
            onChange={(value) => updateConfig(['island-chests', 'default-size'], value)}
            min={1}
            max={6}
            helpText="Default size for the pages (rows, between 1 and 6)"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Crop Growth & Spawners Configuration"
        description="Configure crop growth and spawner-related settings"
      />
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="crops-interval"
            label="Crops Interval (ticks)"
            value={getConfigValue(['crops-interval'], 5)}
            onChange={(value) => updateConfig(['crops-interval'], value)}
            min={0}
            helpText="How frequency should the crops task run? (0 to disable)"
          />
          
          <TextInput
            id="spawners-provider"
            label="Spawners Provider"
            value={getConfigValue(['spawners-provider'], 'AUTO')}
            onChange={(value) => updateConfig(['spawners-provider'], value)}
            helpText="Specify a spawners provider (AUTO, WildStacker, EpicSpawners, etc.)"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="drops-upgrade-players-multiply"
            label="Drops Upgrade Players Multiply"
            value={getConfigValue(['drops-upgrade-players-multiply'], false)}
            onChange={(value) => updateConfig(['drops-upgrade-players-multiply'], value)}
            helpText="When enabled, the drops multiplier will only multiply drops of entities killed by players"
          />
          
          <TextInput
            id="stacked-blocks-provider"
            label="Stacked Blocks Provider"
            value={getConfigValue(['stacked-blocks-provider'], 'AUTO')}
            onChange={(value) => updateConfig(['stacked-blocks-provider'], value)}
            helpText="Specify a stacked-blocks provider (AUTO, WildStacker, RoseStacker)"
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <StringListEditor
            id="crops-to-grow"
            label="Crops to Grow"
            values={getConfigValue(['crops-to-grow'], [
              'CACTUS', 'SUGAR_CANE_BLOCK', 'SUGAR_CANE', 'MELON_STEM',
              'ATTACHED_MELON_STEM', 'RED_MUSHROOM', 'BROWN_MUSHROOM', 'PUMPKIN_STEM',
              'ATTACHED_PUMPKIN_STEM', 'VINE', 'COCOA', 'SAPLING', 'DARK_OAK_SAPLING',
              'JUNGLE_SAPLING', 'OAK_SAPLING', 'ACACIA_SAPLING', 'BIRCH_SAPLING',
              'SPRUCE_SAPLING', 'CROPS', 'WHEAT', 'CARROT', 'CARROTS', 'POTATO',
              'POTATOES', 'BEETROOTS'
            ])}
            onChange={(values) => updateConfig(['crops-to-grow'], values)}
            helpText="A list of crops that will be affected by the crop growth multiplier"
            placeholder="Add crop material..."
          />
        </Col>
      </Row>
    </Form>
  );
};

export default MiscSettings;
