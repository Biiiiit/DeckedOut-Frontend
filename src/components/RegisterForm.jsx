import React, { useState } from 'react';
import axios from "axios";
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    type: 'normal', 
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

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      type: formData.type.toLowerCase(), 
    };
    console.log(userData);

    axios.post("http://localhost:8080/users", userData)
      .then((response) => {
        console.log('API Response:', response.data);
        setFormData({
          username: '',
          email: '',
          password: '',
          type: 'normal',
        });
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
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
            value={formData.type}
            onChange={handleChange}
          >
            <option value="normal">Normal</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;