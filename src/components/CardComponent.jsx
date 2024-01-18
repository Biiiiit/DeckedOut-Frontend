import React, { useRef, useEffect } from 'react';
import CardTemplate from '../assets/card template.png';

const CardComponent = ({ card }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the card template
    const cardImg = new Image();
    cardImg.src = CardTemplate; // Replace with the actual path
    ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);

    // Draw the values on the card
    ctx.font = '25px Viner Hand ITC';
    ctx.fillStyle = 'black';

    if (card.name) {
      const centerX = canvas.width / 2;
      const textWidth = ctx.measureText(card.name).width;
      const xPos = centerX - textWidth / 2;
      ctx.fillText(`${card.name}`, xPos, 50);
    }

    // Add additional logic to draw other card data based on your requirements
    // You can use similar logic as in the GameCardsModal component

  }, [card]);

  return (
    <div className="card-preview">
      <h3>{card.name}</h3>
      <canvas ref={canvasRef} width={200} height={300}></canvas>
    </div>
  );
};

export default CardComponent;
