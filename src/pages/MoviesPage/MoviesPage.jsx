import { useState, useEffect, useRef, useCallback } from "react";
import { movieService } from "../../services/movieApi";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieForm from "../../components/MovieForm/MovieForm";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./MoviesPage.css";

const emptyForm = {
  title: "",
  year: "",
  poster: "",
  rating: "",
  status: "WANT",
};

function GlobeView({ movies, onDelete, onEdit }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  const rotationRef = useRef({ x: -0.15, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const [cards, setCards] = useState([]);
  const [activeMovie, setActiveMovie] = useState(null);

  const buildGlobe = useCallback(() => {
    const count = movies.length;
    if (count === 0) return [];

    const result = [];
    const R = 340;
    const phi = Math.PI * (Math.sqrt(5) - 1);

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      result.push({
        movie: movies[i],
        ox: R * radius * Math.cos(theta),
        oy: R * y,
        oz: R * radius * Math.sin(theta),
      });
    }

    return result;
  }, [movies]);

  useEffect(() => {
    setCards(buildGlobe());
  }, [buildGlobe]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setActiveMovie(null);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const project = (ox, oy, oz, rx, ry) => {
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);

    const x1 = ox * cosY + oz * sinY;
    const z1 = -ox * sinY + oz * cosY;

    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);

    const y2 = oy * cosX - z1 * sinX;
    const z2 = oy * sinX + z1 * cosX;

    const fov = 900;
    const scale = fov / (fov + z2);

    return {
      screenX: x1 * scale,
      screenY: y2 * scale,
      scale,
      z: z2,
    };
  };

  useEffect(() => {
    const tick = () => {
      if (!isDragging.current && !activeMovie) {
        velocityRef.current.y += 0.0006;

        velocityRef.current.x *= 0.96;
        velocityRef.current.y *= 0.96;

        rotationRef.current.x += velocityRef.current.x;
        rotationRef.current.y += velocityRef.current.y;
      }

      setCards((prev) => [...prev]);

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animRef.current);
  }, [activeMovie]);

  const onMouseDown = (e) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;

    velocityRef.current.x = dy * 0.003;
    velocityRef.current.y = dx * 0.003;

    rotationRef.current.x += dy * 0.003;
    rotationRef.current.y += dx * 0.003;

    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onTouchStart = (e) => {
    isDragging.current = true;

    lastMouse.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;

    const dx = e.touches[0].clientX - lastMouse.current.x;
    const dy = e.touches[0].clientY - lastMouse.current.y;

    velocityRef.current.x = dy * 0.003;
    velocityRef.current.y = dx * 0.003;

    rotationRef.current.x += dy * 0.003;
    rotationRef.current.y += dx * 0.003;

    lastMouse.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const rx = rotationRef.current.x;
  const ry = rotationRef.current.y;

  const projected = cards
    .map((c) => ({
      ...c,
      ...project(c.ox, c.oy, c.oz, rx, ry),
    }))
    .sort((a, b) => a.z - b.z);

  return (
    <div
      ref={containerRef}
      className={`globe-container ${activeMovie ? "focused" : ""}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      <div className="globe-dots-bg" />

      {activeMovie && <div className="globe-overlay" />}

      {projected.map(({ movie, screenX, screenY, scale, z }) => {
        const depth = (z + 360) / 720;

        const isActive = activeMovie?.id === movie.id;

        const opacity = isActive ? 1 : activeMovie ? 0.12 : 0.3 + depth * 0.7;

        const blur = Math.max(0, (1 - scale) * 3);

        const w = isActive
          ? Math.max(240, 180 * scale)
          : Math.max(60, 100 * scale);

        const h = isActive
          ? Math.max(360, 260 * scale)
          : Math.max(90, 150 * scale);

        return (
          <div
            key={movie.id}
            className={`globe-card ${isActive ? "active" : ""}`}
            onClick={() => setActiveMovie(movie)}
            style={{
              left: `calc(50% + ${screenX}px)`,
              top: `calc(50% + ${screenY}px)`,
              width: w,
              height: h,
              opacity,
              zIndex: isActive ? 9999 : Math.round(depth * 1000),
              transform: isActive
                ? "translate(-50%, -50%) scale(1.15)"
                : "translate(-50%, -50%)",
              filter: `blur(${blur}px)`,
              boxShadow: isActive
                ? "0 0 50px rgba(168,85,247,0.7)"
                : "0 6px 24px rgba(0,0,0,0.65)",
            }}
          >
            {movie.poster ? (
              <img src={movie.poster} alt={movie.title} draggable={false} />
            ) : (
              <div className="globe-card-placeholder">
                <span>{movie.title?.slice(0, 2)?.toUpperCase()}</span>
              </div>
            )}
          </div>
        );
      })}

      {activeMovie && (
        <div className="movie-focus-panel">
          <button className="mfp-close" onClick={() => setActiveMovie(null)}>
            ✕
          </button>

          <div className="mfp-poster">
            {activeMovie.poster && (
              <img src={activeMovie.poster} alt={activeMovie.title} />
            )}
          </div>

          <div className="mfp-content">
            <h2>{activeMovie.title}</h2>

            <div className="mfp-meta">
              <span>{activeMovie.year}</span>

              {activeMovie.rating && (
                <span>★ {Number(activeMovie.rating).toFixed(1)}</span>
              )}

              <span>{activeMovie.status}</span>
            </div>

            <div className="mfp-actions">
              <button onClick={() => onEdit(activeMovie)}>Edit</button>

              <button onClick={() => onDelete(activeMovie.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'globe' | 'grid'
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieService.getAllMovie();
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      setError("Не удалось загрузить фильмы");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val.trim()) {
      loadMovies();
      return;
    }
    try {
      const data = await movieService.getByTitle(val);
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      setError("Ошибка поиска");
    }
  };

  const handleFilter = async (status) => {
    let upperStatus = status.toUpperCase();
    setFilterStatus(status);
    setSearch("");
    if (status === "All") {
      loadMovies();
      return;
    }
    try {
      const data = await movieService.getByStatus(upperStatus);
      setMovies(Array.isArray(data) ? data : []);
    } catch {
      setError("Ошибка фильтра");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить фильм?")) return;
    await movieService.deleteMovie(id);
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      year: movie.year,
      poster: movie.poster || "",
      rating: movie.rating,
      status: movie.status,
    });
    setEditId(movie.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await movieService.updateMovie(editId, form);
      } else {
        await movieService.createMovie(form);
      }
      closeForm();
      loadMovies();
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <div className="movies-page">
      {/* Ambient background */}
      <div className="ambient-bg">
        <div className="amb-1" />
        <div className="amb-2" />
        <div className="amb-3" />
      </div>

      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-logo">
            <i className="ti ti-movie logo-icon" />
            <span className="logo-text">MOVIELIST</span>
          </div>
          <div className="header-right">
            <div className="view-toggle">
              <button
                className={`vt-btn${viewMode === "globe" ? " active" : ""}`}
                onClick={() => setViewMode("globe")}
                title="Глобус"
              >
                ⬡
              </button>
              <button
                className={`vt-btn${viewMode === "grid" ? " active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Сетка"
              >
                ⊞
              </button>
            </div>
            <button className="btn-add" onClick={openAdd}>
              <span>+</span> Добавить
            </button>
            <button className="btn-logout" onClick={() => navigate("/profile")}>
              Профиль
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              {" "}
              {/* 👈 */}
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="page-main">
        <SearchBar
          search={search}
          onSearch={handleSearch}
          filterStatus={filterStatus}
          onFilter={handleFilter}
        />

        {error && <div className="error-banner">⚠ {error}</div>}

        {loading ? (
          <div className="state-center">
            <div className="loader-ring" />
            <p>Загрузка...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="state-center">
            <div className="empty-icon">◈</div>
            <p>Фильмов нет. Добавьте первый!</p>
          </div>
        ) : viewMode === "globe" ? (
          <GlobeView
            movies={movies}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <MovieForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={closeForm}
          editId={editId}
          saving={saving}
        />
      )}
    </div>
  );
}

export default MoviesPage;
