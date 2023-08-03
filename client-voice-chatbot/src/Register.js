import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import chatbot from './chatbot (1).png';
import './RegisterPage.css';

function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCPasswordChange = (e) => {
    setCpassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password');
      return;
    }

    if (password !== cpassword) {
      setErrorMessage('Password does not match');
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post('https://chatbot-server-six.vercel.app/register', userData);
      const data = response.data;
      const user = { userId: data.userId };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    } catch (error) {
      setErrorMessage('Registration failed');
    }
  };

  return (
    <div className="container">
      <img src={chatbot} alt="chatbot" className="chat-bot" />
      <h2 className="title">Registration</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">Email:</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />

        <label className="label">Password:</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />

        <label className="label">Confirm Password:</label>
        <input
          className="input"
          type="password"
          value={cpassword}
          onChange={handleCPasswordChange}
        />

        <button className="button" type="submit">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link className="link" to="/">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Registration;
