import React from 'react';
import { Card, Button } from 'react-bootstrap';

interface YamlPreviewProps {
  yamlContent: string;
  formatYaml: (yaml: string) => string;
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ yamlContent, formatYaml }) => {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>YAML Preview</span>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(yamlContent);
          }}
        >
          <i className="bi bi-clipboard me-1"></i>
          Copy
        </Button>
      </Card.Header>
      <Card.Body>
        <div 
          className="yaml-preview" 
          dangerouslySetInnerHTML={{ __html: formatYaml(yamlContent) }}
        />
      </Card.Body>
    </Card>
  );
};

export default YamlPreview;
