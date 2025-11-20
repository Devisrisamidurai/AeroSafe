import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plane, Key, User } from 'lucide-react'

const PilotLogin = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pilotId, setPilotId] = useState('')
  const [remember, setRemember] = useState(true)
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const s = location?.state || {}
    if (s?.demoEmail) setEmail(s.demoEmail)
    if (s?.demoPassword) setPassword(s.demoPassword)
    if (s?.pilotId) setPilotId(s.pilotId)
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
        body: JSON.stringify({ email, password, role: 'Pilot', pilotId })
      })

      const body = await res.json()

      if (!res.ok) {
        setError(body?.message || 'Login failed')
        setLoading(false)
        return
      }

      if (body?.token) {
        if (remember) localStorage.setItem('token', body.token)
        else sessionStorage.setItem('token', body.token)
      }
      if (body?.user) {
        if (remember) localStorage.setItem('user', JSON.stringify(body.user))
        else sessionStorage.setItem('user', JSON.stringify(body.user))
      }

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
        <div className="signup-icon pilot">
          <Plane aria-hidden="true" />
        </div>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <User size={20} /> Pilot Login
        </h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="pilot-email">Email ID</label>
            <input
              id="pilot-email"
              name="email"
              type="email"
              placeholder="pilot@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pilot-id">Pilot ID</label>
            <input
              id="pilot-id"
              name="pilotId"
              type="text"
              placeholder="AS-PLT-001"
              value={pilotId}
              onChange={(e) => setPilotId(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="pilot-password">Password <Key size={14} style={{ verticalAlign: 'middle', marginLeft: '6px' }} /></label>
            <input
              id="pilot-password"
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
          <a href="/pilot-signup" className="landing-link">
            Signup
          </a>
        </p>

        <div className="toggle-wrapper">
          <button
            className="toggle-switch"
            type="button"
            aria-label="Switch to admin login"
            onClick={() => navigate('/admin-login')}
          >
            <span className="toggle-indicator" />
          </button>
          <p className="toggle-label">Admin Login</p>
        </div>
      </section>
    </main>
  )
}

export default PilotLogin
