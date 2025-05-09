import React, { useState } from 'react';
import { Form, Button, InputGroup, ListGroup } from 'react-bootstrap';

interface PermissionListEditorProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  helpText?: string;
}

// Comprehensive list of all SuperiorSkyblock permissions
const AVAILABLE_PERMISSIONS = [
  'ALL',
  'ANIMAL_SPAWN',
  'BAN_MEMBER',
  'BREAK',
  'BUILD',
  'CHEST_ACCESS',
  'CLOSE_ISLAND',
  'COOP_MEMBER',
  'DELETE_WARP',
  'DEMOTE_MEMBERS',
  'DEPOSIT_MONEY',
  'DISCORD_SHOW',
  'EXPEL_PLAYERS',
  'FLY',
  'INTERACT',
  'INVITE_MEMBER',
  'ISLAND_CHEST',
  'KICK_MEMBER',
  'MONSTER_SPAWN',
  'OPEN_ISLAND',
  'PAYPAL_SHOW',
  'PICKUP_DROPS',
  'PROMOTE_MEMBERS',
  'RANKUP',
  'RATINGS_SHOW',
  'SET_BIOME',
  'SET_DISCORD',
  'SET_HOME',
  'SET_PAYPAL',
  'SET_PERMISSION',
  'SET_ROLE',
  'SET_SETTINGS',
  'SET_WARP',
  'SPAWNER_BREAK',
  'UNCOOP_MEMBER',
  'VALUABLE_BREAK',
  'WITHDRAW_MONEY'
];

export const PermissionListEditor: React.FC<PermissionListEditorProps> = ({
  id,
  label,
  values,
  onChange,
  helpText,
}) => {
  const [selectedPermission, setSelectedPermission] = useState('');

  // Filter out permissions that are already in the list
  const availablePermissions = AVAILABLE_PERMISSIONS.filter(
    (permission) => !values.includes(permission)
  );

  const addPermission = () => {
    if (selectedPermission && !values.includes(selectedPermission)) {
      onChange([...values, selectedPermission]);
      setSelectedPermission('');
    }
  };

  const removePermission = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      
      <InputGroup className="mb-2">
        <Form.Select
          value={selectedPermission}
          onChange={(e) => setSelectedPermission(e.target.value)}
          disabled={availablePermissions.length === 0}
        >
          <option value="">Select a permission...</option>
          {availablePermissions.map((permission) => (
            <option key={permission} value={permission}>
              {permission}
            </option>
          ))}
        </Form.Select>
        <Button 
          variant="primary" 
          onClick={addPermission}
          disabled={!selectedPermission}
        >
          <i className="bi bi-plus"></i>
        </Button>
      </InputGroup>
      
      {helpText && <Form.Text className="text-muted mb-2">{helpText}</Form.Text>}
      
      {values.length > 0 ? (
        <ListGroup className="string-list">
          {values.map((permission, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {permission}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removePermission(index)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-muted text-center py-3 border rounded">
          No permissions added
        </div>
      )}
    </Form.Group>
  );
};
