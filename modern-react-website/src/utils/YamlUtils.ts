// src/utils/YamlUtils.ts
import * as yaml from 'js-yaml';

/**
 * Represents a validation error in YAML
 */
export interface YamlValidationError {
  path: string;
  message: string;
  line?: number;
}

/**
 * Result of YAML validation
 */
export interface YamlValidationResult {
  isValid: boolean;
  errors: YamlValidationError[];
  parsedData?: Record<string, unknown>;
}

/**
 * Types for WildStacker YAML configuration sections
 */
export interface WildStackerConfigBase {
  [key: string]: unknown;
}

export interface EntitiesConfig extends WildStackerConfigBase {
  entities: {
    enabled: boolean;
    'merge-radius': {
      all: number;
    };
    [key: string]: unknown;
  };
}

export interface SpawnersConfig extends WildStackerConfigBase {
  spawners: {
    enabled: boolean;
    'merge-radius': {
      all: number;
    };
    [key: string]: unknown;
  };
}

export interface BarrelsConfig extends WildStackerConfigBase {
  barrels: {
    enabled: boolean;
    'merge-radius': {
      all: number;
    };
    [key: string]: unknown;
  };
}

export interface CustomNamesConfig extends WildStackerConfigBase {
  enabled: boolean;
  [key: string]: unknown;
}

export type WildStackerConfigType = 
  | 'config' 
  | 'entities' 
  | 'spawners' 
  | 'barrels' 
  | 'customNames';

/**
 * Parses YAML string and returns the result
 * @param yamlString - The YAML string to parse
 */
export const parseYaml = (yamlString: string): YamlValidationResult => {
  try {
    const parsedData = yaml.load(yamlString) as Record<string, unknown>;
    return {
      isValid: true,
      errors: [],
      parsedData
    };
  } catch (error) {
    // Handle yaml.js specific error format
    const yamlError = error as yaml.YAMLException;
    const errorMessage = yamlError.message || 'Unknown error parsing YAML';
    const line = yamlError.mark?.line;
    
    return {
      isValid: false,
      errors: [{
        path: 'root',
        message: errorMessage,
        line
      }]
    };
  }
};

/**
 * Validates specific WildStacker configuration fields
 * @param data - The parsed YAML data
 * @param configType - The type of configuration being validated
 */
export const validateWildStackerConfig = (
  data: Record<string, unknown>, 
  configType: WildStackerConfigType
): YamlValidationResult => {
  const errors: YamlValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: [{ path: 'root', message: 'Configuration must be a valid object' }]
    };
  }

  switch (configType) {
    case 'config':
      validateConfigGeneral(data, errors);
      break;
    case 'entities':
      validateEntitiesConfig(data as EntitiesConfig, errors);
      break;
    case 'spawners':
      validateSpawnersConfig(data as SpawnersConfig, errors);
      break;
    case 'barrels':
      validateBarrelsConfig(data as BarrelsConfig, errors);
      break;
    case 'customNames':
      validateCustomNamesConfig(data as CustomNamesConfig, errors);
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    parsedData: data
  };
};

/**
 * Validates the general configuration fields
 */
const validateConfigGeneral = (data: Record<string, unknown>, errors: YamlValidationError[]): void => {
  // Check for required fields
  if (!data['give-item-name']) {
    errors.push({
      path: 'give-item-name',
      message: 'Give item name is required'
    });
  }
  
  // Validate database section if it exists
  const database = data.database as Record<string, unknown> | undefined;
  if (database && typeof database !== 'object') {
    errors.push({
      path: 'database',
      message: 'Database configuration must be an object'
    });
  }
};

/**
 * Validates the entities configuration fields
 */
const validateEntitiesConfig = (data: EntitiesConfig, errors: YamlValidationError[]): void => {
  const entities = data.entities;
  
  // Check if entities section exists
  if (!entities) {
    errors.push({
      path: 'entities',
      message: 'Entities section is required'
    });
    return;
  }
  
  // Validate enabled field
  if (typeof entities.enabled !== 'boolean') {
    errors.push({
      path: 'entities.enabled',
      message: 'Enabled must be a boolean'
    });
  }
  
  // Validate merge-radius
  const mergeRadius = entities['merge-radius'];
  if (!mergeRadius || typeof mergeRadius !== 'object') {
    errors.push({
      path: 'entities.merge-radius',
      message: 'Merge radius configuration is required'
    });
  } else if (typeof mergeRadius.all !== 'number' || mergeRadius.all < 0) {
    errors.push({
      path: 'entities.merge-radius.all',
      message: 'Merge radius must be a non-negative number'
    });
  }
};

/**
 * Validates the spawners configuration fields
 */
const validateSpawnersConfig = (data: SpawnersConfig, errors: YamlValidationError[]): void => {
  const spawners = data.spawners;
  
  // Check if spawners section exists
  if (!spawners) {
    errors.push({
      path: 'spawners',
      message: 'Spawners section is required'
    });
    return;
  }
  
  // Validate enabled field
  if (typeof spawners.enabled !== 'boolean') {
    errors.push({
      path: 'spawners.enabled',
      message: 'Enabled must be a boolean'
    });
  }
  
  // Validate merge-radius
  const mergeRadius = spawners['merge-radius'];
  if (!mergeRadius || typeof mergeRadius !== 'object') {
    errors.push({
      path: 'spawners.merge-radius',
      message: 'Merge radius configuration is required'
    });
  } else if (typeof mergeRadius.all !== 'number' || mergeRadius.all < 0) {
    errors.push({
      path: 'spawners.merge-radius.all',
      message: 'Merge radius must be a non-negative number'
    });
  }
};

/**
 * Validates the barrels configuration fields
 */
const validateBarrelsConfig = (data: BarrelsConfig, errors: YamlValidationError[]): void => {
  const barrels = data.barrels;
  
  // Check if barrels section exists
  if (!barrels) {
    errors.push({
      path: 'barrels',
      message: 'Barrels section is required'
    });
    return;
  }
  
  // Validate enabled field
  if (typeof barrels.enabled !== 'boolean') {
    errors.push({
      path: 'barrels.enabled',
      message: 'Enabled must be a boolean'
    });
  }
  
  // Validate merge-radius
  const mergeRadius = barrels['merge-radius'];
  if (!mergeRadius || typeof mergeRadius !== 'object') {
    errors.push({
      path: 'barrels.merge-radius',
      message: 'Merge radius configuration is required'
    });
  } else if (typeof mergeRadius.all !== 'number' || mergeRadius.all < 0) {
    errors.push({
      path: 'barrels.merge-radius.all',
      message: 'Merge radius must be a non-negative number'
    });
  }
};

/**
 * Validates the custom names configuration fields
 */
const validateCustomNamesConfig = (data: CustomNamesConfig, errors: YamlValidationError[]): void => {
  // Validate enabled field
  if (typeof data.enabled !== 'boolean') {
    errors.push({
      path: 'enabled',
      message: 'Enabled must be a boolean'
    });
  }
  
  // Validate other entries are strings
  Object.entries(data).forEach(([key, value]) => {
    if (key !== 'enabled' && typeof value !== 'string') {
      errors.push({
        path: key,
        message: `Value for ${key} must be a string`
      });
    }
  });
};

/**
 * Creates a YAML string from a JavaScript object
 * @param data - The data to convert to YAML
 * @param preserveHeader - Whether to preserve a header comment
 * @param headerText - The header text to preserve
 */
export const createYaml = (
  data: Record<string, unknown>, 
  preserveHeader = false,
  headerText?: string
): string => {
  try {
    let yamlContent = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    
    if (preserveHeader && headerText) {
      yamlContent = headerText + yamlContent;
    }
    
    return yamlContent;
  } catch (error) {
    console.error('Error generating YAML:', error);
    return '';
  }
};