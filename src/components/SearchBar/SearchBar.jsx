import './SearchBar.css'

const STATUSES = ['All', 'Watching','Want', 'Watched']

function SearchBar({ search, onSearch, filterStatus, onFilter }) {
  return (
    <div className="toolbar">
      <div className="search-wrap">
        <i className="ti ti-search search-icon" aria-hidden="true" />
        <input
          className="search-input"
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className="status-tabs">
        {STATUSES.map(s => (
          <button
            key={s}
            className={`status-tab${filterStatus === s ? ' active' : ''}`}
            onClick={() => onFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
