import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthLayout } from "../components/auth-layout"
import { Button } from "../components/button"
import { Input } from "../components/input"
import { Field, Label } from "../components/fieldset"
import { Heading } from "../components/heading"
import { Text } from "../components/text"
import api from '../utils/api.js'
import { toast } from 'react-toastify'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Step 1: Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!formData.email) {
        throw new Error("Please enter your email")
      }

      const res = await api.post('/auth/forgot-password', {
        email: formData.email
      })

      if (res.data.success) {
        toast.success("OTP sent to your email!")
        setStep(2)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send OTP"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP (optional, can skip to step 3)
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!formData.otp) {
        throw new Error("Please enter the OTP")
      }

      const res = await api.post('/auth/verify-otp', {
        email: formData.email,
        otp: formData.otp
      })

      if (res.data.success) {
        toast.success("OTP verified successfully!")
        setStep(3)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Invalid or expired OTP"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (formData.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      const res = await api.post('/auth/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      })

      if (res.data.success) {
        toast.success("Password reset successfully! Please login with your new password.")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reset password"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="grid w-full max-w-sm grid-cols-1 gap-6">
        <div>
          <Heading>GTW Admin - Reset Password</Heading>
          <Text className="mt-2 text-sm text-gray-600">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Enter your new password"}
          </Text>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="grid grid-cols-1 gap-6">
            <Field>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your admin email"
              />
            </Field>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <Link to="/login" className="text-center text-sm text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="grid grid-cols-1 gap-6">
            <Field>
              <Label>Enter OTP</Label>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <Text className="mt-1 text-xs text-gray-500">
                OTP sent to {formData.email}
              </Text>
            </Field>

            <div className="flex gap-3">
              <Button 
                type="button" 
                onClick={() => setStep(3)} 
                className="flex-1"
                outline
              >
                Skip Verification
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-center text-sm text-blue-600 hover:text-blue-800"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="grid grid-cols-1 gap-6">
            <Field>
              <Label>OTP Code</Label>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </Field>

            <Field>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                minLength={6}
              />
            </Field>

            <Field>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter new password"
                minLength={6}
              />
            </Field>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-center text-sm text-blue-600 hover:text-blue-800"
            >
              Back to OTP
            </button>
          </form>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>
      </div>
    </AuthLayout>
  )
}
