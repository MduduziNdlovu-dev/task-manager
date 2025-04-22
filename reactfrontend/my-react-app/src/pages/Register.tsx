import { useState, ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { register, RegisterData } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface RegisterErrors {
  firstname?: string
  lastname?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function Register() {
  const [userData, setUserData] = useState<RegisterData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const { login } = useAuth()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value)
      // Clear error when user types
      if (errors.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
      }
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }))
      // Clear error when user types
      if (errors[name as keyof RegisterErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {}
    
    if (!userData.firstname.trim()) {
      newErrors.firstname = 'First name is required'
    }
    
    if (!userData.lastname.trim()) {
      newErrors.lastname = 'Last name is required'
    }
    
    if (!userData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!userData.password) {
      newErrors.password = 'Password is required'
    } else if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (userData.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      const token = await register(userData)
      login(token)
      
      toast.success('Registration successful')
    } catch (error: any) {
      console.error('Registration failed:', error)
      
      toast.error(
        error.response?.data?.message || 'Could not create account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-gray-500">Enter your information to create a new account</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstname" className="block text-sm font-medium">First name</label>
                <input
                  id="firstname"
                  name="firstname"
                  placeholder="John"
                  value={userData.firstname}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.firstname ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstname && <p className="text-sm text-red-500">{errors.firstname}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastname" className="block text-sm font-medium">Last name</label>
                <input
                  id="lastname"
                  name="lastname"
                  placeholder="Doe"
                  value={userData.lastname}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.lastname ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastname && <p className="text-sm text-red-500">{errors.lastname}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={userData.email}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={userData.password}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}