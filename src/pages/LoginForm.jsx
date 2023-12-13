import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginFormFields from '../components/LoginFormFields';
import '../pages/css/LoginForm.css';
import AuthAPI from '../apis/AuthAPI';

const LoginForm = (props) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loginStatus, setLoginStatus] = useState({
    success: null,
    message: '',
  });

  const handleLogin = async () => {
    try {
      // Use AuthAPI.login method for authentication
      const claims = await AuthAPI.login(formData.username, formData.password);
      props.setClaims(claims);
      console.log('Login successful! Claims:', claims);
      setLoginStatus({
        success: true,
        message: 'Login successful!',
      });
      setFormData({
        username: '',
        password: '',
      });
      navigate('/');
    } catch (error) {
      // Handle login failure
      console.error('Error during login:', error.message);
      setLoginStatus({
        success: false,
        message: 'Login failed. Check your credentials.',
      });
    }
  };

  return (
    <div className="login-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="login-form"
      >
        <h2>Login</h2>
        <LoginFormFields formData={formData} handleChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
        <Link to="/register">Don't have an account? Register here</Link>
        <button type="submit">Login</button>
        {loginStatus.success === false && loginStatus.message !== null && (
          <p className="error-message">{loginStatus.message}</p>
        )}
        {loginStatus.success === true && loginStatus.message !== null && (
          <p className="success-message">{loginStatus.message}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
