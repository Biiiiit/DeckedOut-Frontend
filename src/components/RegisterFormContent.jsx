import React from 'react';
import { Link } from 'react-router-dom';

const RegisterFormContent = ({ formData, handleChange, handleSubmit, message }) => {
  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
          >
            <option value="normal">Normal</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Link to="/login">Already have an account? Login here</Link>
        <button type="submit">Register</button>
      </form>
      {message.success !== null && (
        <p className={message.success ? 'success-message' : 'error-message'}>
          {message.content}
        </p>
      )}
    </div>
  );
};

export default RegisterFormContent;
