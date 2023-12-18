import React, { useEffect, useState } from 'react';
import TokenManager from '../apis/TokenManager';
import GameAPI from '../apis/GameAPI';

const ViewGamesPage = () => {
  const [games, setGames] = useState([]);
  const accessToken = TokenManager.getAccessToken();

  useEffect(() => {
    // Function to fetch games by developer ID
    const fetchGamesByDeveloper = async () => {
        try {
            const developerID = TokenManager.getClaims().Id;
            const response = await GameAPI.getGamesByDeveloper(developerID, accessToken);
            
            // Check if the response has a 'data' property before accessing it
            if (response && response.data) {
                console.log('API Response:', response.data);
                setGames(response.data.games); // Assuming the response contains a 'games' property
            } else {
                console.error('Invalid API response:', response);
            }
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    };    

    fetchGamesByDeveloper();
  }, [accessToken]);

  return (
    <div>
      <h2>Your Games</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id}>{game.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewGamesPage;
