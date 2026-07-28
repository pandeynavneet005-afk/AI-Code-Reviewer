import Editor from 'react-simple-code-editor';
import prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

export default function CodeEditor({ code, onChange, disabled }) {
  const charCount = code.length;

  return (
    <div className="panel editor-panel">
      <div className="panel-header">
        <span className="panel-title">Editor</span>
        <span className="panel-meta">{charCount.toLocaleString()} characters</span>
      </div>

      <div className="editor-scroll">
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={(value) => prism.highlight(value, prism.languages.javascript, 'javascript')}
          padding={16}
          disabled={disabled}
          placeholder="Paste or write your code here..."
          textareaId="code-editor-textarea"
          className="code-editor"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            fontSize: 14,
            lineHeight: 1.6,
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}
