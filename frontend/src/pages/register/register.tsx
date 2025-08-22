import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { User__ } from '../../shared/interfaces/register.interface';
import { toast } from 'react-toastify';
import { AxiosError, AxiosResponse } from 'axios';
import { register } from '../../shared/config/api';

interface FormErrors {
  [key: string]: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User__>({
    username: '',
    email: '',
    location: '',
    jobTitle: '',
    description: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    register(formData).then ((res: AxiosResponse) => {
      console.log('checking for errors regarding response', res);
      toast.success('Registration successful!');
      navigate('/');
    }).catch(
      (error: AxiosError) => {
        const message = error.response?.data as String ?? 'Server error';
        toast.error(message);
      }
    ).finally(() => {
      setIsLoading(false);
      }
    )

    {/*// Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Registration data:', formData);
      // Handle successful registration here
    }, 2000);*/}
    
  };

  const getPasswordStrength = (password: string): { strength: string; className: string } => {
    if (password.length === 0) return { strength: '', className: '' };
    if (password.length < 6) return { strength: 'Weak', className: 'weak' };
    if (password.length < 10) return { strength: 'Medium', className: 'medium' };
    return { strength: 'Strong', className: 'strong' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join our community and get started today</p>
        </div>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className='input-wrapper'>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.username}
                </div>
              )}
            </div>
          </div>
        

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Location and Job Title Row */}
          <div className="form-row">
            {/* Location */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className='input-wrapper'>
                <div className="input-container">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`form-input ${errors.location ? 'error' : ''}`}
                    placeholder="City, Country"
                  />
                </div>
                {errors.location && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.location}
                  </div>
                )}
              </div>
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <div className='input-wrapper'>
                <div className="input-container">
                  <Briefcase className="input-icon" />
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`form-input ${errors.jobTitle ? 'error' : ''}`}
                    placeholder="Your current role"
                  />
                </div>
                {errors.jobTitle && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.jobTitle}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <div className='input-wrapper'>
              <div className="input-container">
                <FileText className="textarea-icon" />
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  placeholder="Tell us about yourself and your professional background..."
                />
              </div>
              {errors.description && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Password Fields Row */}
          <div className="form-row">
            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {formData.password && (
                <div className={`password-strength ${passwordStrength.className}`}>
                  Password strength: {passwordStrength.strength}
                </div>
              )}
              {errors.password && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="success-message">
                  <CheckCircle className="success-icon" />Passwords match</div>
              )}
              {errors.confirmPassword && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="loading-spinner"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <p className="signin-link">
            Already have an account? <Link to="/"> Sign in here!</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

