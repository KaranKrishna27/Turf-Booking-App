import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css'

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const requestBody = JSON.stringify(formData);
        console.log('Request Payload:', requestBody);
    
        const response = await fetch('http://localhost:5000/api/users/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });
    
        if (response.ok) {
          const userData = await response.json();
          console.log('JSON Data received:', userData);
          localStorage.setItem('userInfo', JSON.stringify(userData));
          const userEmail = userData.email;
          const userId = userData._id;
  console.log('User email:', userEmail);
  console.log('User _id:', userId);

          navigate(userData.isAdmin ? '/mainpageadmin' : '/mainpageuser', { state: { userInfo: userData } });
          console.log('Login successful');
        } else {
      
          console.error('Login failed');
          if (response.status === 400) {
            alert('Email or password is incorrect.');
          }
    
          const errorData = await response.json();
          setErrors({ general: errorData.message || 'An unexpected error occurred. Please try again.' });
        }
      } catch (error) {
        
        console.error('Error during login:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="error">{errors.email}</p>
          )}
        </div>
        <div>
          <label>Password</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Sign In</button>  
      </form>
      <p>Already have an account?<Link to="/signup">Sign Up</Link></p>
    </div>
  );
}
export default SignIn;
