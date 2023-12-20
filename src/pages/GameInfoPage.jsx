import React from 'react';
import { useParams } from 'react-router-dom';

const GameInfoPage = () => {
  const { id } = useParams();
  console.log(`GameInfoPage rendered with ID: ${id}`);

  return (
    <div>
      <h2>Game ID: {id}</h2>
      {/* You can fetch and display other game details here */}
    </div>
  );
};

export default GameInfoPage;
