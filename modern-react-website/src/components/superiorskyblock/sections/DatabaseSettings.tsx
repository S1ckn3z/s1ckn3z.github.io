import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { SelectInput, BooleanToggle, TextInput, NumberInput, SectionDivider } from '../../wildstacker/FormComponents';

interface DatabaseSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const DatabaseSettings: React.FC<DatabaseSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Database Configuration"
        description="Configure the database settings for SuperiorSkyblock"
      />
      
      <Row>
        <Col md={6}>
          <SelectInput
            id="database-type"
            label="Database Type"
            value={getConfigValue(['database', 'type'], 'SQLite')}
            options={[
              { value: 'SQLite', label: 'SQLite (Local)' },
              { value: 'MySQL', label: 'MySQL (Remote)' },
              { value: 'MariaDB', label: 'MariaDB (Remote)' }
            ]}
            onChange={(value) => updateConfig(['database', 'type'], value)}
            helpText="Type of database to use"
            required
          />
          
          <BooleanToggle
            id="database-backup"
            label="Backup on Startup"
            value={getConfigValue(['database', 'backup'], true)}
            onChange={(value) => updateConfig(['database', 'backup'], value)}
            helpText="Whether the datastore folder should be backed up on startup"
          />
        </Col>
      </Row>
      
      <SectionDivider
        title="Remote Database Settings"
        description="These settings are only used for MySQL and MariaDB"
      />
      
      <Row>
        <Col md={6}>
          <TextInput
            id="database-address"
            label="Database Address"
            value={getConfigValue(['database', 'address'], 'localhost')}
            onChange={(value) => updateConfig(['database', 'address'], value)}
            helpText="The address of the database server"
          />
          
          <NumberInput
            id="database-port"
            label="Database Port"
            value={getConfigValue(['database', 'port'], 3306)}
            onChange={(value) => updateConfig(['database', 'port'], value)}
            min={1}
            max={65535}
            helpText="The port of the database server"
          />
          
          <TextInput
            id="database-db-name"
            label="Database Name"
            value={getConfigValue(['database', 'db-name'], 'SuperiorSkyblock')}
            onChange={(value) => updateConfig(['database', 'db-name'], value)}
            helpText="The name of the database"
          />
        </Col>
        
        <Col md={6}>
          <TextInput
            id="database-user-name"
            label="Username"
            value={getConfigValue(['database', 'user-name'], 'root')}
            onChange={(value) => updateConfig(['database', 'user-name'], value)}
            helpText="The username for the database"
          />
          
          <TextInput
            id="database-password"
            label="Password"
            value={getConfigValue(['database', 'password'], 'root')}
            onChange={(value) => updateConfig(['database', 'password'], value)}
            helpText="The password for the database"
          />
          
          <TextInput
            id="database-prefix"
            label="Table Prefix"
            value={getConfigValue(['database', 'prefix'], '')}
            onChange={(value) => updateConfig(['database', 'prefix'], value)}
            helpText="Optional prefix for database tables"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <BooleanToggle
            id="database-useSSL"
            label="Use SSL"
            value={getConfigValue(['database', 'useSSL'], false)}
            onChange={(value) => updateConfig(['database', 'useSSL'], value)}
            helpText="Whether to use SSL for the database connection"
          />
        </Col>
        
        <Col md={6}>
          <BooleanToggle
            id="database-allowPublicKeyRetrieval"
            label="Allow Public Key Retrieval"
            value={getConfigValue(['database', 'allowPublicKeyRetrieval'], true)}
            onChange={(value) => updateConfig(['database', 'allowPublicKeyRetrieval'], value)}
            helpText="Allow the client to automatically request public keys from the server"
          />
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <NumberInput
            id="database-waitTimeout"
            label="Wait Timeout (ms)"
            value={getConfigValue(['database', 'waitTimeout'], 600000)}
            onChange={(value) => updateConfig(['database', 'waitTimeout'], value)}
            min={0}
            helpText="The number of milliseconds the server waits for activity on a connection"
          />
        </Col>
        
        <Col md={6}>
          <NumberInput
            id="database-maxLifetime"
            label="Max Lifetime (ms)"
            value={getConfigValue(['database', 'maxLifetime'], 1800000)}
            onChange={(value) => updateConfig(['database', 'maxLifetime'], value)}
            min={0}
            helpText="The maximum lifetime of a connection in the pool"
          />
        </Col>
      </Row>
    </Form>
  );
};

export default DatabaseSettings;
