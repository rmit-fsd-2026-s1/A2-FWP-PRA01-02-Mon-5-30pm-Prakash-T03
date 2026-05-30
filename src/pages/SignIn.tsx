import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { validateEmail, validatePassword } from '../utils/validation'

type FormErrors = {
  email?: string
  password?: string
  captcha?: string
}

function createCaptcha() {
  const first = Math.floor(Math.random() * 8) + 2
  const second = Math.floor(Math.random() * 8) + 2
  return {
    question: `${first} + ${second}`,
    answer: String(first + second),
  }
}

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [captcha, setCaptcha] = useState(createCaptcha)

  const canSubmit = useMemo(() => {
    return email.trim() !== '' && password.trim() !== '' && captchaInput.trim() !== ''
  }, [email, password, captchaInput])

  const validateForm = () => {
    const nextErrors: FormErrors = {}

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError

    if (captchaInput.trim() !== captcha.answer) {
      nextErrors.captcha = 'CAPTCHA answer is incorrect.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha())
    setCaptchaInput('')
    setErrors(prev => ({ ...prev, captcha: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the highlighted fields before signing in.' })
      return
    }

    const result = await login(email, password)

    if (!result.success || !result.user) {
      setMessage({ type: 'error', text: result.message })
      refreshCaptcha()
      return
    }

    setMessage({ type: 'success', text: result.message })

    const userRole = result.user.role

    setTimeout(() => {
      navigate(userRole === 'vendor' ? '/vendor' : '/hirer')
    }, 700)
  }

  return (
    <>
      <Navbar />

      <section
        style={{
          minHeight: 'calc(100vh - 180px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          background:
            'radial-gradient(circle at top left, rgba(14,165,233,.14), transparent 35%), linear-gradient(160deg, #F8FAFC 0%, #E0F2FE 100%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 460 }} className="animate-fade">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, var(--charcoal), var(--olive))',
                borderRadius: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span className="material-icons" style={{ color: '#fff', fontSize: '1.8rem' }}>
                shield
              </span>
            </div>

            <h2 style={{ marginBottom: '0.4rem' }}>Secure Sign In</h2>
            <p>Access your VenueFlow hirer or vendor workspace</p>
          </div>

          {message && (
            <div className={`alert alert-${message.type} animate-fade`}>
              <span className="material-icons" style={{ fontSize: '1.1rem' }}>
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {message.text}
            </div>
          )}

          <div className="alert alert-info" style={{ marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <span className="material-icons" style={{ fontSize: '1rem' }}>info</span>
            <div>
              <strong>Demo accounts:</strong><br />
              Hirer: hirer@vv.com / Password1!<br />
              Vendor: vendor@vv.com / Password1!
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card">
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value)
                    setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input${errors.password ? ' error' : ''}`}
                    value={password}
                    onChange={event => {
                      setPassword(event.target.value)
                      setErrors(prev => ({ ...prev, password: undefined }))
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="material-icons">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="captcha" className="form-label">Security Check</label>
                <div className="form-row" style={{ alignItems: 'center' }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--r)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      fontWeight: 700,
                      color: 'var(--charcoal-dark)',
                    }}
                  >
                    What is {captcha.question}?
                  </div>
                  <button type="button" className="btn btn-ghost" onClick={refreshCaptcha}>
                    Refresh
                  </button>
                </div>

                <input
                  id="captcha"
                  type="text"
                  className={`form-input${errors.captcha ? ' error' : ''}`}
                  value={captchaInput}
                  onChange={event => {
                    setCaptchaInput(event.target.value)
                    setErrors(prev => ({ ...prev, captcha: undefined }))
                  }}
                  placeholder="Enter answer"
                />
                {errors.captcha && <span className="form-error">{errors.captcha}</span>}
                <span className="form-hint">
                  This CAPTCHA is included to meet the postgraduate sign-in security requirement.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSubmit}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <span className="material-icons">login</span>
                Sign In Securely
              </button>
            </div>
          </form>

          <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Need an account?{' '}
            <Link to="/sign-up" style={{ color: 'var(--charcoal)', fontWeight: 700 }}>
              View registration details
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}