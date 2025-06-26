import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  title: string;
  language: string;
  value: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, language, value }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor-header" onClick={toggleCollapse}>
        <h3>{title}</h3>
        <button className="collapse-btn">
          {isCollapsed ? '+' : '-'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="code-editor">
          <Editor
            height="300px"
            language={language}
            value={value}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CodeEditor; 