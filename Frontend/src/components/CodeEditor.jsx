import Editor from 'react-simple-code-editor';
import prism from 'prismjs';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';

const LANGUAGES = {
  javascript: {
    label: 'JavaScript',
    extension: 'js',
    prismLanguage: 'javascript',
  },
  python: {
    label: 'Python',
    extension: 'py',
    prismLanguage: 'python',
  },
  java: {
    label: 'Java',
    extension: 'java',
    prismLanguage: 'java',
  },
  c: {
    label: 'C',
    extension: 'c',
    prismLanguage: 'c',
  },
  cpp: {
    label: 'C++',
    extension: 'cpp',
    prismLanguage: 'cpp',
  },
  csharp: {
    label: 'C#',
    extension: 'cs',
    prismLanguage: 'csharp',
  },
  typescript: {
    label: 'TypeScript',
    extension: 'ts',
    prismLanguage: 'typescript',
  },
  php: {
    label: 'PHP',
    extension: 'php',
    prismLanguage: 'php',
  },
};

function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

export default function CodeEditor({
  code,
  onChange,
  disabled,
  language = 'javascript',
  onLanguageChange,
}) {
  const charCount = code.length;

  const selectedLanguage =
    LANGUAGES[language] || LANGUAGES.javascript;

  const prismGrammar =
    prism.languages[selectedLanguage.prismLanguage] ||
    prism.languages.javascript;

  return (
    <div className="panel editor-panel">
      <div className="panel-header editor-header">
        <div className="panel-heading">
          <div className="panel-icon">
            <CodeIcon />
          </div>

          <div>
            <span className="panel-title">Code Editor</span>

            <span className="panel-subtitle">
              Paste or write the code you want to review
            </span>
          </div>
        </div>

        <div className="editor-header-meta">

          <div className="language-selector-wrapper">

            <span
              className="language-status-dot"
              aria-hidden="true"
            />

            <select
              className="language-select"
              value={language}
              onChange={(event) =>
                onLanguageChange?.(event.target.value)
              }
              disabled={disabled}
              aria-label="Select programming language"
            >
              {Object.entries(LANGUAGES).map(
                ([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                )
              )}
            </select>

            <span
              className="language-chevron"
              aria-hidden="true"
            >
              <ChevronIcon />
            </span>

          </div>

          <span className="panel-meta">
            {charCount.toLocaleString()} characters
          </span>
        </div>
      </div>

      <div className="editor-filebar">
        <div className="file-tab">
          <span
            className="file-status-dot"
            aria-hidden="true"
          />

          <span>
            code.{selectedLanguage.extension}
          </span>
        </div>

        <span className="editor-hint">
          AI-assisted code analysis
        </span>
      </div>

      <div className="editor-scroll">
        <Editor
          value={code}
          onValueChange={onChange}
          highlight={(value) =>
            prism.highlight(
              value,
              prismGrammar,
              selectedLanguage.prismLanguage
            )
          }
          padding={20}
          disabled={disabled}
          placeholder={`Paste or write your ${selectedLanguage.label} code here...`}
          textareaId="code-editor-textarea"
          className="code-editor"
          style={{
            fontFamily:
              '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
            fontSize: 14,
            lineHeight: 1.7,
            minHeight: '100%',
          }}
        />
      </div>
    </div>
  );
}