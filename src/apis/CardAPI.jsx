import axios from "axios";

const CardAPI = {
    createCard: (cardData, accessToken) => {
      return axios.post('http://localhost:8080/cards', cardData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          console.log('API Response:', response.data);
        })
        .catch((error) => {
          console.error('API Error:', error);
  
          // Check if the error is due to a duplicate account
          if (error.response && error.response.status === 400) {
            throw new Error('Card already exists. Please choose a different name.');
          } else {
            throw error; // Re-throw other errors
          }
        });
    },
    getAllCards: (accessToken) => {
      return axios.get('http://localhost:8080/cards', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then((response) => {
          console.log('API Response:', response.data);
          return response.data; // Return the card data
        })
        .catch((error) => {
          console.error('API Error:', error);
          throw error; // Re-throw errors
        });
    },
}

export default CardAPI;