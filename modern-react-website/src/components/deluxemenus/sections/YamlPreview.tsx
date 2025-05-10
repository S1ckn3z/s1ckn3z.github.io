// src/components/deluxemenus/sections/YamlPreview.tsx
import React, { useState } from 'react';
import { Card, Button, Alert, Row, Col, Form, Tabs, Tab } from 'react-bootstrap';
import * as yaml from 'js-yaml';

interface YamlPreviewProps {
  yamlContent: string;
  formatYaml: (yaml: string) => string;
  currentMenu?: string;
  menuConfig?: Record<string, unknown>;
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ 
  yamlContent, 
  formatYaml, 
  currentMenu, 
  menuConfig 
}) => {
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('formatted');
  const [viewMode, setViewMode] = useState<'full' | 'menu'>('full');
  
  // Generate menu YAML if we have a current menu
  const menuYaml = currentMenu && menuConfig 
    ? yaml.dump(menuConfig, { indent: 2, lineWidth: -1, noRefs: true }) 
    : '';
  
  // Copy YAML to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(viewMode === 'full' ? yamlContent : menuYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format YAML with line numbers
  const formatWithLineNumbers = (yaml: string) => {
    const lines = yaml.split('\n');
    return lines.map((line, index) => (
      <div key={index} className="yaml-line">
        <span className="yaml-line-number">{index + 1}</span>
        <span 
          className="yaml-line-content"
          dangerouslySetInnerHTML={{ 
            __html: formatYaml(line) 
          }}
        />
      </div>
    ));
  };
  
  // Highlight search term in YAML
  const highlightSearch = (yaml: string, term: string) => {
    if (!term.trim()) {
      return formatWithLineNumbers(yaml);
    }
    
    const lines = yaml.split('\n');
    const regex = new RegExp(`(${term})`, 'gi');
    
    return lines.map((line, index) => {
      const hasMatch = line.toLowerCase().includes(term.toLowerCase());
      
      return (
        <div 
          key={index} 
          className={`yaml-line ${hasMatch ? 'yaml-line-highlight' : ''}`}
        >
          <span className="yaml-line-number">{index + 1}</span>
          <span 
            className="yaml-line-content"
            dangerouslySetInnerHTML={{ 
              __html: hasMatch 
                ? formatYaml(line).replace(regex, '<span class="yaml-search-highlight">$1</span>') 
                : formatYaml(line) 
            }}
          />
        </div>
      );
    });
  };
  
  // Count lines and characters
  const countStats = () => {
    const content = viewMode === 'full' ? yamlContent : menuYaml;
    const lines = content.split('\n').length;
    const chars = content.length;
    return { lines, chars };
  };
  
  const stats = countStats();

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>YAML Preview</span>
        <div className="d-flex align-items-center">
          {currentMenu && menuConfig && (
            <Form.Select 
              size="sm" 
              className="me-2" 
              style={{ width: 'auto' }}
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'full' | 'menu')}
            >
              <option value="full">Full Config</option>
              <option value="menu">Current Menu Only</option>
            </Form.Select>
          )}
          
          {copied && (
            <span className="text-success me-2">
              <i className="bi bi-check-circle me-1"></i>
              Copied!
            </span>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={copyToClipboard}
          >
            <i className="bi bi-clipboard me-1"></i>
            Copy
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search in YAML..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Alert variant="info" className="p-2 mb-0 d-flex align-items-center">
              <small>
                <strong>{stats.lines}</strong> lines, <strong>{stats.chars}</strong> characters
              </small>
            </Alert>
          </Col>
        </Row>
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
          className="mb-3"
        >
          <Tab 
            eventKey="formatted" 
            title={<><i className="bi bi-code me-1"></i>Formatted</>}
          >
            <div className="yaml-preview">
              {highlightSearch(viewMode === 'full' ? yamlContent : menuYaml, searchTerm)}
            </div>
          </Tab>
          <Tab 
            eventKey="raw" 
            title={<><i className="bi bi-file-text me-1"></i>Raw</>}
          >
            <pre className="yaml-preview yaml-raw">
              {viewMode === 'full' ? yamlContent : menuYaml}
            </pre>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default YamlPreview;
