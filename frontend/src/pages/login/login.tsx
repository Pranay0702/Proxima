import React, { useState } from 'react';
import {  
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  User
} from 'lucide-react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../shared/config/api';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'username is required';
    } 

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    login(formData).then((res: AxiosResponse) => {
        console.log("login response:", res.data);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
        console.log("User logged in successfully");
        navigate('/home', {replace: true});
    }).catch(
        (error: AxiosError) => {
        const message = error.response?.data as string?? 'Server error'
        toast.error(message);
        }
    ).finally(() => {
        setIsLoading(false);
        } 
    )
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login data:', formData);
      // Handle successful login here
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* username */}
          <div className="lform-group">
            <label htmlFor="username">Username</label>
            <div className="linput-wrapper">
                <div className="linput-container">
                <User className="linput-icon" />
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`lform-input ${errors.username ? 'error' : ''}`}
                    placeholder="Enter your username"
                />
                </div>
              {errors.username && (
                <div className="lerror-message">
                  <AlertCircle className="lerror-icon" />
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="lform-group">
            <label htmlFor="password">Password</label>
            <div className="linput-container">
              <Lock className="linput-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`lform-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="lpassword-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <div className="lerror-message">
                <AlertCircle className="lerror-icon" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-checkmark"></span>
              <span className="checkbox-label">Remember me</span>
            </label>

            <Link to ="/forgot" className="forgot-password-link">Forgot password?</Link>

          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className="lsubmit-button">
            {isLoading ? (
              <div className="lloading-content">
                <div className="lloading-spinner"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Sign Up Link */}
          <div className="signup-section">
            <p className="signup-link">
              Don't have an account? <Link to ="/register"> Create account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
