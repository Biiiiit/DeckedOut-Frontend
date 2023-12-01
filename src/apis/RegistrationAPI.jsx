import axios from "axios";

const RegistrationAPI = {
  register: (userData) => axios.post('http://localhost:8080/users', userData)
    .then((response) => {
      console.log('API Response:', response.data);
    })
    .catch((error) => {
      console.error('API Error:', error);

      // Check if the error is due to a duplicate account
      if (error.response && error.response.status === 400) {
        throw new Error('Account already exists. Please choose a different username or email.');
      } else {
        throw error; // Re-throw other errors
      }
    }),
};

export default RegistrationAPI;
