import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authAPI, saveAuthData } from '../services/api'
import { ShieldCheck, Plane } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Admin') // 'Admin' or 'Pilot'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = (e) => /^\S+@\S+\.\S+$/.test(e)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(email, password, role)

      if (response.success && response.token) {
        saveAuthData(response.token, response.user)
        // Navigate to verification page to test authentication
        navigate('/verify')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="form-page">
      <section className="signup-card">
        <div className={`signup-icon ${role === 'Pilot' ? 'pilot' : ''}`}>
          {role === 'Admin' ? <ShieldCheck aria-hidden="true" /> : <Plane aria-hidden="true" />}
        </div>
        <h2>{role} Login</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email ID</label>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder={role === 'Admin' ? 'admin@example.com' : 'pilot@example.com'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-role">Role</label>
            <select
              id="login-role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                borderRadius: '14px',
                border: '1px solid rgba(148, 163, 184, 0.6)',
                padding: '0.85rem 1rem',
                fontSize: '1rem',
                background: '#f8fafc',
                color: '#0f172a',
              }}
            >
              <option value="Admin">Admin</option>
              <option value="Pilot">Pilot</option>
            </select>
          </div>

          {error && <p style={{ color: 'crimson', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-cta">
          Don't have an account?{' '}
          <a
            href={role === 'Admin' ? '/admin-signup' : '/pilot-signup'}
            className="landing-link"
            onClick={(e) => {
              e.preventDefault()
              navigate(role === 'Admin' ? '/admin-signup' : '/pilot-signup')
            }}
          >
            Signup
          </a>
        </p>
      </section>
    </main>
  )
}

export default Login

