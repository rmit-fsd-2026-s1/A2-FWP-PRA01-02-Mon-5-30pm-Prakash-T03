import { useState, useMemo, useEffect } from 'react'
import { api } from '../../utils/api'
import type { Application, HirerDocuments } from '../../types'
import StarRating from '../../components/StarRating'

export default function ApplicantsList() {
  const [apps, setApps]         = useState<Application[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [comment, setComment]   = useState<Record<string, string>>({})
  const [rating, setRating]     = useState<Record<string, number>>({})
  const [saved, setSaved]       = useState<Record<string, boolean>>({})
  const [loading, setLoading]   = useState(true)

  const refreshApps = () => {
    api.getApplications()
      .then(setApps)
      .then(() => setLoading(false))
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    refreshApps()
  }, [])

  const sorted = useMemo(() => {
    const list = [...apps]
    // Default: Sort by date descending
    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
  }, [apps])

  const handleApprove = async (app: Application) => {
    const r = rating[app.id] ?? 0
    if (!r) { alert('Please select a star rating to evaluate this applicant.'); return }
    
    try {
      await api.updateApplicationStatus(app.id, 'approved', comment[app.id] || '')
      refreshApps()
      setSaved(p => ({ ...p, [app.id]: true }))
      setTimeout(() => setSaved(p => ({ ...p, [app.id]: false })), 3000)
    } catch (err) {
      console.error(err)
      alert('Failed to approve application.')
    }
  }

  const handleReject = async (app: Application) => {
    try {
      await api.updateApplicationStatus(app.id, 'rejected', comment[app.id] || '')
      refreshApps()
    } catch (err) {
      console.error(err)
      alert('Failed to reject application.')
    }
  }

  if (loading) {
    return <p className="text-center text-muted" style={{ padding: '3rem' }}>Loading applications list...</p>
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.15rem' }}>Applicants</h2>
          <p>Review and manage hiring applications for your venues.</p>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '3rem' }}>
            <span className="material-icons" style={{ fontSize: '3rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>inbox</span>
            <h4>No Applications Yet</h4>
            <p>Applications submitted by hirers will appear here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map(app => (
            <ApplicantCard
              key={app.id}
              app={app}
              expanded={expanded === app.id}
              onToggle={() => setExpanded(v => v === app.id ? null : app.id)}
              comment={comment[app.id] ?? ''}
              onCommentChange={c => setComment(p => ({ ...p, [app.id]: c }))}
              rating={rating[app.id] ?? 0}
              onRatingChange={r => setRating(p => ({ ...p, [app.id]: r }))}
              onApprove={() => handleApprove(app)}
              onReject={() => handleReject(app)}
              saved={saved[app.id] ?? false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CardProps {
  app: Application
  expanded: boolean
  onToggle: () => void
  comment: string
  onCommentChange: (c: string) => void
  rating: number
  onRatingChange: (r: number) => void
  onApprove: () => void
  onReject: () => void
  saved: boolean
}

function ApplicantCard({
  app, expanded, onToggle, comment, onCommentChange,
  rating, onRatingChange, onApprove, onReject, saved,
}: CardProps) {
  const isPending = app.status === 'pending'

  // Dynamic Details State populated when card is expanded
  const [details, setDetails] = useState<{
    reputation: number;
    history: any[];
    documents: HirerDocuments | null;
    loading: boolean;
  }>({
    reputation: 0,
    history: [],
    documents: null,
    loading: true,
  });

  useEffect(() => {
    if (expanded) {
      setDetails(prev => ({ ...prev, loading: true }));
      Promise.all([
        api.getHistoryByHirer(app.hirerId),
        api.getDocumentsByHirerId(app.hirerId)
      ]).then(([historyRes, docsRes]) => {
        setDetails({
          reputation: historyRes.reputation,
          history: historyRes.history,
          documents: docsRes,
          loading: false,
        });
      }).catch(err => {
        console.error('Error fetching hirer trust details:', err);
        setDetails(prev => ({ ...prev, loading: false }));
      });
    }
  }, [expanded, app.hirerId]);

  return (
    <div className="card" style={{ borderLeft: `4px solid ${app.status === 'approved' ? 'var(--success)' : app.status === 'rejected' ? 'var(--error)' : 'var(--olive)'}` }}>
      {/* Header row */}
      <div
        style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}
        onClick={onToggle}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div className="applicant-avatar" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>
            {app.hirerName.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--charcoal)' }}>{app.hirerName}</span>
              <span className={`badge badge-${app.status}`}>{app.status}</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>
              <strong>{app.eventName}</strong> · {app.venueName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {new Date(app.eventDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })} at {app.eventTime} · {app.durationHours}hrs · {app.guestCount} guests
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <span className="material-icons" style={{ color: 'var(--text-muted)' }}>
            {expanded ? 'expand_less' : 'expand_more'}
          </span>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem' }} className="animate-fade">
          {saved && (
            <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
              <span className="material-icons">check_circle</span>
              Application approved and hire history recorded!
            </div>
          )}

          {details.loading ? (
            <p className="text-center text-muted" style={{ padding: '1rem' }}>Loading applicant reputation and compliance data...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {/* Hire history */}
              <div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 4, fontSize: '1.1rem' }}>history</span>
                  Hire History ({details.history.length} records)
                </h4>
                {details.history.length === 0 ? (
                  <p className="text-muted">No previous hires on record.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {details.history.map(h => (
                      <div key={h.id} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--r)', padding: '0.6rem 0.75rem', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600 }}>{h.venueName}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{h.eventName} · {new Date(h.dateOfHire).toLocaleDateString('en-AU')}</div>
                        <StarRating value={h.rating} readOnly size="sm" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                  <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 4, fontSize: '1.1rem' }}>folder_open</span>
                  Compliance Documents
                </h4>
                {!details.documents ? (
                  <p className="text-muted">No documents submitted.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <DocRow label="Driver's License" name={details.documents.driverLicenseName} />
                    <DocRow label="Public Liability" name={details.documents.publicLiabilityName} />
                    {details.documents.isBusinessApplicant && (
                      <>
                        <DocRow label="Business Certificate" name={details.documents.businessCertName} />
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                          ABN: {details.documents.abn || '—'}
                        </div>
                      </>
                    )}
                    <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Credibility:</span>
                      <StarRating value={Math.round(details.documents.credibilityScore)} readOnly size="sm" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{details.documents.credibilityScore.toFixed(1)}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vendor actions */}
          {isPending && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Vendor Decision</h4>

              <div className="form-group">
                <label className="form-label">Evaluate this applicant (give a trust rating out of 5 stars)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StarRating value={rating} onChange={onRatingChange} size="lg" />
                  {rating > 0 && <span style={{ fontWeight: 600, color: 'var(--charcoal)' }}>{rating}/5</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comment / Notes (optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Add a comment about this applicant's credibility, requirements, or booking conditions..."
                  value={comment}
                  onChange={e => onCommentChange(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn btn-primary" onClick={onApprove}>
                  <span className="material-icons">check_circle</span>
                  Approve & Confirm Booking
                </button>
                <button className="btn btn-danger" onClick={onReject}>
                  <span className="material-icons">cancel</span>
                  Reject Application
                </button>
              </div>
            </div>
          )}

          {!isPending && app.vendorComment && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <strong style={{ fontSize: '0.875rem' }}>Vendor Comment:</strong>
              <p style={{ marginTop: '0.35rem', fontSize: '0.9rem', fontStyle: 'italic' }}>{app.vendorComment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DocRow({ label, name }: { label: string; name?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
      <span className="material-icons" style={{ fontSize: '1rem', color: name ? 'var(--success)' : 'var(--text-muted)' }}>
        {name ? 'check_circle' : 'radio_button_unchecked'}
      </span>
      <span style={{ color: name ? 'var(--text)' : 'var(--text-muted)' }}>
        {label}: {name || 'Not submitted'}
      </span>
    </div>
  )
}
