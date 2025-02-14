import "../css/header.css";

import { Data, ScreenSize } from "../App";
import { useContext, useState } from "react";

export default function Header({ selectedCategory, setSelectedCategory }) {
  const screenSize = useContext(ScreenSize);

  return (
  <>
    {screenSize > 768 ? 
      <HeaderTablet /> 
      : 
      <HeaderMobile
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
    }
  </>
  );
}

function HeaderMobile({ selectedCategory, setSelectedCategory }) {
  const { data } = useContext(Data);
  const [hamburger, setHamburger] = useState(false);

  return (
    <>
      <header className="header-mobile">
        <div className="header-mobile-left">
          <h1>Frontend Mentor</h1>
          <p>Feedback Board</p>
        </div>
        <label>
          <input type="checkbox" checked={hamburger} onChange={() => setHamburger(!hamburger)} />
          <img src={hamburger ? "/images/hamburger-icon-cross.svg" : "/images/hamburger-icon.svg"} alt="" />
        </label>
      </header>
      {hamburger && (
        <div className="hamburger-menu-container">
          <div className="hamburger-menu-contents">
            <div className="hamburger-menu-categories">
              <button 
                className={"hamburger-menu-category" + (selectedCategory === "All" ? " active" : "")} 
                onClick={() => setSelectedCategory("All")}>
                All
              </button>
              {data.categories.map((category, index) => (
                <button 
                  key={index} 
                  className={"hamburger-menu-category" + (selectedCategory === category ? " active" : "")}
                  onClick={() => setSelectedCategory(category)}>
                  {category}
                </button>
              ))}
            </div>
            <div className="hamburger-menu-roadmap">
              <div className="hamburger-menu-roadmap-header">
                <h2>Roadmap</h2>
                <a href="#/feedback">View</a>
              </div>
              <ul>
                {data.statuses.map((roadmap, index) => (
                  <li key={index}>
                    <div className="hamburger-menu-roadmap-item">
                      <span>{roadmap.name}</span>
                      <span>{roadmap.count}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeaderTablet() {
  const { data } = useContext(Data);

  return <header></header>;
}
