import { useState } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import ReviewPanel from './components/ReviewPanel';
import { useTheme } from './hooks/useTheme';
import { useCodeReview } from './hooks/useCodeReview';

function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    code,
    setCode,
    review,
    isLoading,
    error,
    runReview,
    clearAll,
  } = useCodeReview();

  // Selected programming language
  const [language, setLanguage] = useState('javascript');

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        <section className="editor-column">
          <CodeEditor
            code={code}
            onChange={setCode}
            disabled={isLoading}
            language={language}
            onLanguageChange={setLanguage}
          />

          <Toolbar
            onReview={runReview}
            onClear={clearAll}
            isLoading={isLoading}
            disabled={!code.trim()}
          />
        </section>

        <section className="review-column">
          <ReviewPanel
            review={review}
            isLoading={isLoading}
            error={error}
          />
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-brand">
            AI Code Reviewer
          </span>

          <span className="footer-divider">•</span>

          <span className="footer-credit">
            Designed &amp; Developed by
            <strong> Navneet Pandey</strong>
          </span>

          <span className="footer-divider">•</span>

          <span className="footer-powered">
            Powered by Gemini AI
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;