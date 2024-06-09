import React, { useState } from "react";
import "./App.css";
import Weather from "./currentLocation";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.style.backgroundColor = darkMode ? "white" : "black";
  };

  return (
    <React.Fragment>
      <button onClick={toggleDarkMode} className="toggle_btn">
        {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>
      <div className={`container ${darkMode ? "dark-mode" : ""}`}>
        <Weather darkMode={darkMode} />
      </div>
      <div className={`footer-info ${darkMode ? "dark-mode" : ""}`}>
        <h3 sclassName={`footer-info ${darkMode ? "dark-mode" : ""}`}>
          Dhanush Ramudri
        </h3>
        (Kraftshala frontend Development Intern)
      </div>
    </React.Fragment>
  );
}

export default App;
