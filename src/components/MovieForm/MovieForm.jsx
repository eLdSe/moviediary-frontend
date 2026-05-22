import './MovieForm.css'

const STATUSES = ['WATCHING','WANT', 'WATCHED']

function MovieForm({ form, setForm, onSubmit, onClose, editId, saving }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editId ? 'Редактировать фильм' : 'Новый фильм'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрыть">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="movie-form">
          <label className="form-label">
            Название *
            <input
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Название фильма"
            />
          </label>

          <div className="form-row">
            <label className="form-label">
              Год
              <input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                placeholder="2024"
                min="1888"
                max="2099"
              />
            </label>
            <label className="form-label">
              Рейтинг
              <input
                type="number"
                value={form.rating}
                onChange={e => setForm({ ...form, rating: e.target.value })}
                placeholder="8.5"
                min="0"
                max="10"
                step="0.1"
              />
            </label>
          </div>

          <label className="form-label">
            Постер (URL)
            <input
              value={form.poster}
              onChange={e => setForm({ ...form, poster: e.target.value })}
              placeholder="https://..."
            />
          </label>

          <label className="form-label">
            Статус
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? <i className="ti ti-loader-2 spin" aria-hidden="true" />
                : <i className="ti ti-check" aria-hidden="true" />
              }
              {editId ? 'Сохранить' : 'Добавить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MovieForm
