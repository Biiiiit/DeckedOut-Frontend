import React, { useState, useEffect } from 'react';
import './css/CreateGamePage.css';
import GameAPI from '../apis/GameAPI';
import TokenManager from '../apis/TokenManager';

const CreateGame = () => {
    const [claims, setClaims] = useState(null);
    const [gameInfo, setGameInfo] = useState({
        name: '',
        description: '',
        iconImage: null,
        bannerImage: null,
    });

    useEffect(() => {
        const accessToken = TokenManager.getAccessToken();
        setClaims(TokenManager.getClaims());
        console.log(accessToken);
    }, []); 

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        // Handle file inputs separately
        if (type === 'file') {
            setGameInfo((prevInfo) => ({ ...prevInfo, [name]: e.target.files[0] }));
        } else {
            setGameInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = TokenManager.getAccessToken();
            console.log(accessToken);
            if (!accessToken) {
                console.error('Access token is not defined');
                return;
            }
    
            // Create a new object with null values for all fields except name and description
            const updatedGameInfo = {
                name: gameInfo.name,
                description: gameInfo.description,
                icon: null,
                banner: null,
                gameAreas: null,
                gameCards: null,
                gameEnemies: null,
                gameLevels: null,
                gameCharacters: null,
                developer: claims.Id,
            };
            console.log(updatedGameInfo);
            
            await GameAPI.createGame(updatedGameInfo, accessToken);
            console.log('Game created successfully!');
            
            // Reset the form data after successful submission
            setGameInfo({
                name: '',
                description: '',
                iconImage: null,
                bannerImage: null,
            });
        } catch (error) {
            console.error('Error creating game:', error.message);
        }
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
