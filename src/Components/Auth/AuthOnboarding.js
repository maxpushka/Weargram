import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import './Auth.css';

export default function AuthOnboarding({path}) {
  console.log('at AuthOnboarding', path);

  function onGoingBack() {
    console.log('prevented going back');
    window.history.forward();
  }

  useEffect(() => {
    console.log('adding back button prevention event');
    window.addEventListener('popstate', onGoingBack);

    return function() {
      console.log('removing back button prevention event');
      window.removeEventListener('popstate', onGoingBack);
    };
  }, []);

  return (
      <div className="ui-page ui-page-active">
        <div className="ui-header flex"
             style={{height: 'min-content', marginBottom: '22px'}}>
          <img src={process.env.PUBLIC_URL + '/icons/app-icon.svg'}
               alt="Weargram logo"
               style={{width: '81px', height: '81px'}}/>
          <p style={{margin: '4px 0 1rem 0'}}>Sign in to Telegram</p>
        </div>

        <div className="ui-content flexBody">
          <div className="flex" style={{width: '120px'}}>
            <Link to={`${path}/phone`} target="_self"
                  className="ui-btn ui-btn-icon ui-btn-circle btn-large"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +
                    '/icons/phone_white_48dp.svg'})`,
                  }}/>
            <div className="btn-label">Log in by phone number</div>
          </div>

          <div className="flex" style={{width: '120px'}}>
            <Link to={`${path}/qr`} target="_self"
                  className="ui-btn ui-btn-icon ui-btn-circle btn-large"
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL +
                    '/icons/round-qr-code-scanner.svg'})`,
                  }}/>
            <div className="btn-label">Log in by QR code</div>
          </div>
        </div>
      </div>
  );
}
