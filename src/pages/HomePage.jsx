import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';
import TokenManager from '../apis/TokenManager';

const HomePage = () => {
  const [claims, setClaims] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = TokenManager.getAccessToken();
        console.log('Token:', token);

        if (token) {
          const newClaims = TokenManager.getClaims();
          console.log('New Claims:', newClaims);
          setClaims(newClaims);
        } else {
          console.log('Token not found, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
        navigate('/login');
      }
    };

    fetchClaims();
  }, [navigate]);

  console.log('Current Claims:', claims);

  return (
    <Layout>
      <div>
        {claims && <h1>Welcome, {claims.sub}!</h1>}
      </div>
    </Layout>
  );
};

export default HomePage;
