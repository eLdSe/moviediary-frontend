const BASE_URL = `${import.meta.env.VITE_API_URL}/user`

const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

class UserService {

  getMe = async () => {
    const res = await fetch(`${BASE_URL}/me`, {
      headers: authHeader()
    })
    return res.json()
  }

  updateMyProfil = async (user) => {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify(user)
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token) 
    }
    return data
  }

  deleteMe = async () => {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "DELETE",
      headers: authHeader()
    })
  }
}


export const userService = new UserService()