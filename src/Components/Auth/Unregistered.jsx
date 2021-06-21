import React from 'react';
import TizenPage from '../TizenPage';
import TdLibController from '../../Utils/TdLibController';
import './Auth.css';

export default function Unregistered() {
  function handleClick() {
    TdLibController.logOut();
    // redirect is not needed since App component
    // automatically updates based on auth state
  }

  return (
      <TizenPage>
        <div className="ui-header flex">
            <div className="unregistered-icon">
              (='o'=)
            </div>
        </div>
        <div className="ui-content" style={{fontSize: '1.5rem'}}>
          <p style={{color: '#009af9'}}>The user is not registered.</p>
          <p style={{fontSize: '75%', lineHeight: '24px'}}>Sign up using the official Telegram app and try again</p>
        </div>
        <div className="ui-footer ui-bottom-button">
          <button className="ui-btn" onClick={handleClick}>
            OK
          </button>
        </div>
      </TizenPage>
  );
}