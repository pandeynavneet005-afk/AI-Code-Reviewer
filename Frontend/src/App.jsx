import { useEffect, useState } from 'react';

import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import Toolbar from './components/Toolbar';
import ReviewPanel from './components/ReviewPanel';
import AuthPage from './components/AuthPage';
import ReviewHistory from './components/ReviewHistory';

import { useTheme } from './hooks/useTheme';
import { useCodeReview } from './hooks/useCodeReview';
import { getCurrentUser } from './services/authService';

function App() {
  const { theme, toggleTheme } = useTheme();

  // -------------------------------------------------------
  // Selected programming language
  // -------------------------------------------------------

  const [language, setLanguage] = useState('javascript');

  // -------------------------------------------------------
  // Current application page
  // reviewer | history
  // -------------------------------------------------------

  const [currentPage, setCurrentPage] = useState('reviewer');

  // -------------------------------------------------------
  // Code review
  // -------------------------------------------------------

  const {
    code,
    setCode,
    review,
    isLoading,
    error,
    runReview,
    clearAll,
  } = useCodeReview(language);

  // -------------------------------------------------------
  // Authentication state
  // -------------------------------------------------------

  const [token, setToken] = useState(() =>
    localStorage.getItem('token')
  );

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // -------------------------------------------------------
  // Check existing login
  // -------------------------------------------------------

  useEffect(() => {
    async function verifyUser() {
      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);

        setUser(data.user);
      } catch (err) {
        console.error(
          'Authentication verification failed:',
          err
        );

        localStorage.removeItem('token');

        setToken(null);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyUser();
  }, [token]);

  // -------------------------------------------------------
  // Successful login / registration
  // -------------------------------------------------------

  async function handleAuthSuccess(newToken) {
    try {
      localStorage.setItem('token', newToken);

      setToken(newToken);

      const data = await getCurrentUser(newToken);

      setUser(data.user);
      setCurrentPage('reviewer');
    } catch (err) {
      console.error('Unable to load user:', err);

      localStorage.removeItem('token');

      setToken(null);
      setUser(null);
    }
  }

  // -------------------------------------------------------
  // Logout
  // -------------------------------------------------------

  function handleLogout() {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
    setCurrentPage('reviewer');

    clearAll();
  }

  // -------------------------------------------------------
  // Checking authentication
  // -------------------------------------------------------

  if (checkingAuth) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <span>&lt;/&gt;</span>
          </div>

          <div className="auth-heading">
            <h1>
              AI Code <span>Reviewer</span>
            </h1>

            <p>Checking your account...</p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------
  // Not logged in
  // -------------------------------------------------------

  if (!token || !user) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // -------------------------------------------------------
  // Logged-in application
  // -------------------------------------------------------

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* User account/navigation bar */}

      <div className="user-session-bar">
        <div className="user-session-info">
          <div className="user-avatar">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : 'U'}
          </div>

          <div className="user-details">
            <span className="user-welcome">
              Welcome back
            </span>

            <strong>{user.name}</strong>
          </div>
        </div>

        <div className="user-session-actions">
          {/* Reviewer button */}

          <button
            type="button"
            className={
              currentPage === 'reviewer'
                ? 'session-nav-button active'
                : 'session-nav-button'
            }
            onClick={() => setCurrentPage('reviewer')}
          >
            Code Reviewer
          </button>

          {/* History button */}

          <button
            type="button"
            className={
              currentPage === 'history'
                ? 'session-nav-button active'
                : 'session-nav-button'
            }
            onClick={() => setCurrentPage('history')}
          >
            Review History
          </button>

          <span className="user-email">
            {user.email}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* --------------------------------------------------
          CODE REVIEWER PAGE
          -------------------------------------------------- */}

      {currentPage === 'reviewer' && (
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
      )}

      {/* --------------------------------------------------
          REVIEW HISTORY PAGE
          -------------------------------------------------- */}

      {currentPage === 'history' && (
        <ReviewHistory
          onBack={() => setCurrentPage('reviewer')}
        />
      )}

      {/* Footer */}

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