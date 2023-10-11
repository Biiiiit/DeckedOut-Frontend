import React, { useState } from 'react';
import axios from "axios";
import './RegisterForm.css';
import RegisterFormContent from '../components/RegisterFormContent';


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
      <RegisterFormContent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default RegisterForm;
