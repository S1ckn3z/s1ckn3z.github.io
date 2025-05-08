import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { NumberInput, TextInput, BooleanToggle, SelectInput, SectionDivider } from '../../wildstacker/FormComponents';

interface GeneralSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Basic Configuration"
        description="Configure general plugin settings"
      />
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="calc-interval"
            label="Calculation Interval"
            value={getConfigValue(['calc-interval'], 0)}
            onChange={(value) => updateConfig(['calc-interval'], value)}
            helpText="Time between auto calculations of all islands (0 to disable)"
          />
        </Col>
        <Col md={6}>
          <TextInput
            id="island-command"
            label="Island Command"
            value={getConfigValue(['island-command'], 'island,is,islands')}
            onChange={(value) => updateConfig(['island-command'], value)}
            helpText="The main command and aliases (comma separated)"
            required
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="max-island-size"
            label="Maximum Island Size"
            value={getConfigValue(['max-island-size'], 200)}
            onChange={(value) => updateConfig(['max-island-size'], value)}
            min={50}
            helpText="The maximum island size (don't change with running islands)"
            required
          />
        </Col>
        <Col md={6}>
          <NumberInput
            id="islands-height"
            label="Islands Height"
            value={getConfigValue(['islands-height'], 100)}
            onChange={(value) => updateConfig(['islands-height'], value)}
            min={50}
            max={250}
            helpText="The Y-level at which islands will be generated"
            required
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <TextInput
            id="island-level-formula"
            label="Island Level Formula"
            value={getConfigValue(['island-level-formula'], '{} / 2')}
            onChange={(value) => updateConfig(['island-level-formula'], value)}
            helpText="Formula to calculate the island level by its worth. Use {} as a placeholder for worth."
            required
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="rounded-island-level"
            label="Rounded Island Level"
            value={getConfigValue(['rounded-island-level'], false)}
            onChange={(value) => updateConfig(['rounded-island-level'], value)}
            helpText="Should the island levels be a rounded integer?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <SelectInput
            id="island-top-order"
            label="Island Top Order"
            value={getConfigValue(['island-top-order'], 'WORTH')}
            options={[
              { value: 'WORTH', label: 'Worth' },
              { value: 'LEVEL', label: 'Level' },
              { value: 'RATING', label: 'Rating' },
              { value: 'PLAYERS', label: 'Players' }
            ]}
            onChange={(value) => updateConfig(['island-top-order'], value)}
            helpText="How should the island top be ordered by default?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="island-top-include-leader"
            label="Include Leader in Top"
            value={getConfigValue(['island-top-include-leader'], true)}
            onChange={(value) => updateConfig(['island-top-include-leader'], value)}
            helpText="Should the list of members in island top also include the island leader?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="coop-members"
            label="Coop Members"
            value={getConfigValue(['coop-members'], true)}
            onChange={(value) => updateConfig(['coop-members'], value)}
            helpText="Whether coop members should be enabled or not"
          />
        </Col>
        <Col md={6}>
          <SelectInput
            id="island-top-members-sorting"
            label="Top Members Sorting"
            value={getConfigValue(['island-top-members-sorting'], 'NAMES')}
            options={[
              { value: 'NAMES', label: 'By Names' },
              { value: 'ROLES', label: 'By Roles' }
            ]}
            onChange={(value) => updateConfig(['island-top-members-sorting'], value)}
            helpText="How members will be sorted in top islands using the {4} placeholder"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="negative-worth"
            label="Allow Negative Worth"
            value={getConfigValue(['negative-worth'], true)}
            onChange={(value) => updateConfig(['negative-worth'], value)}
            helpText="Can the worth value of the island be negative?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="negative-level"
            label="Allow Negative Level"
            value={getConfigValue(['negative-level'], true)}
            onChange={(value) => updateConfig(['negative-level'], value)}
            helpText="Can the level of the island be negative?"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Language & Number Format"
        description="Configure language and formatting settings"
      />
      
      <Row>
        <Col md={6}>
          <TextInput
            id="default-language"
            label="Default Language"
            value={getConfigValue(['default-language'], 'en-US')}
            onChange={(value) => updateConfig(['default-language'], value)}
            helpText="The default language to be used (should match language file name)"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="auto-language-detection"
            label="Auto Language Detection"
            value={getConfigValue(['auto-language-detection'], true)}
            onChange={(value) => updateConfig(['auto-language-detection'], value)}
            helpText="Detect player's language automatically when they first join"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <TextInput
            id="number-format"
            label="Number Format"
            value={getConfigValue(['number-format'], 'en-US')}
            onChange={(value) => updateConfig(['number-format'], value)}
            helpText="Number formatting locale (e.g., en-US, de-DE)"
          />
        </Col>
        <Col md={6}>
          <TextInput
            id="date-format"
            label="Date Format"
            value={getConfigValue(['date-format'], 'dd/MM/yyyy HH:mm:ss')}
            onChange={(value) => updateConfig(['date-format'], value)}
            helpText="The date formatting to be used (Java SimpleDateFormat)"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="UI Settings"
        description="Configure user interface settings"
      />
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="values-menu"
            label="Values Menu"
            value={getConfigValue(['values-menu'], true)}
            onChange={(value) => updateConfig(['values-menu'], value)}
            helpText="Should the values menu be enabled?"
          />
        </Col>
        <Col md={6}>
          <BooleanToggle
            id="skip-one-item-menus"
            label="Skip One-Item Menus"
            value={getConfigValue(['skip-one-item-menus'], false)}
            onChange={(value) => updateConfig(['skip-one-item-menus'], value)}
            helpText="Should players skip menus with only one item inside them?"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="only-back-button"
            label="Only Back Button"
            value={getConfigValue(['only-back-button'], false)}
            onChange={(value) => updateConfig(['only-back-button'], value)}
            helpText="Should only the back button work for closing menus?"
          />
        </Col>
        <Col md={6}>
          <NumberInput
            id="commands-per-page"
            label="Commands Per Page"
            value={getConfigValue(['commands-per-page'], 7)}
            onChange={(value) => updateConfig(['commands-per-page'], value)}
            min={0}
            helpText="Amount of commands to be listed in help commands (0 for all)"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="tab-complete-hide-vanished"
            label="Hide Vanished in Tab Complete"
            value={getConfigValue(['tab-complete-hide-vanished'], true)}
            onChange={(value) => updateConfig(['tab-complete-hide-vanished'], value)}
            helpText="Should vanished players be hidden in tab completes?"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default GeneralSettings;
