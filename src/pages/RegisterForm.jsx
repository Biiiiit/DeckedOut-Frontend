import React, { useState } from 'react';
import '../pages/css/RegisterForm.css';
import { useNavigate } from 'react-router-dom';
import RegistrationAPI from '../apis/RegistrationAPI';
import AuthAPI from '../apis/AuthAPI';
import RegisterFormContent from '../components/RegisterFormContent';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    type: 'normal',
  });

  const [message, setMessage] = useState({
    success: null,
    content: '',
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

    RegistrationAPI.register(userData)
      .then(() => AuthAPI.login(formData.username, formData.password))
      .then((claims) => {
        console.log('Login successful! Claims:', claims);
        setMessage({
          success: true,
          content: 'Registration and login successful!',
        });
        navigate('/');
      })
      .catch((error) => {
        if (error.message.includes('Account already exists')) {
          setMessage({
            success: false,
            content: 'Account already exists. Please choose a different username or email.',
          });
        } else {
          setMessage({
            success: false,
            content: 'Unexpected error during registration. Please try again.',
          });
        }
      });
  };

  return (
    <div className="register-container">
      <RegisterFormContent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        message={message}
      />
    </div>
  );
};

export default RegisterForm;
