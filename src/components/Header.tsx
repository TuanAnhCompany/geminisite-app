import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src="/logo.svg" alt="GeminiSite Logo" />
          <div>
            <span className="logo-text">GeminiSite</span>
            <span className="logo-tagline">by Tuấn Anh Tricker</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 