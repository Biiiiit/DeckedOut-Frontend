import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from './pages/LoginForm';

function App() {

  const link = {
    path: "/"
  }

  return (
    <div className="App">
      <Router>
        <NavLink to={link.Path} />
        <Routes>
        <Route path="/" element={<RegisterForm/>} />
        <Route path="/login" element={<LoginForm/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
