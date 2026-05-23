const BASE_URL = `${import.meta.env.VITE_API_URL}/movie`
const authHeader = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

class MovieService {
  

  getAllMovie = async () => {
    const res = await fetch(BASE_URL,{
      headers:authHeader()
    })
    return res.json()
  }

  getById = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`,{
      headers: authHeader()
    })
    return res.json()
  }

  createMovie = async (movie) => {
    const res = await fetch(`${BASE_URL}/create`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify(movie)
    })
    return res.json()
  }

  updateMovie = async (id, newMovie) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify(newMovie)
    })
    return res.json()
  }

  deleteMovie = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { 
      method: 'DELETE',
      headers:authHeader()
     })
  }

  getByStatus = async (status) => {
    const res = await fetch(`${BASE_URL}/status/${status}`,{
      headers: authHeader()
    })
    return res.json()
  }

  getByTitle = async (title) => {
    const res = await fetch(`${BASE_URL}/search?title=${title}`,{
      headers: authHeader()
    })
    return res.json()
  }
}

export const movieService = new MovieService()
