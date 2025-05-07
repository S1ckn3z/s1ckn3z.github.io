// src/pages/WildStackerPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './WildStackerPage.css';
import UnifiedConfigEditor from '../components/wildstacker/UnifiedConfigEditor';

// Initial YAML content from the config.yml file
const initialYaml = `###############################################
##                                           ##
##         WildStacker Configuration         ##
##            Developed by Ome_R             ##
##                                           ##
###############################################

# How should the item that is given to players by the give command be called?
# {0} represents stack size
# {1} represents entity/block type
# {2} represents item type (Egg / Spawner / Barrel)
give-item-name: '&6x{0} &f&o{1} {2}'

# The inspect tool of the plugin.
# When clicking an item, entity, barrel or spawner, all the information
# about the object will be displayed to the player.
inspect-tool:
  type: STICK
  name: '&6Inspect Tool'
  lore:
  - '&7Click on an object to get more details about it.'

# The simulate tool of the plugin.
# You can check if two objects can stack together using this tool.
simulate-tool:
  type: STICK
  name: '&6Simulate Tool'
  lore:
  - '&7Click on two objects to check if they can stack together.'

# Settings related to database.
database:
  # Should data of worlds that no longer exist be deleted?
  delete-invalid-worlds: false

# Settings related to the automatic kill all
kill-task:
  # How much time should be passed between auto-killing? (in seconds)
  # If you wish to disable the auto-killing task, set the interval to 0.
  interval: 0
  # Should the kill task remove stacked entities?
  stacked-entities: true
  # Should the kill task remove unstacked entities?
  unstacked-entities: true
  # Should the kill task remove stacked items?
  stacked-items: true
  # Should the kill task remove unstacked items?
  unstacked-items: true
  # When enabled, the plugin will remove all stacked-entities when clearlagg removes items & entities.
  # This feature will work if the interval is set to 0 - these are two different features!
  sync-clear-lagg: false
  # Set a command for getting the next time until kill task will happen.
  # You can split multiple commands using ",".
  # You can set it to '' in order to disable this feature.
  time-command: stacker timeleft

# Here you can configurable all features related to stacked items.
items:
  # Should items get stacked on the server?
  enabled: false

  # How many blocks from the item should be checked for other items to stack into?
  merge-radius:
    all: 5

  # Custom display-name for the items on ground.
  # If you don't want a display-name, use "custom-name: ''"
  # {0} represents stack amount
  # {1} represents display name
  # {2} represents display name in upper case
  custom-name: '&6x{0} &f&o{1}'

  # Blacklisted items are items that won't get stacked.
  blacklist:
  - EXAMPLE_ITEM

  # Whitelisted items are items that will get stacked.
  # If you wish to disable whitelisted items, use "whitelist: []"
  whitelist: []

  # A list of worlds items won't get stacked inside them (case-sensitive)
  disabled-worlds:
  - disabled_world

  # Set a maximum amount of item objects in a chunk.
  # If you want to disable the feature, set it to 0.
  chunk-limit: 0

  # Should particles be spawned when an entity gets stacked?
  particles: true

  # When enabled, all items will have a custom name (even if not stacked)
  unstacked-custom-name: false

  # When fix-stack is disabled, items with a max-stack of 1 will be added to inventories
  # with a max-stack size of 64. If a player picks up 80 picks, he will get 64 + 16, instead
  # of 80 different items.
  fix-stack: false

  # When item-display is enabled, the item's name will be displayed instead of it's type
  # This will take place on all items, and can only be overridden by custom-display section.
  item-display: false

  # Should pickup-sound be enabled for stacked items?
  pickup-sound: true

  # Should items with the max pickup delay get stacked (items that shouldn't be picked up in first place)
  max-pickup-delay: false

  # How much time should be passed between auto-stacking? (in ticks)
  # If you wish to disable the auto-stacking task, set the stack-interval to 0.
  # By default, all items are stacked once, when they spawn.
  stack-interval: 0

  # Should entities get stored into the database?
  store-items: true

# Here you can configurable all features related to stacked entities.
entities:
  # Should entities get stacked on the server?
  enabled: true

  # How many blocks from the entity should be checked for other entities to stack into?
  merge-radius:
    all: 10

  # Custom display-name for the entities.
  # If you don't want a display-name, use "custom-name: ''"
  # {0} represents stack amount
  # {1} represents entity type
  # {2} represents entity type in upper case
  # {3} represents the upgrade's display name
  custom-name: '&6x{0} &f&o{1}{3}'

  # Blacklisted entities are entities that won't get stacked.
  blacklist: []

  # Whitelisted entities are entities that will get stacked.
  whitelist:
  - SPIDER
  - CAVE_SPIDER
  - CREEPER
  - SKELETON
  - ZOMBIE

  # A list of worlds entities won't get stacked inside them (case-sensitive)
  disabled-worlds:
  - disabled_world

  # Set a maximum amount of entity objects in a chunk.
  # If you want to disable the feature, set it to 0.
  chunk-limit: 0

  # Should particles be spawned when an entity gets stacked?
  particles: true

  # A list of WorldGuard regions entities won't get stacked inside them (case-sensitive)
  disabled-regions: []

  # Blacklisted names is a list of names that when an entity has this name, it won't get stacked.
  # Color codes are supported, as well as regex.
  name-blacklist: []

  # How much time should be passed between auto-stacking? (in ticks)
  # If you wish to disable the auto-stacking task, set the stack-interval to 0.
  stack-interval: 4

  # Linked-entities are entities that are linked to one spawner or more.
  # A spawner that has an entity linked to, will try to stack it's entities first to the linked one.
  linked-entities:
    # Should entities be linked to spawners?
    enabled: false
    # The maximum distance that the linked entity can be from the spawner.
    max-distance: 10

# Here you can configurable all features related to stacked spawners.
spawners:
  # Should spawners get stacked on the server?
  enabled: false

  # How many blocks from the spawner should be checked for other spawners to stack into?
  merge-radius:
    all: 1

  # Custom hologram for the spawners.
  # If you don't want a hologram, use "custom-name: ''"
  # {0} represents stack amount
  # {1} represents entity type
  # {2} represents entity type in upper case
  # {3} represents the upgrade's display name
  custom-name: '&6x{0} &f&o{1}{3}'

  # Blacklisted spawners are spawners that won't get stacked.
  blacklist: []

  # Whitelisted spawners are spawners that will get stacked.
  # If you wish to disable whitelisted spawners, use "whitelist: []"
  whitelist: []

  # A list of worlds spawners won't get stacked inside them (case-sensitive)
  disabled-worlds:
  - disabled_world

  # Set a maximum amount of spawner objects in a chunk.
  # If you want to disable the feature, set it to 0.
  chunk-limit: 0

  # Should particles be spawned when an entity gets stacked?
  particles: true

  # When enabled, the plugin will try to find a spawner in the whole chunk instead
  # of only in the provided radius. merge-radius will be overridden, and will be used
  # as a y-level range only.
  chunk-merge: false

# Here you can configurable all features related to stacked barrels (aka stacked blocks).
barrels:
  # Should blocks get stacked into barrels on the server?
  enabled: false

  # How many blocks from the barrel should be checked for other blocks to stack into?
  merge-radius:
    all: 1

  # Custom hologram for the barrels.
  # If you don't want a hologram, use "custom-name: ''"
  # {0} represents stack amount
  # {1} represents barrel type
  # {2} represents barrel type in upper case
  custom-name: '&6x{0} &f&o{1}'

  # Blacklisted barrels are barrels that won't get stacked.
  blacklist: []

  # Whitelisted blocks are blocks that will get stacked.
  # If you wish to disable whitelisted barrels, use "whitelist: []"
  whitelist: []

  # A list of worlds barrels won't get stacked inside them (case-sensitive)
  disabled-worlds:
  - disabled_world

  # Set a maximum amount of barrel objects in a chunk.
  # If you want to disable the feature, set it to 0.
  chunk-limit: 0

  # Should particles be spawned when an entity gets stacked?
  particles: true

  # When enabled, the plugin will try to find a block in the whole chunk instead
  # of only in the provided radius. merge-radius will be overridden, and will be used
  # as a y-level range only.
  chunk-merge: false

# Here you can configurable all features related to stacked buckets
buckets:
  # Should buckets get stacked on the server?
  enabled: false

  # A list of blacklisted bucket names.
  name-blacklist:
  - '&fGenbucket'

  # The new max-stack size for buckets. Must be a number between 1 and 64.
  max-stack: 16

# Here you can configurable all features related to stacked stews
stews:
  # Should stews get stacked on the server?
  enabled: false

  # The new max-stack size for stews. Must be a number between 1 and 64.
  max-stack: 16`;

const WildStackerPage: React.FC = () => {
  // State to hold the YAML content
  const [yamlContent, setYamlContent] = useState<string>(initialYaml);
  
  // Load the config.yml file from the server if needed
  useEffect(() => {
    // This could be replaced with an actual API call to load the config
    // For now, we're using the hardcoded initialYaml
    setYamlContent(initialYaml);
  }, []);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="page-header">
            <h1>WildStacker Configuration Editor</h1>
            <p className="lead">
              Edit your WildStacker plugin configuration with an interactive editor. 
              Make changes and download the updated YAML file.
            </p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <UnifiedConfigEditor initialYaml={yamlContent} />
        </Col>
      </Row>
    </Container>
  );
};

export default WildStackerPage;
