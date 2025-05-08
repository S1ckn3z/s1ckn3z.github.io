// src/pages/SuperiorSkyblockPage.tsx
import React, { useState } from 'react'; // Removed useEffect from imports
import { Container, Row, Col } from 'react-bootstrap';
import './SuperiorSkyblockPage.css';
import SuperiorSkyblockEditor from '../components/superiorskyblock/SuperiorSkyblockEditor';

// Initial YAML content from the config.yml file
const initialYaml = `######################################################
##                                                  ##
##                SuperiorSkyblock 2                ##
##                Developed by Ome_R                ##
##                                                  ##
######################################################

# Here you can set the amount of time between auto calculations of all islands.
# If you want to disable this feature, set interval to 0
# It's recommended to set the task to have a low interval, as it might cause lag.
calc-interval: 0

# All settings related to the database of the plugin.
database:
  # For local database, use "SQLite".
  # For remote database, use "MySQL" or "MariaDB" (Depends on your setup).
  type: SQLite
  # Whether the datastore folder should be back-up on startup.
  backup: true
  # Remote database information
  address: 'localhost'
  port: 3306
  db-name: 'SuperiorSkyblock'
  user-name: 'root'
  password: 'root'
  prefix: ''
  useSSL: false
  allowPublicKeyRetrieval: true
  waitTimeout: 600000
  maxLifetime: 1800000

# Set the main command of the plugin.
# You can add aliases by adding "," after the command name, and split them using ",".
# You must have a full restart in order to apply changes for the command.
island-command: 'island,is,islands'

# Set the maximum island size. Island distances is 3 times bigger than the max size.
# Please, do not change it while you have a running islands world!
max-island-size: 200

# All the default values for new islands that are created.
default-values:
  # The default island size of all islands.
  # This island size can be expanded by using the /is admin setsize command.
  island-size: 20

  # Set the default block limits of islands.
  # This limit can be expanded by using the /is admin setblocklimit command.
  # You can find a list of materials here: https://bg-software.com/materials/
  block-limits:
    HOPPER: 8

  # Set the default entity limits of islands.
  # This limit can be expanded by using the /is admin setentitylimit command.
  # You can find a list of entities here: https://bg-software.com/entities/
  entity-limits:
    MINECART: 4

  # The amount of warps an island can have
  # This limit can be expanded by using the /is admin setwarpslimit command.
  warps-limit: 3

  # Set the default team limit of islands.
  # This limit can be expanded by using the /is admin setteamlimit command.
  team-limit: 4

  # Set the default coop limit of islands.
  # This limit can be expanded by using the /is admin setcooplimit command.
  coop-limit: 8

  # Set the default crop-growth multiplier of islands.
  # This multiplier can be expanded by using the /is admin setcropgrowth command.
  crop-growth: 1

  # Set the default spawner-rates multiplier of islands.
  # This multiplier can be expanded by using the /is admin setspawnerrates command.
  spawner-rates: 1

  # Set the default mob-drops multiplier of islands.
  # This multiplier can be expanded by using the /is admin setmobdrops command.
  mob-drops: 1

  # Set the default bank limit of islands.
  # Set it to -1 for no bank limits.
  bank-limit: -1

  # A list of default generator percentages for new islands.
  # Example: 'DIAMOND_BLOCK:50' will set 50% chance for diamond block.
  # You can find a list of materials here: https://bg-software.com/materials/
  generator:
    normal:
      COBBLESTONE: 95
      COAL_ORE: 5

  # A list of default role limits for new islands.
  # Example: '1:5' will set the limit of the role with the id 1 (Moderator by default) to 5.
  role-limits: [ ]`;

const SuperiorSkyblockPage: React.FC = () => {
  // Modified to omit the setter since we're not using it
  const [yamlContent] = useState<string>(initialYaml);
  
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="page-header">
            <h1>SuperiorSkyblock Configuration Editor</h1>
            <p className="lead">
              Edit your SuperiorSkyblock 2 plugin configuration with an interactive editor. 
              Make changes and download the updated YAML file.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <SuperiorSkyblockEditor initialYaml={yamlContent} />
        </Col>
      </Row>
    </Container>
  );
};

export default SuperiorSkyblockPage;