import React from 'react';
import PropTypes from 'prop-types';
import './ChatPlaceholder.css';

function ChatPlaceholder({index}) {
  const titleWidth = `${170 + Math.sin(index) * 10}px`;
  const contentWidth = `${200 + Math.cos(index) * 10}px`;
  console.log('[ChatPlaceholder]', titleWidth, contentWidth);

  return (
      <li className="chatlist-placeholder">
        <div className="chatlist-placeholder-wrapper">
          <div className="chatlist-placeholder-tile"/>
          <div className="chatlist-placeholder-inner-wrapper">
            <div className="tile-first-row">
              <div className="chatlist-placeholder-title" style={{width: titleWidth}}/>
            </div>
            <div className="tile-second-row">
              <div className="chatlist-placeholder-content" style={{width: contentWidth}}/>
            </div>
          </div>
        </div>
      </li>
  );
}

ChatPlaceholder.propTypes = {
  index: PropTypes.number.isRequired,
};

export default ChatPlaceholder;
