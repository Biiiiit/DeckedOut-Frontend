import React, { useState, useEffect } from 'react';
import CardComponent from '../components/CardComponent';
import CardAPI from '../apis/CardAPI';
import TokenManager from '../apis/TokenManager';

const GameCharactersModal = ({ isOpen, onClose }) => {
  const [characterData, setCharacterData] = useState({
    name: '',
    description: '',
    health: 0,
    ammo: 0,
  });
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const accessToken = TokenManager.getAccessToken();
        const response = await CardAPI.getAllCards(accessToken);
  
        if (response && response.cards) {
          const fetchedCards = response.cards || [];
          setCards(fetchedCards);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching cards:', error.message);
      }
    };
  
    fetchCards();
  }, []);  

  const [spriteFile, setSpriteFile] = useState(null);
  const [hovered, setHovered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCharacterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSpriteChange = (e) => {
    const file = e.target.files[0];
    setSpriteFile(file);
    console.log('Sprite file:', file);
  };

  const saveCharacter = (e) => {
    e.preventDefault();
    console.log('Character saved:', characterData);
    console.log('Sprite file:', spriteFile);
    onClose();
  };

  const handlePreviewHover = () => {
    setHovered(true);
  };

  const handlePreviewLeave = () => {
    setHovered(false);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>Create Character</h3>
        <div className="columns">
          <div className="column2">
            <label htmlFor="characterName">Character Name:</label>
            <input
              type="text"
              id="characterName"
              name="name"
              value={characterData.name}
              onChange={handleInputChange}
              className="small-input"
            />
            <label htmlFor="characterDescription">Character Description:</label>
            <textarea
              id="characterDescription"
              name="description"
              value={characterData.description}
              onChange={handleInputChange}
              className="small-input"
            />
            <label htmlFor="characterHealth">Character Health:</label>
            <input
              type="number"
              id="characterHealth"
              name="health"
              value={characterData.health}
              onChange={handleInputChange}
              className="small-input"
            />
            <label htmlFor="characterAmmo">Character Ammo:</label>
            <input
              type="number"
              id="characterAmmo"
              name="ammo"
              value={characterData.ammo}
              onChange={handleInputChange}
              className="small-input"
            />
            <label htmlFor="characterSprite">Character Sprite:</label>
            <input
              type="file"
              id="characterSprite"
              name="sprite"
              onChange={handleSpriteChange}
            />
          </div>
          <div className="column2">
            <h3>Preview</h3>
            <div
              className="preview-container"
              onMouseEnter={handlePreviewHover}
              onMouseLeave={handlePreviewLeave}
            >
              {/* Display the sprite file in the preview section */}
              {spriteFile && (
                <img
                  src={URL.createObjectURL(spriteFile)}
                  alt="Sprite Preview"
                  className="sprite-preview"
                />
              )}
              {/* Popup displaying input info on hover */}
              {hovered && (
                <div className="popup">
                  <p>Name: {characterData.name}</p>
                  <p>Description: {characterData.description}</p>
                  <p>Health: {characterData.health}</p>
                  <p>Ammo: {characterData.ammo}</p>
                </div>
              )}
            </div>
            <button className="custom-button2" onClick={saveCharacter}>
              Save Character
            </button>
            <button className="custom-button2" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="column2">
            <h3>Starting Deck</h3>
            {/* Render card previews */}
            {cards.map((card) => (
              <CardComponent key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCharactersModal;
