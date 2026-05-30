import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../contexts/AuthContext'
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
} from '../utils/validation'
import type { UserRole } from '../types'

type FormErrors = {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  phone?: string
}

export default function SignUp() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole>('hirer')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return (
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      name.trim() !== '' &&
      phone.trim() !== ''
    )
  }, [email, password, confirmPassword, name, phone])

  const validateForm = () => {
    const nextErrors: FormErrors = {}

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    const nameError = validateName(name)
    const phoneError = validatePhone(phone)

    if (emailError) nextErrors.email = emailError
    if (passwordError) nextErrors.password = passwordError
    if (nameError) nextErrors.name = nameError
    if (phoneError) nextErrors.phone = phoneError

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please correct the highlighted errors before registering.' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    const result = await signup(email, password, name, phone, role)

    setIsSubmitting(false)

    if (!result.success || !result.user) {
      if (result.errors) {
        setErrors(result.errors)
        setMessage({ type: 'error', text: 'Please fix the validation errors below.' })
      } else {
        setMessage({ type: 'error', text: result.message })
      }
      return
    }

    setMessage({ type: 'success', text: result.message })

    setTimeout(() => {
      navigate(role === 'vendor' ? '/vendor' : '/hirer')
    }, 1500)
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
            'radial-gradient(circle at top right, rgba(110,139,117,.12), transparent 35%), linear-gradient(160deg, #F8FAFC 0%, #E2E8F0 100%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 520 }} className="animate-fade">
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
                person_add
              </span>
            </div>

            <h2 style={{ marginBottom: '0.4rem' }}>Create Account</h2>
            <p>Join Melbourne's leading venue hiring community</p>
          </div>

          {message && (
            <div className={`alert alert-${message.type} animate-fade`}>
              <span className="material-icons" style={{ fontSize: '1.1rem' }}>
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            <div className="card-body" style={{ padding: '2rem' }}>
              
              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Choose Your Role</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('hirer')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 'var(--r)',
                      border: role === 'hirer' ? '2px solid var(--olive)' : '1px solid var(--border)',
                      background: role === 'hirer' ? 'rgba(110,139,117,0.1)' : 'var(--bg-card)',
                      color: role === 'hirer' ? 'var(--olive)' : 'var(--text)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all var(--t-fast)'
                    }}
                  >
                    <span className="material-icons">event</span>
                    Hirer (Organiser)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: 'var(--r)',
                      border: role === 'vendor' ? '2px solid var(--olive)' : '1px solid var(--border)',
                      background: role === 'vendor' ? 'rgba(110,139,117,0.1)' : 'var(--bg-card)',
                      color: role === 'vendor' ? 'var(--olive)' : 'var(--text)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all var(--t-fast)'
                    }}
                  >
                    <span className="material-icons">storefront</span>
                    Vendor (Venue Owner)
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name *</label>
                <input
                  id="name"
                  type="text"
                  className={`form-input${errors.name ? ' error' : ''}`}
                  value={name}
                  onChange={event => {
                    setName(event.target.value)
                    setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value)
                    setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number *</label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-input${errors.phone ? ' error' : ''}`}
                  value={phone}
                  onChange={event => {
                    setPhone(event.target.value)
                    setErrors(prev => ({ ...prev, phone: undefined }))
                  }}
                  placeholder="0488 123 456"
                  autoComplete="tel"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
                <span className="form-hint">Enter an Australian number (starts with 04 or +61).</span>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password *</label>
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
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
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
                <span className="form-hint">Must include uppercase, lowercase, a number, and a special character (!@#$%^&*).</span>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input${errors.confirmPassword ? ' error' : ''}`}
                    value={confirmPassword}
                    onChange={event => {
                      setConfirmPassword(event.target.value)
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                    }}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    style={{ paddingRight: '2.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(value => !value)}
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
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSubmit || isSubmitting}
                style={{ width: '100%', marginTop: '1rem' }}
              >
                <span className="material-icons">person_add</span>
                {isSubmitting ? 'Creating Account...' : 'Register Securely'}
              </button>
            </div>
          </form>

          <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/sign-in" style={{ color: 'var(--charcoal)', fontWeight: 700 }}>
              Sign In Instead
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
