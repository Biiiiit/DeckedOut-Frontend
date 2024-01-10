import axios from "axios";

const GameAPI = {
  createGame: (gameData, accessToken) => {
    return axios.post('http://localhost:8080/games', gameData, {
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
          throw new Error('Game already exists. Please choose a different name.');
        } else {
          throw error; // Re-throw other errors
        }
      });
  },

  getGamesByDeveloper: (developerID, accessToken) => {
    return axios.get(`http://localhost:8080/games/developer/${developerID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        console.log('API Response:', response.data);
        return response; // Return the response
      })
      .catch((error) => {
        console.error('API Error:', error.response); // Log the error response for debugging
        throw error; // Re-throw the error for further handling
      });
  },
  getGamesByID: (gameID, accessToken) => {
    return axios.get(`http://localhost:8080/games/${gameID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        console.log('API Response:', response.data);
        return response; // Return the response
      })
      .catch((error) => {
        console.error('API Error:', error.response); // Log the error response for debugging

        // Check if the error is due to the game not found
        if (error.response && error.response.status === 404) {
          throw new Error('Game not found.');
        } else {
          throw error; // Re-throw other errors
        }
      });
  }
};

export default GameAPI;