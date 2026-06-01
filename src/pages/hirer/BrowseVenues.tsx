import { useState, useMemo, useEffect } from 'react'
import { api } from '../../utils/api'
import type { Venue } from '../../types'

interface Props {
  onApply: () => void
}

const ALL_SUITABILITIES = [
  'Weddings', 'Corporate Events', 'Galas', 'Cocktail Parties',
  'Birthday Celebrations', 'Casual Gatherings', 'Conferences',
  'Exhibitions', 'Product Launches', 'Expos', 'Trade Shows',
  'Music Events', 'Creative Workshops', 'Social Events', 'Garden Parties', 'Art Exhibitions',
]

export default function BrowseVenues({ onApply }: Props) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [search, setSearch]     = useState('')
  const [locFilter, setLoc]     = useState('')
  const [capFilter, setCap]     = useState('')
  const [suitFilter, setSuit]   = useState('')
  const [selected, setSelected] = useState<Venue | null>(null)

  useEffect(() => {
    api.getVenues().then(setVenues).catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    return venues.filter(v => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
      const matchLoc = !locFilter || v.location.toLowerCase().includes(locFilter.toLowerCase())
      const matchCap = !capFilter || v.capacity >= Number(capFilter)
      const matchSuit = !suitFilter || v.suitability.some(s => s === suitFilter)
      return matchSearch && matchLoc && matchCap && matchSuit
    })
  }, [venues, search, locFilter, capFilter, suitFilter])

  return (
    <div>
      <h2 style={{ marginBottom: '0.35rem' }}>Browse Venues</h2>
      <p style={{ marginBottom: '1.75rem' }}>Discover Melbourne's finest event spaces.</p>

      {/* Search & filters */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-body" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '0.75rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Search</label>
              <div style={{ position: 'relative' }}>
                <span className="material-icons" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  search
                </span>
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Venue name or keyword..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Melbourne CBD"
                value={locFilter}
                onChange={e => setLoc(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Min. Capacity</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 100"
                value={capFilter}
                onChange={e => setCap(e.target.value)}
                min={0}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Event Type</label>
              <select className="form-select" value={suitFilter} onChange={e => setSuit(e.target.value)}>
                <option value="">All Types</option>
                {ALL_SUITABILITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {(search || locFilter || capFilter || suitFilter) && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: '0.75rem' }}
              onClick={() => { setSearch(''); setLoc(''); setCap(''); setSuit('') }}
            >
              <span className="material-icons" style={{ fontSize: '1rem' }}>clear</span>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
        Showing {filtered.length} of {venues.length} venues
      </p>

      {/* todo: make search bar uncovered */}
      <div style={{ position: 'relative', minHeight: '60vh' }}>
        {filtered.length === 0 ? (
          <div className="card">
            <div className="card-body text-center" style={{ padding: '3rem' }}>
              <span className="material-icons" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}>
                search_off
              </span>
              <h4>No venues found</h4>
              <p>Try adjusting your search criteria.</p>
            </div>
          </div>
        ) : (
          <div className="venue-grid section-animate">
            {filtered.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onSelect={() => setSelected(venue)}
              />
            ))}
          </div>
        )}

        {/* todo: make sure it does not cover the search bar */}
        {selected && (
          <VenueModal
            venue={selected}
            onClose={() => setSelected(null)}
            onApply={() => { setSelected(null); onApply() }}
          />
        )}
      </div>
    </div>
  )
}

function VenueCard({ venue, onSelect }: { venue: Venue; onSelect: () => void }) {
  return (
    <div
      className={`venue-card${venue.isBlocked ? ' blocked' : ''}`}
      onClick={venue.isBlocked ? undefined : onSelect}
      role="button"
      tabIndex={venue.isBlocked ? -1 : 0}
      onKeyDown={e => e.key === 'Enter' && !venue.isBlocked && onSelect()}
    >
      <div style={{ position: 'relative' }}>
        <img src={venue.imageUrl} alt={venue.name} className="venue-card-img" />
        {venue.isBlocked && (
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span className="badge badge-blocked" style={{ fontSize: '0.85rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem' }}>block</span>
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="venue-card-body">
        <div className="venue-card-name">{venue.name}</div>
        <div className="venue-card-location">
          <span className="material-icons" style={{ fontSize: '0.9rem' }}>place</span>
          {venue.location.split(',').slice(-2).join(',').trim()}
        </div>
        <div className="venue-card-tags">
          {venue.suitability.slice(0, 2).map(s => <span key={s} className="venue-tag">{s}</span>)}
          {venue.suitability.length > 2 && (
            <span className="venue-tag">+{venue.suitability.length - 2}</span>
          )}
        </div>
        <div className="venue-card-meta">
          <span className="venue-capacity">
            <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>group</span>{' '}
            Up to {venue.capacity.toLocaleString()}
          </span>
          <span className="venue-price">${venue.pricePerHour}/hr</span>
        </div>
      </div>
    </div>
  )
}

function VenueModal({ venue, onClose, onApply }: { venue: Venue; onClose: () => void; onApply: () => void }) {
  return (
    <div
      style={{
        // absolute so it only overlays the venue grid, not the search bar above
        position: 'absolute', inset: 0,
        background: 'rgba(28,28,26,.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '2rem',
        animation: 'fadeOverlay .2s ease forwards',
        borderRadius: 'var(--r-lg)',
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 60px rgba(0,0,0,.3)',
          maxWidth: 600, width: '100%',
          // overflow hidden here is what clips the image to the border-radius corners
          overflow: 'hidden',
          margin: '0 1.5rem',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image with close button */}
        <div style={{ position: 'relative' }}>
          <img
            src={venue.imageUrl}
            alt={venue.name}
            style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(0,0,0,.55)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
              transition: 'background var(--t-fast)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.8)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,.55)')}
          >
            <span className="material-icons" style={{ fontSize: '1.1rem' }}>close</span>
          </button>
        </div>

        {/* Inner scroll div so overflow:hidden on the card doesn't block scrolling */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto' }}>
          <div className="card-body">
            <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{venue.name}</h3>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--olive)' }}>
                ${venue.pricePerHour}/hr
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
              <span className="material-icons" style={{ fontSize: '1rem', color: 'var(--olive)' }}>place</span>
              {venue.location}
            </p>

            <p style={{ marginBottom: '1.25rem', lineHeight: 1.75 }}>{venue.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--r)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--charcoal)' }}>{venue.capacity.toLocaleString()} guests</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--r)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suitable For</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--charcoal)' }}>{venue.suitability.join(', ')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onApply}>
                <span className="material-icons">send</span>
                Apply for This Venue
              </button>
              <button className="btn btn-outline" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}