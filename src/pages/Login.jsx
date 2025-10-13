import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthLayout } from "../components/auth-layout"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Field, Label } from "../components/fieldset"
import { Heading } from "../components/heading"
import { Text } from "../components/text"
import { useAuth } from "../context/AuthContext"
import api from '../utils/api.js'
import { toast } from 'react-toastify'

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      if (!formData.username || !formData.password) {
        throw new Error("Please fill in all fields")
      }

      // Admin login with username/password
      const res = await api.post('/auth/admin-login', {
        username: formData.username,
        password: formData.password
      })

      if (res.data.success) {
        const user = res.data.user
        localStorage.setItem("accessToken", res.data.accessToken)
        localStorage.setItem("refreshToken", res.data.refreshToken)
        localStorage.setItem("user", JSON.stringify(user))
        
        login(user)
        toast.success("Login successful!")
        navigate("/")
      }
    } catch (err) {
      let errorMessage = "Login failed. Please try again."
      
      if (err.response) {
        // Server responded with an error
        const status = err.response.status
        const serverMessage = err.response.data?.message
        
        if (status === 401 || status === 403) {
          errorMessage = serverMessage || "Invalid username or password. Please check your credentials and try again."
        } else if (status === 404) {
          errorMessage = "User not found. Please check your username."
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later."
        } else if (serverMessage) {
          errorMessage = serverMessage
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Heading>GTW Admin Login</Heading>

        <Field>
          <Label>Username or Email</Label>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username or email"
          />
        </Field>

        <Field>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </Field>


        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </Button>

        <Link 
          to="/forgot-password" 
          className="text-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Forgot Password?
        </Link>

        <Text className="text-center text-sm text-gray-600">
          GTW Admin Panel - Admin Access Only
        </Text>
        <Text className="text-center text-xs text-gray-500">
          Only users with admin role can access this panel
        </Text>
      </form>
    </AuthLayout>
  )
}
