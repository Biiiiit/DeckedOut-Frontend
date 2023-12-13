import React, { useState } from 'react';
import './css/CreateGamePage.css';

const CreateGame = () => {
  const [gameInfo, setGameInfo] = useState({
    name: '',
    description: '',
    iconImage: null,
    bannerImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle file inputs separately
    if (type === 'file') {
      setGameInfo((prevInfo) => ({ ...prevInfo, [name]: e.target.files[0] }));
    } else {
      setGameInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', gameInfo);
  };

  const renderPreview = () => {
    return (
      <div className="preview-section">
        <div className="live-preview">
          {gameInfo.bannerImage && (
            <img src={URL.createObjectURL(gameInfo.bannerImage)} alt="Banner" className="banner-image" />
          )}
          {gameInfo.iconImage && (
            <img src={URL.createObjectURL(gameInfo.iconImage)} alt="Icon" className="icon-image" />
          )}
          <div className="info">
            <h3>{gameInfo.name}</h3>
            <p className='description'>{gameInfo.description}</p>
            <button type="submit" onClick={handleSubmit}>
              Create Game
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="create-game-container">
      <form className="create-game-form">
        <div className="input-section">
          <h2>Create Game</h2>
          <label>
            Name:
            <input type="text" name="name" value={gameInfo.name} onChange={handleChange} />
          </label>
          <br />
          <label>
            Description:
            <textarea name="description" value={gameInfo.description} onChange={handleChange} />
          </label>
          <br />
          <label>
            Icon Image:
            <input type="file" name="iconImage" onChange={handleChange} />
          </label>
          <br />
          <label>
            Banner Image:
            <input type="file" name="bannerImage" onChange={handleChange} />
          </label>
        </div>
        {renderPreview()}
      </form>
    </div>
  );
};

export default CreateGame;
