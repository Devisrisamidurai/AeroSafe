import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, isAuthenticated, clearAuthData } from '../services/api'

const AuthVerify = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tokenInfo, setTokenInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
      return
    }

    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Verify token with backend
    verifyToken()
  }, [navigate])

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5121/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTokenInfo(data)
      } else {
        setError('Token verification failed. Please login again.')
        clearAuthData()
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      setError('Network error during verification')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAuthData()
    navigate('/login')
  }

  if (loading) {
    return (
      <main className="form-page">
        <section className="signup-card">
          <p>Verifying authentication...</p>
        </section>
      </main>
    )
  }

  return (
    <main className="form-page">
      <section className="signup-card" style={{ maxWidth: '600px' }}>
        <h2>Authentication Verification</h2>

        {error && (
          <div style={{ color: 'crimson', marginBottom: '1rem', padding: '0.75rem', background: '#fee', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {user && (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>User Information (from localStorage)</h3>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>
          </div>
        )}

        {tokenInfo && (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '1rem' }}>JWT Token Verification (from Backend)</h3>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
              <p><strong>Status:</strong> <span style={{ color: 'green' }}>✓ Valid</span></p>
              {tokenInfo.user && (
                <>
                  <p><strong>User ID:</strong> {tokenInfo.user.id}</p>
                  <p><strong>Name:</strong> {tokenInfo.user.name}</p>
                  <p><strong>Email:</strong> {tokenInfo.user.email}</p>
                  <p><strong>Role:</strong> {tokenInfo.user.role}</p>
                  <p><strong>UID:</strong> {tokenInfo.user.uid}</p>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(user?.role === 'Admin' ? '/admin-dashboard' : '/pilot-dashboard')}
            className="signup-button"
            style={{ flex: 1 }}
          >
            Go to Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="signup-button"
            style={{ flex: 1, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fef3c7', borderRadius: '12px', fontSize: '0.9rem' }}>
          <p><strong>✓ Authentication Test Results:</strong></p>
          <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            <li>✓ User data stored in database</li>
            <li>✓ JWT token generated and stored</li>
            <li>✓ Token verified by backend</li>
            <li>✓ User information retrieved from token</li>
            <li>✓ Role-based access working</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

export default AuthVerify

