import { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await loginUser(email, password);
      } else {
        data = await registerUser(name, email, password);
      }

      if (!data.token) {
        throw new Error('Authentication token was not received');
      }

      localStorage.setItem('token', data.token);

      if (onAuthSuccess) {
        onAuthSuccess(data.token);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function switchMode() {
    setIsLogin((current) => !current);
    setError('');
    setPassword('');
  }

  return (
    <div className="auth-page">
      <div className="auth-background-glow auth-glow-one"></div>
      <div className="auth-background-glow auth-glow-two"></div>

      <div className="auth-card">
        <div className="auth-logo">
          <span>&lt;/&gt;</span>
        </div>

        <div className="auth-heading">
          <h1>AI Code <span>Reviewer</span></h1>

          <p>
            {isLogin
              ? 'Welcome back. Sign in to continue reviewing your code.'
              : 'Create your account and start improving your code with AI.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Sign In
          </button>

          <button
            type="button"
            className={!isLogin ? 'auth-tab active' : 'auth-tab'}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : isLogin
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          <span>
            {isLogin
              ? "Don't have an account?"
              : 'Already have an account?'}
          </span>

          <button type="button" onClick={switchMode}>
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div className="auth-security">
          <span>●</span>
          Secure authentication powered by JWT
        </div>

        <div className="auth-footer-credit">
          Designed &amp; Developed by <strong>Navneet Pandey</strong>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;