import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header
      style={{
        background: '#111110',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(92,107,69,.25)',
      }}
    >
      <div className="container flex-between" style={{ gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: '#5C6B45',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            VV
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,.5)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Melbourne
          </span>
        </Link>
        <p
          style={{
            color: 'rgba(255,255,255,.5)',
            fontSize: '0.78rem',
            letterSpacing: '0.06em',
          }}
        >
          ABN 55 123 456 789
        </p>
      </div>
    </header>
  )
}