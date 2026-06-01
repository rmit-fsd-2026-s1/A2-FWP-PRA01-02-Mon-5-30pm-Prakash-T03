import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'
import type { Venue } from '../../types'
import { validateRequired, validatePositiveNumber, validateDate } from '../../utils/validation'

// Validation rules for hire application:
// Venue must be selected from the dropdown (can't submit without one).
// Guest count must be positive AND cannot exceed venue's max capacity.
// Event date must be in the future (past dates are rejected).
// Duration: 1–24 hours only (cannot be hired for more than a day).
// Event name: required, gives context to the vendor reviewing the application.

export default function ApplyForVenue() {
  const { currentUser } = useAuth()
  const [venues, setVenues] = useState<Venue[]>([])
  
  useEffect(() => {
    api.getVenues()
      .then(data => setVenues(data.filter(v => !v.isBlocked)))
      .catch(console.error)
  }, [])

  const [venueId, setVenueId]   = useState('')
  const [eventName, setEvent]   = useState('')
  const [guests, setGuests]     = useState('')
  const [date, setDate]         = useState('')
  const [time, setTime]         = useState('')
  const [duration, setDuration] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState('')

  const selectedVenue = venues.find(v => v.id === venueId)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!venueId) e.venue = 'Please select a venue.'
    const en = validateRequired(eventName, 'Event name'); if (en) e.eventName = en
    const gn = validatePositiveNumber(guests, 'Number of guests'); if (gn) e.guests = gn
    if (selectedVenue && Number(guests) > selectedVenue.capacity)
      e.guests = `This venue holds a maximum of ${selectedVenue.capacity} guests.`
    const dn = validateDate(date); if (dn) e.date = dn
    if (!time) e.time = 'Please enter an event time.'
    const dur = validatePositiveNumber(duration, 'Duration'); if (dur) e.duration = dur
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate() || !currentUser || !selectedVenue) return

    try {
      setErrorMessage('')
      await api.submitApplication({
        venueId: selectedVenue.id,
        eventName: eventName.trim(),
        guestCount: Number(guests),
        eventDate: date,
        eventTime: time,
        durationHours: Number(duration),
      })
      setSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Failed to submit application. Please try again.')
    }
  }

  const resetForm = () => {
    setVenueId(''); setEvent(''); setGuests(''); setDate('');
    setTime(''); setDuration(''); setErrors({}); setSubmitted(false)
  }

  if (submitted) {
    return (
      <div>
        <h2 style={{ marginBottom: '2rem' }}>Apply for Venue</h2>
        <div className="card animate-fade">
          <div className="card-body text-center" style={{ padding: '3rem' }}>
            <div
              style={{
                width: 72, height: 72,
                background: 'var(--success-bg)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <span className="material-icons" style={{ fontSize: '2.5rem', color: 'var(--success)' }}>
                check_circle
              </span>
            </div>
            <h3 style={{ marginBottom: '0.75rem' }}>Application Submitted!</h3>
            <p style={{ marginBottom: '2rem', maxWidth: 420, margin: '0 auto 2rem' }}>
              Your application for <strong>{selectedVenue?.name}</strong> has been submitted.
              The venue vendor will review your profile and respond shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={resetForm}>
                <span className="material-icons">add</span>
                Apply for Another Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: '0.35rem' }}>Apply for Venue</h2>
      <p style={{ marginBottom: '2rem' }}>Submit an application detailing your event requirements.</p>

      <form onSubmit={handleSubmit} noValidate>
        {/* Venue selection */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--charcoal)' }}>domain</span>
              Select Venue
            </h4>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Venue *</label>
              <select
                className={`form-select${errors.venue ? ' error' : ''}`}
                value={venueId}
                onChange={e => { setVenueId(e.target.value); setErrors(p => ({ ...p, venue: undefined! })) }}
              >
                <option value="">— Select a venue —</option>
                {venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.location.split(',').slice(-2).join(',').trim()} (max {v.capacity} guests · ${v.pricePerHour}/hr)
                  </option>
                ))}
              </select>
              {errors.venue && <span className="form-error">{errors.venue}</span>}
            </div>

            {selectedVenue && (
              <div
                style={{
                  display: 'flex', gap: '1rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--r)',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                }}
              >
                <img
                  src={selectedVenue.imageUrl}
                  alt={selectedVenue.name}
                  style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--r-sm)', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--charcoal)', marginBottom: '0.2rem' }}>
                    {selectedVenue.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span className="material-icons" style={{ fontSize: '0.9rem', verticalAlign: 'middle' }}>place</span>{' '}
                    {selectedVenue.location}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '0.2rem' }}>
                    Capacity: <strong>{selectedVenue.capacity} guests</strong> · ${selectedVenue.pricePerHour}/hr
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Event details */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--charcoal)' }}>event</span>
              Event Details
            </h4>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                type="text"
                className={`form-input${errors.eventName ? ' error' : ''}`}
                placeholder="e.g. Annual Corporate Gala 2025"
                value={eventName}
                onChange={e => { setEvent(e.target.value); setErrors(p => ({ ...p, eventName: undefined! })) }}
              />
              {errors.eventName && <span className="form-error">{errors.eventName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Expected Number of Guests *</label>
              <input
                type="number"
                className={`form-input${errors.guests ? ' error' : ''}`}
                placeholder="e.g. 150"
                value={guests}
                min={1}
                onChange={e => { setGuests(e.target.value); setErrors(p => ({ ...p, guests: undefined! })) }}
              />
              {errors.guests && <span className="form-error">{errors.guests}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  className={`form-input${errors.date ? ' error' : ''}`}
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => { setDate(e.target.value); setErrors(p => ({ ...p, date: undefined! })) }}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  className={`form-input${errors.time ? ' error' : ''}`}
                  value={time}
                  onChange={e => { setTime(e.target.value); setErrors(p => ({ ...p, time: undefined! })) }}
                />
                {errors.time && <span className="form-error">{errors.time}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (hours) *</label>
              <input
                type="number"
                className={`form-input${errors.duration ? ' error' : ''}`}
                placeholder="e.g. 4"
                value={duration}
                min={1}
                max={24}
                onChange={e => { setDuration(e.target.value); setErrors(p => ({ ...p, duration: undefined! })) }}
              />
              {errors.duration && <span className="form-error">{errors.duration}</span>}
              {date && time && duration && !errors.duration && (
                <span className="form-hint">
                  Event ends at approximately{' '}
                  {(() => {
                    const [h, m] = time.split(':').map(Number)
                    const end = new Date(0, 0, 0, h + Number(duration), m)
                    return end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  })()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Estimated cost */}
        {selectedVenue && duration && !isNaN(Number(duration)) && Number(duration) > 0 && (
          <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
            <span className="material-icons">calculate</span>
            <div>
              <strong>Estimated Cost:</strong> ${(selectedVenue.pricePerHour * Number(duration)).toLocaleString()}
              &nbsp;({Number(duration)} hrs × ${selectedVenue.pricePerHour}/hr)
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span className="material-icons">error</span>
            <div>{errorMessage}</div>
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg">
          <span className="material-icons">send</span>
          Submit Application
        </button>
      </form>
    </div>
  )
}
