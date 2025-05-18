import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth' // הכתובת של ה־API בשרת

// רשום משתמש חדש
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { username, email, password })
  return response.data
}

// התחבר
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  localStorage.setItem('user', JSON.stringify(response.data)) // נשמור את ה־token ב־localStorage
  return response.data
}

// יציאה
export const logoutUser = () => {
  localStorage.removeItem('user')
}
