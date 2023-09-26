import { useState } from 'react';
import Settings from '../resources/Settings';
import '../styles.css';

const Header = ({ isSwapShown, setIsSwapShown }) => {
  return (
    <div className="space-between-flex">
      <div className="header-container">
        <span
          className={`header clickable hover-underline ${
            isSwapShown ? '' : 'text-link-unfocused'
          }`}
          onClick={() => setIsSwapShown(true)}>
          Swap
        </span>
        <span
          className={`header clickable hover-underline ${
            isSwapShown ? 'text-link-unfocused' : ''
          }`}
          onClick={() => setIsSwapShown(false)}>
          Buy
        </span>
      </div>
      <div></div>
      {/* <div className="clickable">
        <Settings />
      </div> */}
    </div>
  );
};

export default Header;
