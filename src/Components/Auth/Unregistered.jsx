import React, {useState} from 'react';
import TizenPage from '../TizenPage';
import TdLibController from '../../Stores/TdLibController';
import './Auth.css';
import {Redirect} from 'react-router-dom';

export default function Unregistered() {
  const [redirect, setRedirect] = useState(false);

  async function handleClick() {
    setRedirect(true);
    TdLibController.logOut();
  }

  return (
      <TizenPage>
        <div className="ui-header flex">
          <div className="unregistered-icon">
            {/*(='o'=)*/}
            <span role="img" aria-label="Oh no">😮😯😮</span>
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
        {redirect && <Redirect to="/"/>}
      </TizenPage>
  );
}