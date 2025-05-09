import React from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import { TextInput, NumberInput, SectionDivider } from '../../wildstacker/FormComponents';
import { PermissionListEditor } from '../PermissionListEditor';

interface IslandRolesSettingsProps {
  getConfigValue: <T>(path: string[], defaultValue: T) => T;
  updateConfig: (path: string[], value: unknown) => void;
}

const IslandRolesSettings: React.FC<IslandRolesSettingsProps> = ({ getConfigValue, updateConfig }) => {
  return (
    <Form>
      <SectionDivider
        title="Island Roles Configuration"
        description="Configure the roles and permissions for islands"
      />
      
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Guest Role</Card.Header>
            <Card.Body>
              <TextInput
                id="guest-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'guest', 'name'], 'Guest')}
                onChange={(value) => updateConfig(['island-roles', 'guest', 'name'], value)}
                helpText="Display name for the guest role"
              />
              
              <PermissionListEditor
                id="guest-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'guest', 'permissions'], [])}
                onChange={(values) => updateConfig(['island-roles', 'guest', 'permissions'], values)}
                helpText="Permissions for guests (non-members)"
              />
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Coop Role</Card.Header>
            <Card.Body>
              <TextInput
                id="coop-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'coop', 'name'], 'Coop')}
                onChange={(value) => updateConfig(['island-roles', 'coop', 'name'], value)}
                helpText="Display name for the coop role"
              />
              
              <PermissionListEditor
                id="coop-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'coop', 'permissions'], [
                  'BREAK', 'BUILD', 'INTERACT', 'PICKUP_DROPS'
                ])}
                onChange={(values) => updateConfig(['island-roles', 'coop', 'permissions'], values)}
                helpText="Permissions for coop members"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <SectionDivider
        title="Member Roles Ladder"
        description="Configure the hierarchical roles for island members"
      />
      
      {/* Member Role */}
      <Card className="mb-3">
        <Card.Header>Member Role</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <TextInput
                id="member-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'ladder', 'member', 'name'], 'Member')}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'member', 'name'], value)}
                helpText="Display name for the member role"
              />
              
              <NumberInput
                id="member-role-id"
                label="Role ID"
                value={getConfigValue(['island-roles', 'ladder', 'member', 'id'], 0)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'member', 'id'], value)}
                helpText="Unique ID for the member role (do not change!)"
                // disabled prop removed because it's not supported
              />
              
              <NumberInput
                id="member-role-weight"
                label="Role Weight"
                value={getConfigValue(['island-roles', 'ladder', 'member', 'weight'], 0)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'member', 'weight'], value)}
                min={0}
                helpText="Weight of the role in the ladder hierarchy"
              />
            </Col>
            <Col md={6}>
              <PermissionListEditor
                id="member-role-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'ladder', 'member', 'permissions'], [
                  'ANIMAL_SPAWN', 'CHEST_ACCESS', 'DEPOSIT_MONEY', 'FLY', 
                  'ISLAND_CHEST', 'MONSTER_SPAWN', 'RANKUP', 'SPAWNER_BREAK'
                ])}
                onChange={(values) => updateConfig(['island-roles', 'ladder', 'member', 'permissions'], values)}
                helpText="Permissions for members"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Moderator Role */}
      <Card className="mb-3">
        <Card.Header>Moderator Role</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <TextInput
                id="mod-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'ladder', 'mod', 'name'], 'Moderator')}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'mod', 'name'], value)}
                helpText="Display name for the moderator role"
              />
              
              <NumberInput
                id="mod-role-id"
                label="Role ID"
                value={getConfigValue(['island-roles', 'ladder', 'mod', 'id'], 1)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'mod', 'id'], value)}
                helpText="Unique ID for the moderator role (do not change!)"
                // disabled prop removed because it's not supported
              />
              
              <NumberInput
                id="mod-role-weight"
                label="Role Weight"
                value={getConfigValue(['island-roles', 'ladder', 'mod', 'weight'], 1)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'mod', 'weight'], value)}
                min={0}
                helpText="Weight of the role in the ladder hierarchy"
              />
            </Col>
            <Col md={6}>
              <PermissionListEditor
                id="mod-role-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'ladder', 'mod', 'permissions'], [
                  'BAN_MEMBER', 'CLOSE_ISLAND', 'DELETE_WARP', 'EXPEL_PLAYERS', 
                  'INVITE_MEMBER', 'KICK_MEMBER', 'OPEN_ISLAND', 'RATINGS_SHOW', 
                  'SET_WARP', 'VALUABLE_BREAK', 'WITHDRAW_MONEY'
                ])}
                onChange={(values) => updateConfig(['island-roles', 'ladder', 'mod', 'permissions'], values)}
                helpText="Permissions for moderators"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Admin Role */}
      <Card className="mb-3">
        <Card.Header>Admin Role</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <TextInput
                id="admin-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'ladder', 'admin', 'name'], 'Admin')}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'admin', 'name'], value)}
                helpText="Display name for the admin role"
              />
              
              <NumberInput
                id="admin-role-id"
                label="Role ID"
                value={getConfigValue(['island-roles', 'ladder', 'admin', 'id'], 2)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'admin', 'id'], value)}
                helpText="Unique ID for the admin role (do not change!)"
                // disabled prop removed because it's not supported
              />
              
              <NumberInput
                id="admin-role-weight"
                label="Role Weight"
                value={getConfigValue(['island-roles', 'ladder', 'admin', 'weight'], 2)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'admin', 'weight'], value)}
                min={0}
                helpText="Weight of the role in the ladder hierarchy"
              />
            </Col>
            <Col md={6}>
              <PermissionListEditor
                id="admin-role-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'ladder', 'admin', 'permissions'], [
                  'COOP_MEMBER', 'DEMOTE_MEMBERS', 'DISCORD_SHOW', 'PAYPAL_SHOW', 
                  'PROMOTE_MEMBERS', 'SET_BIOME', 'SET_DISCORD', 'SET_HOME', 
                  'SET_PAYPAL', 'SET_PERMISSION', 'SET_ROLE', 'SET_SETTINGS', 
                  'UNCOOP_MEMBER'
                ])}
                onChange={(values) => updateConfig(['island-roles', 'ladder', 'admin', 'permissions'], values)}
                helpText="Permissions for admins"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Leader Role */}
      <Card className="mb-3">
        <Card.Header>Leader Role</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <TextInput
                id="leader-role-name"
                label="Role Name"
                value={getConfigValue(['island-roles', 'ladder', 'leader', 'name'], 'Leader')}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'leader', 'name'], value)}
                helpText="Display name for the leader role"
              />
              
              <NumberInput
                id="leader-role-id"
                label="Role ID"
                value={getConfigValue(['island-roles', 'ladder', 'leader', 'id'], 3)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'leader', 'id'], value)}
                helpText="Unique ID for the leader role (do not change!)"
                // disabled prop removed because it's not supported
              />
              
              <NumberInput
                id="leader-role-weight"
                label="Role Weight"
                value={getConfigValue(['island-roles', 'ladder', 'leader', 'weight'], 3)}
                onChange={(value) => updateConfig(['island-roles', 'ladder', 'leader', 'weight'], value)}
                min={0}
                helpText="Weight of the role in the ladder hierarchy"
              />
            </Col>
            <Col md={6}>
              <PermissionListEditor
                id="leader-role-permissions"
                label="Permissions"
                values={getConfigValue(['island-roles', 'ladder', 'leader', 'permissions'], [
                  'ALL'
                ])}
                onChange={(values) => updateConfig(['island-roles', 'ladder', 'leader', 'permissions'], values)}
                helpText="Permissions for leaders"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Form>
  );
};

export default IslandRolesSettings;
