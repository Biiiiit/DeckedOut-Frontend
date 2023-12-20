import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from './pages/LoginForm';
import HomePage from './pages/HomePage';
import TopNavbar from './components/TopNavbar';
import TokenManager from './apis/TokenManager';
import UserPage from './pages/UserPage';
import CreateGamePage from './pages/CreateGamePage';
import ViewGamesPage from './pages/ViewGamesPage';
import GameInfoPage from './pages/GameInfoPage';

function App() {

  const [claims, setClaims] = useState(TokenManager.getClaims());

  const link = {
    path: "/"
  }

  return (
    <div className="App">
      <Router>
        <TopNavbar claims={claims} to={link.path} />
        <Routes>
        <Route path="/register" element={<RegisterForm setClaims={setClaims}/>} />
        <Route path="/" element={<HomePage setClaims={setClaims}/>} />
        <Route path="/login" element={<LoginForm setClaims={setClaims}/>}/>
        <Route path="/users/:name" element={<UserPage/>} />
        <Route path="/createGame" element={<CreateGamePage setClaims={setClaims}/>}/>
        <Route path="/viewGames" element={<ViewGamesPage setClaims={setClaims}/>}/>
        <Route path="/gameInfo/:id" element={<GameInfoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
