import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Tuấn Anh Tricker - All Rights Reserved
        </p>
        <div className="footer-links">
          <a href="https://github.com/TuanAnhCompany" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <span className="separator">•</span>
          <a href="https://tuananhtricker.blogspot.com/" target="_blank" rel="noopener noreferrer">
            Blog
          </a>
          <span className="separator">•</span>
          <a href="https://t.me/TuanAnhCompanyOffical" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 