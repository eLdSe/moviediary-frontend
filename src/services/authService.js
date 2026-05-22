const AUTH_URL = import.meta.env.VITE_API_URL.replace('/movie', '/auth')

class AuthService {

  login = async (username, password) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    console.log(res)
    const data = await res.json()
    localStorage.setItem('token', data.token) 
    return data
  }

  register = async (username, password, email) => {
    const res = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    })
    const data = await res.json()
    localStorage.setItem('token', data.token)
    return data
  }

  logout = () => {
    localStorage.removeItem('token')
  }

  isLoggedIn = () => {
    return !!localStorage.getItem('token')
  }
}

export const authService = new AuthService()