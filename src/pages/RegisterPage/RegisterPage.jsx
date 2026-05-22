import { useState } from "react";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("Заполните все поля");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Введите корректный email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.register(username, password, email);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Не удалось зарегистрироваться");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div style={styles.root}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <i className="ti ti-movie logo-icon" />
          <span style={styles.logoText}>MOVIELIST</span>
        </div>

        <h1 style={styles.heading}>Создать аккаунт</h1>
        <p style={styles.sub}>Заполните данные для регистрации</p>

        <div style={styles.form}>
          {/* Username */}
          <div style={styles.field}>
            <label style={styles.label}>Имя пользователя</label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle
                  cx="8"
                  cy="5.5"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M2.5 13.5C2.5 11.015 5.015 9 8 9C10.985 9 13.5 11.015 13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                style={styles.input}
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="2"
                  y="4"
                  width="12"
                  height="9"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M2 5.5L8 9.5L14 5.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                style={styles.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Пароль</label>
            <div style={styles.inputWrap}>
              <svg
                style={styles.inputIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="3"
                  y="7"
                  width="10"
                  height="7"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M5.5 7V5C5.5 3.619 6.619 2.5 8 2.5C9.381 2.5 10.5 3.619 10.5 5V7"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              <input
                style={{ ...styles.input, paddingRight: "42px" }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
              <button
                style={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 2L14 14M6.5 6.586A2 2 0 0 0 9.414 9.5M4.19 4.19C2.93 5.07 2 6.45 2 8c0 2 2.686 5 6 5a7.3 7.3 0 0 0 3.81-1.19M6.34 3.13A7 7 0 0 1 8 3c3.314 0 6 3 6 5a6.3 6.3 0 0 1-1.19 2.81"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8c0-2 2.686-5 6-5s6 3 6 5-2.686 5-6 5-6-3-6-5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx="7"
                  cy="7"
                  r="6"
                  stroke="#b91c1c"
                  strokeWidth="1.3"
                />
                <path
                  d="M7 4V7.5M7 10h.01"
                  stroke="#b91c1c"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            style={{
              ...styles.btn,
              opacity: loading ? 0.75 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.spinnerWrap}>
                <svg
                  style={styles.spinner}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <circle
                    cx="9"
                    cy="9"
                    r="7"
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                  />
                  <path
                    d="M9 2A7 7 0 0 1 16 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Регистрирую...
              </span>
            ) : (
              <>
                Зарегистрироваться
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        <p style={styles.footer}>
          Уже есть аккаунт?{" "}
          <a href="/login" style={styles.link}>
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f0f11",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  bgCircle1: {
    position: "absolute",
    top: "-120px",
    right: "-80px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  bgCircle2: {
    position: "absolute",
    bottom: "-160px",
    left: "-100px",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  card: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "20px",
    padding: "clamp(24px, 6vw, 40px) clamp(18px, 5vw, 36px) clamp(20px, 5vw, 36px)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "-0.01em",
  },
  heading: {
    color: "#fff",
    fontSize: "26px",
    fontWeight: "700",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  sub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: "14px",
    margin: "0 0 32px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "13px",
    color: "rgba(255,255,255,0.3)",
    pointerEvents: "none",
    flexShrink: 0,
  },
  input: {
    width: "100%",
    height: "44px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "0 40px 0 40px",
    color: "#fff",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.18s",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    padding: "4px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: "8px",
    padding: "10px 12px",
    color: "#fca5a5",
    fontSize: "13px",
  },
  btn: {
    height: "46px",
    background: "linear-gradient(135deg, #6366f1 0%, #10b981 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "4px",
    transition: "opacity 0.2s, transform 0.15s",
    letterSpacing: "-0.01em",
  },
  spinnerWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  spinner: {
    animation: "spin 0.8s linear infinite",
  },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.35)",
    fontSize: "13px",
    marginTop: "28px",
  },
  link: {
    color: "#818cf8",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default RegisterPage;
