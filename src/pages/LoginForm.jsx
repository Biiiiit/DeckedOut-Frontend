import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginFormFields from '../components/LoginFormFields';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Implement your login logic here
    // You can send the login data to your backend, validate, and handle the response.
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <LoginFormFields formData={formData} handleChange={handleChange} />
        <button type="submit">Login</button>
        <Link to="/">Don't have an account? Register here</Link>
      </form>
    </div>
  );
};

export default LoginForm;
