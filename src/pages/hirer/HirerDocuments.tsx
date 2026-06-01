import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { api } from '../../utils/api'
import { calcCredibilityScore } from '../../utils/storage'
import type { HirerDocuments } from '../../types'
import StarRating from '../../components/StarRating'
import { validateABN } from '../../utils/validation'

export default function HirerDocumentsPage() {
  const { currentUser } = useAuth()

  const [isBusiness, setIsBusiness]       = useState(false)
  const [abn, setAbn]                     = useState('')
  const [licName, setLicName]             = useState('')
  const [licData, setLicData]             = useState('')
  const [liabName, setLiabName]           = useState('')
  const [liabData, setLiabData]           = useState('')
  const [certName, setCertName]           = useState('')
  const [certData, setCertData]           = useState('')
  const [credibility, setCredibility]     = useState(0)
  const [saved, setSaved]                 = useState(false)
  const [errors, setErrors]               = useState<Record<string, string>>({})
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    if (!currentUser) return
    api.getDocuments()
      .then(doc => {
        if (doc) {
          setIsBusiness(doc.isBusinessApplicant ?? false)
          setAbn(doc.abn ?? '')
          setLicName(doc.driverLicenseName ?? '')
          setLicData(doc.driverLicenseData ?? '')
          setLiabName(doc.publicLiabilityName ?? '')
          setLiabData(doc.publicLiabilityData ?? '')
          setCertName(doc.businessCertName ?? '')
          setCertData(doc.businessCertData ?? '')
          setCredibility(doc.credibilityScore ?? 0)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching documents:', err)
        setLoading(false)
      })
  }, [currentUser])

  useEffect(() => {
    const score = calcCredibilityScore({
      driverLicenseData: licData || undefined,
      publicLiabilityData: liabData || undefined,
      isBusinessApplicant: isBusiness,
      businessCertData: certData || undefined,
    })
    setCredibility(score)
  }, [licData, liabData, certData, isBusiness])

  const readFile = (
    file: File,
    accept: string[],
    setName: (n: string) => void,
    setData: (d: string) => void,
    field: string
  ) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!accept.includes(ext)) {
      setErrors(p => ({ ...p, [field]: `Invalid format. Accepted: ${accept.join(', ')}.` }))
      return
    }
    setErrors(p => { const n = { ...p }; delete n[field]; return n })
    const reader = new FileReader()
    reader.onload = () => {
      setName(file.name)
      setData(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (isBusiness) {
      const abnErr = validateABN(abn)
      if (abnErr) errs.abn = abnErr
    }
    setErrors(p => ({ ...p, ...errs }))
    if (Object.keys(errs).length > 0) return

    if (!currentUser) return
    const docPayload: Partial<HirerDocuments> = {
      isBusinessApplicant: isBusiness,
      abn: isBusiness ? abn : undefined,
      driverLicenseName: licName || undefined,
      driverLicenseData: licData || undefined,
      publicLiabilityName: liabName || undefined,
      publicLiabilityData: liabData || undefined,
      businessCertName: isBusiness ? certName || undefined : undefined,
      businessCertData: isBusiness ? certData || undefined : undefined,
    }

    try {
      const res = await api.saveDocuments(docPayload)
      setCredibility(res.document.credibilityScore)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Error saving documents:', err)
      setErrors(p => ({ ...p, submit: 'Failed to save documents on server.' }))
    }
  }

  if (loading) {
    return <p className="text-center text-muted" style={{ padding: '3rem' }}>Loading compliance documents...</p>
  }


  return (
    <div>
      <h2 style={{ marginBottom: '0.35rem' }}>Compliance Documents</h2>
      <p style={{ marginBottom: '2rem' }}>
        Upload your compliance documents to strengthen your credibility with venue vendors.
      </p>

      {/* Credibility score card */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%)',
          color: '#fff',
        }}
      >
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,.6)', marginBottom: '0.5rem' }}>
              Credibility Score
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 700, color: 'var(--olive)' }}>
                {credibility.toFixed(1)}
              </div>
              <div>
                <StarRating value={Math.round(credibility)} readOnly size="lg" />
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.65)', marginTop: '0.2rem' }}>out of 5.0</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,.75)', maxWidth: 320, lineHeight: 1.65 }}>
            Your credibility score is automatically calculated based on the number of compliance documents submitted.
            More documents = higher score = more trust from vendors.
          </div>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success animate-fade">
          <span className="material-icons">check_circle</span>
          Documents saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Driver's license */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--charcoal)' }}>badge</span>
              Driver's License
              <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>(JPG format)</span>
            </h4>
            {licData && (
              <span className="badge badge-approved">
                <span className="material-icons" style={{ fontSize: '0.85rem' }}>check_circle</span>
                Uploaded
              </span>
            )}
          </div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Upload Driver's License Photo *</label>
              <input
                type="file"
                accept=".jpg,.jpeg"
                className={`form-input${errors.license ? ' error' : ''}`}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) readFile(f, ['jpg', 'jpeg'], setLicName, setLicData, 'license')
                }}
              />
              {errors.license && <span className="form-error">{errors.license}</span>}
              {licName && <span className="form-hint">Current file: {licName}</span>}
            </div>
          </div>
        </div>

        {/* Public liability */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--charcoal)' }}>security</span>
              Public Liability Insurance
              <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>(PDF format)</span>
            </h4>
            {liabData && (
              <span className="badge badge-approved">
                <span className="material-icons" style={{ fontSize: '0.85rem' }}>check_circle</span>
                Uploaded
              </span>
            )}
          </div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Upload Certificate of Currency *</label>
              <input
                type="file"
                accept=".pdf"
                className={`form-input${errors.liability ? ' error' : ''}`}
                onChange={e => {
                  const f = e.target.files?.[0]
                  if (f) readFile(f, ['pdf'], setLiabName, setLiabData, 'liability')
                }}
              />
              {errors.liability && <span className="form-error">{errors.liability}</span>}
              {liabName && <span className="form-hint">Current file: {liabName}</span>}
            </div>
          </div>
        </div>

        {/* Business section */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6, color: 'var(--charcoal)' }}>business</span>
              Business Registration
            </h4>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={isBusiness}
                  onChange={e => setIsBusiness(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--charcoal)' }}
                />
                <span className="form-label" style={{ margin: 0 }}>
                  I am applying on behalf of a business or organisation
                </span>
              </label>
            </div>

            {isBusiness && (
              <div className="animate-fade">
                <div className="divider" />
                <div className="form-group">
                  <label className="form-label">ABN (Australian Business Number) *</label>
                  <input
                    type="text"
                    className={`form-input${errors.abn ? ' error' : ''}`}
                    placeholder="XX XXX XXX XXX"
                    value={abn}
                    maxLength={14}
                    onChange={e => { setAbn(e.target.value); setErrors(p => ({ ...p, abn: undefined! })) }}
                  />
                  {errors.abn && <span className="form-error">{errors.abn}</span>}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Certificate of Registration for Business Name *
                    <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.85rem', marginLeft: '0.5rem' }}>(PDF format)</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    className={`form-input${errors.cert ? ' error' : ''}`}
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (f) readFile(f, ['pdf'], setCertName, setCertData, 'cert')
                    }}
                  />
                  {errors.cert && <span className="form-error">{errors.cert}</span>}
                  {certName && <span className="form-hint">Current file: {certName}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          <span className="material-icons">save</span>
          Save Documents
        </button>
      </form>
    </div>
  )
}
