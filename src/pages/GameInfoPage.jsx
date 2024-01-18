import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameAPI from '../apis/GameAPI';
import TokenManager from '../apis/TokenManager';
import './css/GameInfoPage.css';
import DefaultIcon from '../assets/galaxy.png';
import GameCardsModal from '../components/GameCardsModal';
import GameCharactersModal from '../components/GameCharacterModal';

// Modal component for Game Areas
const GameAreasModal = ({ isOpen, onClose }) => {
  // Add your input fields and logic for Game Areas modal
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>Game Areas Modal</h3>
        {/* Add your input fields and buttons for Game Areas */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};


// Modal component for Game Enemies
const GameEnemiesModal = ({ isOpen, onClose }) => {
  // Add your input fields and logic for Game Enemies modal
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>Game Enemies Modal</h3>
        {/* Add your input fields and buttons for Game Enemies */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Modal component for Game Levels
const GameLevelsModal = ({ isOpen, onClose }) => {
  // Add your input fields and logic for Game Levels modal
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>Game Levels Modal</h3>
        {/* Add your input fields and buttons for Game Levels */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const GameInfoPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState(null);
  const [error, setError] = useState(null);

  // State for managing modals
  const [gameAreasModalOpen, setGameAreasModalOpen] = useState(false);
  const [gameCardsModalOpen, setGameCardsModalOpen] = useState(false);
  const [gameEnemiesModalOpen, setGameEnemiesModalOpen] = useState(false);
  const [gameLevelsModalOpen, setGameLevelsModalOpen] = useState(false);
  const [gameCharactersModalOpen, setGameCharactersModalOpen] = useState(false);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const accessToken = TokenManager.getAccessToken();
        const response = await GameAPI.getGamesByID(id, accessToken);

        setGameDetails(response.data);
      } catch (error) {
        console.error('Error fetching game details:', error.message);
        setError(error.message);
      }
    };

    fetchGameDetails();
  }, [id]);

  console.log(`GameInfoPage rendered with ID: ${id}`);

  const handleButtonClick = (gameObject) => {
    // Set the corresponding modal state to open
    switch (gameObject) {
      case 'gameAreas':
        setGameAreasModalOpen(true);
        break;
      case 'gameCards':
        setGameCardsModalOpen(true);
        break;
      case 'gameEnemies':
        setGameEnemiesModalOpen(true);
        break;
      case 'gameLevels':
        setGameLevelsModalOpen(true);
        break;
      case 'gameCharacters':
        setGameCharactersModalOpen(true);
        break;
      // Add cases for other game objects
      default:
        break;
    }
  };

  const closeModal = () => {
    // Close all modals
    setGameAreasModalOpen(false);
    setGameCardsModalOpen(false);
    setGameEnemiesModalOpen(false);
    setGameLevelsModalOpen(false);
    setGameCharactersModalOpen(false);
    // Close other modals here
  };

  return (
    <div className="gameform-container">
      {gameDetails && gameDetails.banner ? (
        <img src={URL.createObjectURL(gameDetails.banner)} alt="Banner" className="gameform-banner" />
      ) : (
        <img src={DefaultIcon} alt="Default Banner" className="gameform-banner" />
      )}
      {gameDetails && gameDetails.icon ? (
        <img src={URL.createObjectURL(gameDetails.icon)} alt="Icon" className="gameform-icon" />
      ) : (
        <img src="https://picsum.photos/200" alt="Default Icon" className="gameform-icon" />
      )}

      <h2 className="gameform-heading">Game Details</h2>
      {error ? (
        <p className="error">Error fetching game details: {error}</p>
      ) : gameDetails ? (
        <>
          <p className="label">Game ID:</p>
          <p className="value">{id}</p>

          <p className="label">Game Name:</p>
          <p className="value">{gameDetails.name}</p>

          <p className="label">Game Description:</p>
          <p className="value">{gameDetails.description}</p>

          {/* Add buttons for each game object */}
          <button className="openModalButton" onClick={() => handleButtonClick('gameAreas')}>Game Areas</button>
          <button className="openModalButton" onClick={() => handleButtonClick('gameCards')}>Game Cards</button>
          <button className="openModalButton" onClick={() => handleButtonClick('gameEnemies')}>Game Enemies</button>
          <button className="openModalButton" onClick={() => handleButtonClick('gameLevels')}>Game Levels</button>
          <button className="openModalButton" onClick={() => handleButtonClick('gameCharacters')}>Game Characters</button>
          {/* Add buttons for other game objects */}
        </>
      ) : (
        <p className="loading">Loading game details...</p>
      )}

      {/* Render modals */}
      <GameAreasModal isOpen={gameAreasModalOpen} onClose={closeModal} />
      <GameCardsModal isOpen={gameCardsModalOpen} onClose={closeModal} />
      <GameEnemiesModal isOpen={gameEnemiesModalOpen} onClose={closeModal} />
      <GameLevelsModal isOpen={gameLevelsModalOpen} onClose={closeModal} />
      <GameCharactersModal isOpen={gameCharactersModalOpen} onClose={closeModal} />
      {/* Render other modals here */}
    </div>
  );
};

export default GameInfoPage;
