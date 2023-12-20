import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenManager from '../apis/TokenManager';
import GameAPI from '../apis/GameAPI';
import './css/ViewGamesPage.css';
import defaultImage from '../assets/placeholder.png';

const ViewGamesPage = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const accessToken = TokenManager.getAccessToken();

  useEffect(() => {
    const fetchGamesByDeveloper = async () => {
      try {
        const developerID = TokenManager.getClaims().Id;
        const response = await GameAPI.getGamesByDeveloper(developerID, accessToken);

        console.log('API Response:', response);

        if (response) {
          if (response.data && response.data.games) {
            console.log('Games Found:', response.data.games);
            setGames(response.data.games);
          } else {
            console.error('Invalid API response - missing data or games property:', response);
          }
        } else {
          console.error('Invalid API response - response is undefined');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGamesByDeveloper();
  }, [accessToken]);

  const handleGameItemClick = (gameId) => {
    console.log(`Navigating to /gameInfo/${gameId}`);
    // Navigate to the GameInfoPage with the clicked game's ID
    navigate(`/gameInfo/${gameId}`);
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">Your Games</h2>
      {games.length > 0 ? (
        <ul className="games-list">
          {games.map((game) => (
            <li key={game.id} onClick={() => handleGameItemClick(game.id)}>
              <img
                className="game-icon"
                src={game.icon || "https://picsum.photos/200"}
                alt={`${game.name} icon`}
              />
              {game.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#04d9ff' }}>No games found.</p>
      )}
    </div>
  );
};

export default ViewGamesPage;