import "./MovieCard.css";
import { Trash2 } from "lucide-react";

const STATUS_COLORS = {
  Watching: { bg: "#1e3a5f", color: "#93c5fd" },
  Completed: { bg: "#14532d", color: "#86efac" },
  Planned: { bg: "#1e1e28", color: "#94a3b8" },
  Dropped: { bg: "#450a0a", color: "#fca5a5" },
};

function MovieCard({ movie, onDelete, onEdit }) {
  const statusStyle = STATUS_COLORS[movie.status] || STATUS_COLORS.Planned;

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} />
        ) : (
          <div className="movie-poster-placeholder">
            <i className="ti ti-photo-off" aria-hidden="true" />
          </div>
        )}
        {movie.rating && (
          <div className="movie-rating">
            <i className="ti ti-star-filled" aria-hidden="true" />
            {Number(movie.rating).toFixed(1)}
          </div>
        )}
      </div>

      <div className="movie-body">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          {movie.year && <span className="movie-year">{movie.year}</span>}
          {movie.status && (
            <span
              className="movie-status"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {movie.status}
            </span>
          )}
        </div>
      </div>

      <div className="movie-actions">
        <button className="card-btn edit-btn" onClick={() => onEdit(movie)}>
          <i className="ti ti-edit" aria-hidden="true" /> Изменить
        </button>

        <button
          className="card-btn delete-btn"
          onClick={() => onDelete(movie.id)}
          aria-label="Удалить"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
