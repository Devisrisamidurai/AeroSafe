import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, Key, User } from 'lucide-react'
import { useEffect } from 'react'

const AdminLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const s = location?.state || {}
    if (s?.demoEmail) setEmail(s.demoEmail)
    if (s?.demoPassword) setPassword(s.demoPassword)
    if (s?.adminId) setAdminId(s.adminId)
    if (typeof s?.remember !== 'undefined') setRemember(s.remember)
  }, [location])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const isValidEmail = (e) => /^\S+@\S+\.\S+$/.test(e)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'Admin', adminId })
      })

      const body = await res.json()

      if (!res.ok) {
        setError(body?.message || 'Login failed')
        setLoading(false)
        return
      }

      // Save token and user info (respect 'remember me')
      if (body?.token) {
        if (remember) {
          localStorage.setItem('token', body.token)
        } else {
          sessionStorage.setItem('token', body.token)
        }
      }
      if (body?.user) {
        if (remember) {
          localStorage.setItem('user', JSON.stringify(body.user))
        } else {
          sessionStorage.setItem('user', JSON.stringify(body.user))
        }
      }

      // Navigate to landing or admin dashboard
      navigate('/')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="form-page">
      <section className="signup-card">
        <div className="signup-icon">
          <ShieldCheck aria-hidden="true" />
        </div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={20} /> Admin Login
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-email">Email ID</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-id">Admin ID</label>
            <input
              id="admin-id"
              name="adminId"
              type="text"
              placeholder="AS-ADM-001"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">Password <Key size={14} style={{ verticalAlign: 'middle', marginLeft: '6px' }} /></label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" style={{ fontSize: '0.9rem' }}>Remember me</label>
            <a href="#" style={{ marginLeft: 'auto', fontSize: '0.9rem' }} onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {error && <p style={{ color: 'crimson' }}>{error}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="login-cta">
          Don't have an account?{' '}
          <a href="/admin-signup" className="landing-link">
            Signup
          </a>
        </p>

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to pilot login"
            onClick={() => navigate('/pilot-login')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Pilot Login</p>
        </div>
      </section>
    </main>
  )
}

export default AdminLogin

