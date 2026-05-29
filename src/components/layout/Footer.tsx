import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      style={{
        background: '#111110',
        color: 'rgba(255,255,255,.7)',
        padding: '3rem 0 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                color: '#fff',
                fontSize: '1.4rem',
                marginBottom: '0.75rem',
              }}
            >
              Venue<span style={{ color: 'var(--olive)' }}>Vendors</span>
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>
              Melbourne's gold standard venue hiring platform, 
              connecting hirers with event spaces since 2016.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/sign-in', label: 'Sign In' },
                { to: '/sign-up', label: 'Sign Up' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} style={{ color: 'rgba(255,255,255,.6)', fontSize: '0.9rem', transition: 'color var(--t-fast)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span className="icon-text">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--olive)' }}>place</span>
                 520 Victoria Street, Melbourne, VIC 3000
              </span>
              <span className="icon-text">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--olive)' }}>email</span>
                info@venuevendors.com.au
              </span>
              <span className="icon-text">
                <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--olive)' }}>phone</span>
                +61 3 9256 1234
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,.1)',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
          }}
        >
          <span>© {new Date().getFullYear()} Venue Vendors Pty Ltd. All rights reserved.</span>
          <span>ABN 55 963 456 986 · Melbourne, Australia</span>
        </div>
      </div>
    </footer>
  )
}