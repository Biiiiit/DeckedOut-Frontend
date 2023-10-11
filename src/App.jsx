import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
