import React, {useEffect, useRef, useState} from 'react';
import TizenPage from '../TizenPage';
import TdLibController from '../../Stores/TdLibController';
import ApplicationStore from '../../Stores/ApplicationStore';
import {isConnecting} from './Auth';
import './Auth.css';

export default function Password() {
  console.log('[Password]');
  const [badPassword, setBadPassword] = useState({'state': false, 'errorString': ''});
  const [connecting, setConnecting] = useState(() => {
    const state = ApplicationStore.getConnectionState()?.state;
    return isConnecting(state);
  });
  const inputEl = useRef(null);
  const passwordHint = useRef('');

  useEffect(() => {
    console.log('[Password] setting up Password listeners');
    ApplicationStore.on('updateConnectionState', onUpdateConnectionState);

    passwordHint.current = ApplicationStore.getAuthorizationState()?.['password_hint'];
    return function() {
      console.log('[Password] removing Password listeners');
      ApplicationStore.off('updateConnectionState', onUpdateConnectionState);
    };
  }, []);

  useEffect(() => {
    badPassword.state ?
        inputEl.current.classList.add('bad-input') :
        inputEl.current.classList.remove('bad-input');
  }, [badPassword]);

  function onUpdateConnectionState(update) {
    const {state} = update;
    setConnecting(isConnecting(state));
  }

  function handleNext() {
    const password = inputEl.current.value;
    if (password) {
      handleDone(password);
    } else {
      setBadPassword({state: true, errorString: 'Invalid password. Please try again.'});
    }
  }

  function handleDone(password) {
    TdLibController.send({
      '@type': 'checkAuthenticationPassword',
      'password': password,
    }).then(result => {
      console.log('[Password] password is successfully confirmed', result);
    }).catch(error => {
      let errorString;
      if (error && error['@type'] === 'error' && error.message) {
        if (error.message === 'PASSWORD_HASH_INVALID') {
          errorString = 'Invalid password';
        } else {
          errorString = error.message;
        }
      } else {
        errorString = JSON.stringify(error);
      }

      setBadPassword({'state': true, 'errorString': errorString});
    });
  }

  return (
      <TizenPage>
        <div className="ui-content flex" data-handler="true">
          <p style={{fontSize: '34px', margin: '1rem 0'}}>
            {connecting ?
                (<>Connection is lost. Reconnecting...</>) :
                (<>Enter your password</>)}
          </p>
          <p style={{margin: '.5rem 0', fontSize: '24px', lineHeight: '28px'}}>
            Your account is protected<br/>with an additional password
          </p>
          <input ref={inputEl} placeholder={passwordHint.current} type="password"
                 onClick={() => setBadPassword({state: false, errorString: ''})}/>
          {badPassword.state && <p className="bad-input">{badPassword.errorString}</p>}
          <button className="inline-btn" type="button" onClick={handleNext}>
            Next
          </button>
        </div>
        {/*<div className="ui-footer ui-bottom-button">*/}
        {/*<button className="ui-btn" type="button" onClick={handleNext}>*/}
        {/*  Next*/}
        {/*</button>*/}
        {/*</div>*/}
      </TizenPage>
  );
}