// src/components/wildstacker/FormComponents.tsx
import React, { useState } from 'react';
import { Form, Button, InputGroup, ListGroup } from 'react-bootstrap';

// ===== TextInput Component =====
interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  helpText,
  required = false,
}) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {label}
        {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

// ===== NumberInput Component =====
interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  required?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  helpText,
  required = false,
}) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {label}
        {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        required={required}
      />
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

// ===== BooleanToggle Component =====
interface BooleanToggleProps {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  helpText?: string;
}

export const BooleanToggle: React.FC<BooleanToggleProps> = ({
  id,
  label,
  value,
  onChange,
  helpText,
}) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Check
        type="switch"
        label={label}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

// ===== SelectInput Component =====
interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  helpText?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  helpText,
  required = false,
}) => {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {label}
        {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {helpText && <Form.Text className="text-muted">{helpText}</Form.Text>}
    </Form.Group>
  );
};

// ===== StringListEditor Component =====
interface StringListEditorProps {
  id: string;
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  helpText?: string;
  placeholder?: string;
}

export const StringListEditor: React.FC<StringListEditorProps> = ({
  id,
  label,
  values,
  onChange,
  helpText,
  placeholder = 'Add new item...',
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() !== '') {
      onChange([...values, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    onChange(newValues);
  };

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      
      <InputGroup className="mb-2">
        <Form.Control
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button variant="primary" onClick={addItem}>
          <i className="bi bi-plus"></i>
        </Button>
      </InputGroup>
      
      {helpText && <Form.Text className="text-muted mb-2">{helpText}</Form.Text>}
      
      {values.length > 0 ? (
        <ListGroup className="string-list">
          {values.map((item, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              {item}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removeItem(index)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-muted text-center py-3 border rounded">
          No items added
        </div>
      )}
    </Form.Group>
  );
};

// ===== KeyValueEditor Component =====
interface KeyValuePair {
  key: string;
  value: string;
}

interface KeyValueEditorProps {
  id: string;
  label: string;
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  helpText?: string;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({
  id,
  label,
  pairs,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  helpText,
}) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addPair = () => {
    if (newKey.trim() !== '' && newValue.trim() !== '') {
      onChange([...pairs, { key: newKey.trim(), value: newValue.trim() }]);
      setNewKey('');
      setNewValue('');
    }
  };

  const removePair = (index: number) => {
    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    onChange(newPairs);
  };

  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      
      <InputGroup className="mb-2">
        <Form.Control
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder={keyPlaceholder}
        />
        <Form.Control
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={valuePlaceholder}
        />
        <Button 
          variant="primary" 
          onClick={addPair}
          disabled={newKey.trim() === '' || newValue.trim() === ''}
        >
          <i className="bi bi-plus"></i>
        </Button>
      </InputGroup>
      
      {helpText && <Form.Text className="text-muted mb-2">{helpText}</Form.Text>}
      
      {pairs.length > 0 ? (
        <ListGroup className="string-list">
          {pairs.map((pair, index) => (
            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{pair.key}:</strong> {pair.value}
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => removePair(index)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <div className="text-muted text-center py-3 border rounded">
          No key-value pairs added
        </div>
      )}
    </Form.Group>
  );
};

// ===== Section Divider Component =====
interface SectionDividerProps {
  title: string;
  description?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  description,
}) => {
  return (
    <div className="section-divider">
      <h3 className="section-title">{title}</h3>
      {description && <p className="text-muted">{description}</p>}
    </div>
  );
};