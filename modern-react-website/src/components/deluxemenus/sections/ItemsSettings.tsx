// src/components/deluxemenus/sections/ItemsSettings.tsx
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SectionDivider } from '../../wildstacker/FormComponents';

interface ItemsSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const ItemsSettings: React.FC<ItemsSettingsProps> = () => {
  return (
    <Form>
      <SectionDivider
        title="Item Configuration Reference"
        description="Guide for configuring items in menus"
      />
      
      <Row>
        <Col>
          <div className="p-3 border rounded mb-3">
            <h5>Basic Item Properties</h5>
            <ul>
              <li><strong>material</strong> - The item material type (eg. DIAMOND_SWORD)</li>
              <li><strong>data</strong> - The data value for the item (for legacy Minecraft versions)</li>
              <li><strong>amount</strong> - The amount of the item to display</li>
              <li><strong>slot</strong> - The slot where the item should be placed (or slots for multiple)</li>
              <li><strong>display_name</strong> - The name displayed for the item</li>
              <li><strong>lore</strong> - List of lore lines shown when hovering over the item</li>
            </ul>
          </div>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Item Flags</h5>
            <ul>
              <li><strong>HIDE_ATTRIBUTES</strong> - Hides item attributes like damage</li>
              <li><strong>HIDE_ENCHANTS</strong> - Hides the enchantments list</li>
              <li><strong>HIDE_UNBREAKABLE</strong> - Hides the unbreakable flag</li>
              <li><strong>HIDE_POTION_EFFECTS</strong> - Hides potion effects</li>
              <li><strong>HIDE_DESTROYS</strong> - Hides what the item can destroy</li>
            </ul>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="p-3 border rounded mb-3">
            <h5>Special Item Types</h5>
            <ul>
              <li><strong>head-&lt;player&gt;</strong> - Player head (eg. head-extended_clip)</li>
              <li><strong>basehead-&lt;value&gt;</strong> - Base64 encoded custom head</li>
              <li><strong>hdb-&lt;id&gt;</strong> - HeadDatabase head ID</li>
              <li><strong>banner</strong> - Banner with custom patterns</li>
            </ul>
          </div>
        </Col>
      </Row>
      
      <SectionDivider
        title="Dynamic Item Options"
        description="Options for dynamic and interactive items"
      />
      
      <Row>
        <Col>
          <div className="p-3 border rounded mb-3">
            <h5>Dynamic Features</h5>
            <ul>
              <li><strong>update</strong> - Set to true to update placeholders on the interval</li>
              <li><strong>priority</strong> - Priority for items in the same slot (lower number = higher priority)</li>
              <li><strong>view_requirement</strong> - Requirements for the item to be visible</li>
              <li><strong>click_commands</strong> - Commands executed when clicking the item</li>
              <li><strong>click_requirement</strong> - Requirements to execute the click commands</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default ItemsSettings;