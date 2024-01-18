import React, { useState, useRef, useEffect } from 'react';
import CardTemplate from "../assets/card template.png";
import swordIcon from "../assets/sword_icon.png";
import shieldIcon from "../assets/shield icon.png";
import healingIcon from "../assets/healing icon.png";
import CardAPI from "../apis/CardAPI";
import TokenManager from '../apis/TokenManager';

const GameCardsModal = ({ isOpen, onClose }) => {
  const [cardData, setCardData] = useState({
    name: '',
    type: 'Atk', // Default value
    damage: 0,
    healing: 0,
    shielding: 0,
  });

  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow two numeric fields to have values above 0
    if (['damage', 'healing', 'shielding'].includes(name)) {
      setCardData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10) > 0 ? parseInt(value, 10) : 0,
      }));
    } else {
      setCardData((prevData) => ({
        ...prevData,
        [name]: name === 'type' ? value : value,
      }));
    }
  };

  const areTwoFieldsAboveZero = (field) => {
    const valuesAboveZero = ['damage', 'healing', 'shielding'].filter((key) => cardData[key] > 0);
    return valuesAboveZero.length >= 2 && cardData[field] === 0;
  };

  const handleMouseOver = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if the mouse is over a specific area
    if (x >= 6 && x <= 50 && y >= 30 && y <= 50) {
      setTooltip('Damage');
    } else if (x >= 6 && x <= 50 && y >= 50 && y <= 266.5) {
      setTooltip('Healing');
    } else if (x >= 173 && x <= 200 && y >= 266.5 && y <= 290) {
      setTooltip('Shielding');
    } else {
      setTooltip(null);
    }
  };

  useEffect(() => {
    // Draw on canvas when cardData changes
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the card template
    const cardImg = new Image();
    cardImg.src = CardTemplate;
    ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);

    // Draw the values on the card
    ctx.font = '25px Viner Hand ITC';
    ctx.fillStyle = 'black';

    if (cardData.name) {
      const centerX = canvas.width / 2;
      const textWidth = ctx.measureText(cardData.name).width;
      const xPos = centerX - textWidth / 2;

      ctx.fillText(`${cardData.name}`, xPos, 50);
    }

    if (cardData.type === 'Atk') {
      // If the card type is 'Atk', display the sword icon in the center
      const swordImg = new Image();
      swordImg.src = swordIcon;
      const swordWidth = 180;
      const swordHeight = 180;
      const swordX = (canvas.width - swordWidth) / 2;
      const swordY = (canvas.height - swordHeight) / 2;
      ctx.drawImage(swordImg, swordX - 5, swordY, swordWidth, swordHeight);
    }
    else if (cardData.type === 'Shield') {
      const shieldImg = new Image();
      shieldImg.src = shieldIcon;
      const shieldWidth = 180;
      const shieldHeight = 180;
      const shieldX = (canvas.width - shieldWidth) / 2;
      const shieldY = (canvas.height - shieldHeight) / 2;
      ctx.drawImage(shieldImg, shieldX, shieldY + 5, shieldWidth, shieldHeight);
    }
    else {
      const healingImg = new Image();
      healingImg.src = healingIcon;
      const healingWidth = 180;
      const healingHeight = 180;
      const healX = (canvas.width - healingWidth) / 2;
      const healY = (canvas.height - healingHeight) / 2;
      ctx.drawImage(healingImg, healX - 1.5, healY, healingWidth, healingHeight);
    }

    if (cardData.damage > 0) {
      // Always show damage at the top left
      ctx.fillText(`${cardData.damage}`, 6, 50);
    }

    if (cardData.healing > 0) {
      // Show healing at the top left if damage is 0
      const xPos = cardData.damage > 0 ? 172 : 6;
      const yPos = cardData.damage > 0 ? 266.5 : 50;
      ctx.fillText(`${cardData.healing}`, xPos, yPos);
    }

    if (cardData.shielding > 0) {
      // Always show shielding at the bottom
      ctx.fillText(`${cardData.shielding}`, 173, 266.5);
    }
  }, [cardData]);

  const saveCard = async (e) => {
    e.preventDefault();
    try {
      const accessToken = TokenManager.getAccessToken();
      console.log(accessToken);
      if (!accessToken) {
        console.error('Access token is not defined');
        return;
      }

      // Create a new object with null values for all fields except name and description
      const CardInfo = {
        name: cardData.name,
        typeOfCard: cardData.type,
        damage: cardData.damage,
        shielding: cardData.shielding,
        healing: cardData.healing
      };
      console.log(CardInfo);

      await CardAPI.createCard(CardInfo, accessToken);
      console.log('Card created successfully!');

      // Reset the form data after successful submission
      setCardData({
        name: '',
        typeOfCard: 'Atk',
        damage: 0,
        healing: 0,
        shielding: 0,
      });
    } catch (error) {
      console.error('Error creating game:', error.message);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="columns">
          <div className="left-half">
            <h3>Create Card</h3>
            <label htmlFor="cardName">Card Name:</label>
            <input
              type="text"
              id="cardName"
              name="name"
              value={cardData.name}
              onChange={handleInputChange}
            />
            <label htmlFor="cardType">Card Type:</label>
            <select
              id="cardType"
              className='select'
              name="type"
              value={cardData.type}
              onChange={handleInputChange}
            >
              <option value="Atk">Attack</option>
              <option value="Heal">Heal</option>
              <option value="Shield">Shield</option>
            </select>
            <label htmlFor="damage">Damage:</label>
            <input
              type="number"
              id="damage"
              name="damage"
              value={cardData.damage}
              onChange={handleInputChange}
              disabled={areTwoFieldsAboveZero('damage')}
            />
            <label htmlFor="healing">Healing:</label>
            <input
              type="number"
              id="healing"
              name="healing"
              value={cardData.healing}
              onChange={handleInputChange}
              disabled={areTwoFieldsAboveZero('healing')}
            />
            <label htmlFor="shielding">Shielding:</label>
            <input
              type="number"
              id="shielding"
              name="shielding"
              value={cardData.shielding}
              onChange={handleInputChange}
              disabled={areTwoFieldsAboveZero('shielding')}
            />
          </div>
          <div className="right-half">
            <h3>Preview</h3>
            <canvas
              ref={canvasRef}
              width={200}
              height={300}
              onMouseMove={handleMouseOver}
              onMouseOut={() => setTooltip(null)}
            ></canvas>
            {tooltip && <div className="tooltip">{tooltip}</div>}
          </div>
        </div>
        <button className="custom-button" onClick={saveCard}>Save Card</button>
        <button className="custom-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameCardsModal;