


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import chatbotLogo from './chatbot (1).png';
import './LoginPage.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    };

    try {
      const response = await axios.post('https://chatbot-server-six.vercel.app/login', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      const user = { userId: data.userId, email: data.email };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    const userData = {
      email: email,
      newPassword: newPassword
    };

    try {
      const response = await axios.post('https://chatbot-server-six.vercel.app/resetPassword', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);
      if (response.status === 200) {
        setForgotPassword(false);
        setSuccessMessage('Password reset successful!');
      } else {
        setErrorMessage('Password update failed!');
      }
    } catch (error) {
      setErrorMessage('Error resetting password');
    }
  };

  return (
    <div className="login-container">
      <img src={chatbotLogo} alt="Chatbot Logo" className="logo" />
      <h2 className="title">Login</h2>
      {!forgotPassword ? (
        <>
          {errorMessage && <p className="error">{errorMessage}</p>}
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} className="input" />

            <label className="label">Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} className="input" />

            <button type="submit" className="button">
              Login
            </button>
          </form>
          <p className="register-link">
            Don't have an account? <Link to="/register" className="link">Register</Link>
          </p>
          <p className="forgot-password" onClick={handleForgotPassword}>
            Forgot password?
          </p>
        </>
      ) : (
        <>
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <form className="form" onSubmit={handleForgotPasswordSubmit}>
            <label className="label">Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} className="input" />

            <label className="label">New Password:</label>
            <input type="password" value={newPassword} onChange={handleNewPasswordChange} className="input" />

            <label className="label">Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} className="input" />

            <button type="submit" className="button">
              Reset Password
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
