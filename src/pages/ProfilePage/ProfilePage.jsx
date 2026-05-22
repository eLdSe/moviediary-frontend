import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/userApi'
import { authService } from '../../services/authService'

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const [form, setForm] = useState({ username: '', email: '', password: '' })

  useEffect(() => {
    userService.getMe()
      .then(data => {
        setUser(data)
        setForm({ username: data.username, email: data.email, password: '' })
      })
      .catch(() => setError('Не удалось загрузить профиль'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      const payload = { username: form.username, email: form.email }
      if (form.password) payload.password = form.password
      const updated = await userService.updateMyProfil(payload)
      setUser(updated)
      setForm({ username: updated.username, email: updated.email, password: '' })
      setEditing(false)
      setSuccess('Профиль обновлён')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await userService.deleteMe()
      authService.logout()
      navigate('/login')
    } catch {
      setError('Ошибка при удалении аккаунта')
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setForm({ username: user.username, email: user.email, password: '' })
    setEditing(false)
    setError('')
  }

  const avatar = user?.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div style={s.root}>
      <div style={s.bg1} />
      <div style={s.bg2} />

      {/* Back */}
      <button style={s.backBtn} onClick={() => navigate('/')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Назад
      </button>

      <div style={s.card}>
        {/* Avatar */}
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{loading ? '?' : avatar}</div>
          <div style={s.avatarRing} />
        </div>

        {loading ? (
          <div style={s.center}>
            <div style={s.spinner} />
          </div>
        ) : (
          <>
            {!editing && (
              <>
                <h1 style={s.name}>{user.username}</h1>
                <p style={s.email}>{user.email}</p>
              </>
            )}

            {/* Success */}
            {success && (
              <div style={s.successBox}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                  <circle cx="7" cy="7" r="6" stroke="#16a34a" strokeWidth="1.3"/>
                  <path d="M4.5 7L6.5 9L9.5 5" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={s.errorBox}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                  <circle cx="7" cy="7" r="6" stroke="#b91c1c" strokeWidth="1.3"/>
                  <path d="M7 4V7.5M7 10h.01" stroke="#b91c1c" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            {/* View mode */}
            {!editing ? (
              <div style={s.actions}>
                <button style={s.btnPrimary} onClick={() => setEditing(true)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M9.5 2.5L11.5 4.5L5 11H3V9L9.5 2.5Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
                  </svg>
                  Редактировать
                </button>
                <button style={s.btnDanger} onClick={() => setConfirmDelete(true)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5V10M8.5 6.5V10M3 4l.7 7.5h6.6L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Удалить аккаунт
                </button>
              </div>
            ) : (
              /* Edit mode */
              <div style={s.form}>
                <div style={s.field}>
                  <label style={s.label}>Имя пользователя</label>
                  <div style={s.inputWrap}>
                    <svg style={s.ico} width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M2.5 13.5C2.5 11.015 5.015 9 8 9C10.985 9 13.5 11.015 13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <input
                      style={s.input}
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                      placeholder="username"
                    />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>Email</label>
                  <div style={s.inputWrap}>
                    <svg style={s.ico} width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M2 5.5L8 9.5L14 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <input
                      style={s.input}
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div style={s.field}>
                  <label style={s.label}>Новый пароль <span style={s.optional}>(необязательно)</span></label>
                  <div style={s.inputWrap}>
                    <svg style={s.ico} width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M5.5 7V5C5.5 3.619 6.619 2.5 8 2.5C9.381 2.5 10.5 3.619 10.5 5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <input
                      style={{ ...s.input, paddingRight: '42px' }}
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                    <button style={s.eyeBtn} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                      {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2 2L14 14M6.5 6.586A2 2 0 0 0 9.414 9.5M4.19 4.19C2.93 5.07 2 6.45 2 8c0 2 2.686 5 6 5a7.3 7.3 0 0 0 3.81-1.19M6.34 3.13A7 7 0 0 1 8 3c3.314 0 6 3 6 5a6.3 6.3 0 0 1-1.19 2.81" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8c0-2 2.686-5 6-5s6 3 6 5-2.686 5-6 5-6-3-6-5Z" stroke="currentColor" strokeWidth="1.3"/>
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div style={s.editActions}>
                  <button style={s.btnSecondary} onClick={handleCancel}>Отмена</button>
                  <button
                    style={{ ...s.btnPrimary, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Сохраняю...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <div style={s.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 10V15M14 19h.01" stroke="#fca5a5" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="14" cy="14" r="12" stroke="#fca5a5" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 style={s.modalTitle}>Удалить аккаунт?</h3>
            <p style={s.modalSub}>Это действие необратимо. Все ваши данные будут удалены.</p>
            <div style={s.modalActions}>
              <button style={s.btnSecondary} onClick={() => setConfirmDelete(false)}>Отмена</button>
              <button
                style={{ ...s.btnDanger, opacity: deleting ? 0.7 : 1 }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Удаляю...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f11',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '70px 16px 24px',
  },
  bg1: {
    position: 'absolute', top: '-100px', right: '-60px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bg2: {
    position: 'absolute', bottom: '-120px', left: '-80px',
    width: '460px', height: '460px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  backBtn: {
    position: 'absolute', top: '24px', left: '24px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: 'rgba(255,255,255,0.5)',
    fontSize: '13px', padding: '7px 12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '6px',
    transition: 'color 0.18s',
  },
  card: {
    position: 'relative',
    width: '100%', maxWidth: '400px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px',
    padding: 'clamp(36px, 8vw, 48px) clamp(18px, 5vw, 36px) clamp(20px, 5vw, 36px)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  avatarWrap: { position: 'relative', marginBottom: '20px' },
  avatar: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #10b981)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em',
  },
  avatarRing: {
    position: 'absolute', inset: '-4px', borderRadius: '50%',
    border: '1.5px solid rgba(99,102,241,0.4)', pointerEvents: 'none',
  },
  name: {
    color: '#fff', fontSize: '22px', fontWeight: '700',
    margin: '0 0 4px', letterSpacing: '-0.02em', textAlign: 'center',
  },
  email: {
    color: 'rgba(255,255,255,0.4)', fontSize: '14px',
    margin: '0 0 28px', textAlign: 'center',
  },
  center: { display: 'flex', justifyContent: 'center', padding: '24px' },
  spinner: {
    width: '28px', height: '28px', borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.1)',
    borderTopColor: '#6366f1',
    animation: 'spin 0.8s linear infinite',
  },
  successBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(22,163,74,0.1)',
    border: '1px solid rgba(22,163,74,0.25)',
    borderRadius: '8px', padding: '10px 12px',
    color: '#86efac', fontSize: '13px',
    width: '100%', marginBottom: '16px', boxSizing: 'border-box',
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '8px', padding: '10px 12px',
    color: '#fca5a5', fontSize: '13px',
    width: '100%', marginBottom: '16px', boxSizing: 'border-box',
  },
  actions: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    color: 'rgba(255,255,255,0.5)', fontSize: '11px',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em',
  },
  optional: { color: 'rgba(255,255,255,0.25)', textTransform: 'none', fontWeight: '400', letterSpacing: 0 },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  ico: { position: 'absolute', left: '13px', color: 'rgba(255,255,255,0.28)', pointerEvents: 'none' },
  input: {
    width: '100%', height: '44px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '0 16px 0 38px',
    color: '#fff', fontSize: '16px', fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px',
    background: 'none', border: 'none', padding: '4px',
    cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
    display: 'flex', alignItems: 'center', borderRadius: '4px',
  },
  editActions: { display: 'flex', gap: '10px', marginTop: '4px' },
  btnPrimary: {
    flex: 1, height: '44px',
    background: 'linear-gradient(135deg, #6366f1, #10b981)',
    border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '14px', fontWeight: '600', fontFamily: 'inherit',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    transition: 'opacity 0.2s',
  },
  btnSecondary: {
    flex: 1, height: '44px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: 'rgba(255,255,255,0.6)',
    fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer',
    transition: 'border-color 0.18s',
  },
  btnDanger: {
    width: '100%', height: '44px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: '10px', color: '#fca5a5',
    fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
    transition: 'border-color 0.18s, background 0.18s',
  },
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999, padding: '16px',
  },
  modal: {
    background: '#18181b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px', padding: 'clamp(20px, 5vw, 32px)',
    maxWidth: '340px', width: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  },
  modalIcon: { marginBottom: '4px' },
  modalTitle: { color: '#fff', fontSize: '18px', fontWeight: '700', margin: 0, textAlign: 'center' },
  modalSub: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0, textAlign: 'center', lineHeight: '1.5' },
  modalActions: { display: 'flex', gap: '10px', width: '100%', marginTop: '8px' },
}

export default ProfilePage