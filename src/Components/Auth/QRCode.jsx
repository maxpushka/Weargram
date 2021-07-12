import React, {useEffect, useRef, useState} from 'react';
import TizenPage from '../TizenPage';
import './Auth.css';
import ApplicationStore from '../../Stores/ApplicationStore';
import {isConnecting} from './Auth';
import QRCodeStyling from 'qr-code-styling';
import TdLibController from '../../Stores/TdLibController';
import LoadingSpinner from '../Loaders/LoadingSpinner';
import {Redirect} from 'react-router-dom';

export default function QRCode({passwordPath}) {
  console.log('[QRCode]');
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [connectionState, setConnectionState] = useState({connecting: false, showConnecting: false});
  const loggingOut = useRef(false);
  const [password, setPassword] = useState(false);
  const [link, setLink] = useState(null);

  useEffect(() => {
    console.log('[QRCode] redrawn existing link', link);
    loadData();
  });

  useEffect(() => {
    console.log('[QRCode] setting up handlers');
    ApplicationStore.on('updateConnectionState', onUpdateConnectionState);
    ApplicationStore.on('updateAuthorizationState', onUpdateAuthorizationState);
    window.addEventListener('popstate', onGoingBack);

    const state = ApplicationStore.getAuthorizationState();
    if (state?.['@type'] !== 'authorizationStateWaitOtherDeviceConfirmation') {
      TdLibController.send({
        '@type': 'requestQrCodeAuthentication',
        other_user_ids: [],
      });
    } else {
      console.log('[QRCode] stored qr login link', state.link);
      setLink(state.link);
    }

    return function() {
      console.log('[QRCode] removing QRCode handlers');
      ApplicationStore.off('updateConnectionState', onUpdateConnectionState);
      ApplicationStore.off('updateAuthorizationState', onUpdateAuthorizationState);
      window.removeEventListener('popstate', onGoingBack);
    };
  }, []);

  useEffect(() => {
    console.log('[QRCode] received new link value', link);
    loadData();
  }, [link]);

  function onUpdateConnectionState(update) {
    const {state} = update;

    console.log('[QRCode] connection', update);

    const connecting = isConnecting(state);
    if (connectionState.connecting === connecting) return;

    setConnectionState({connecting, showConnecting: false});
    if (connecting) {
      setTimeout(() => {
        if (connectionState.connecting) {
          setConnectionState({...connectionState, showConnecting: true});
        }
      }, 500);
    }
  }

  function onUpdateAuthorizationState(update) {
    console.log('[QRCode] new auth state', update);
    const state = update?.['authorization_state']['@type'];
    if (state === 'authorizationStateWaitOtherDeviceConfirmation') {
      const {link: newLink} = update?.['authorization_state'];

      if (newLink && newLink.startsWith('tg://login?token=') && newLink !== link) {
        setLink(newLink);
      }
    }
    if (state === 'authorizationStateWaitPassword') {
      setPassword(true);
    }
  }

  function loadData() {
    if (!link) return;

    const qrCode = new QRCodeStyling({
      'width': 170,
      'height': 170,
      'data': link,
      'margin': 0,
      'qrOptions': {'typeNumber': '0', 'mode': 'Byte', 'errorCorrectionLevel': 'Q'},
      'imageOptions': {'hideBackgroundDots': true, 'imageSize': 0.4, 'margin': 0},
      'dotsOptions': {'type': 'extra-rounded', 'color': '#ffffff'},
      'backgroundOptions': {'color': '#50a2e9'},
      'image': null,
      'dotsOptionsHelper': {
        'colorType': {'single': true, 'gradient': false},
        'gradient': {
          'linear': true,
          'radial': false,
          'color1': '#6a1a4c',
          'color2': '#6a1a4c',
          'rotation': '0',
        },
      },
      'cornersSquareOptions': {'type': 'extra-rounded', 'color': '#ffffff'},
      'cornersSquareOptionsHelper': {
        'colorType': {'single': true, 'gradient': false},
        'gradient': {
          'linear': true,
          'radial': false,
          'color1': '#000000',
          'color2': '#000000',
          'rotation': '0',
        },
      },
      'cornersDotOptions': {'type': '', 'color': '#ffffff'},
      'cornersDotOptionsHelper': {
        'colorType': {'single': true, 'gradient': false},
        'gradient': {
          'linear': true,
          'radial': false,
          'color1': '#000000',
          'color2': '#000000',
          'rotation': '0',
        },
      },
      'backgroundOptionsHelper': {
        'colorType': {'single': true, 'gradient': false},
        'gradient': {
          'linear': true,
          'radial': false,
          'color1': '#ffffff',
          'color2': '#ffffff',
          'rotation': '0',
        },
      },
    });

    const qrCanvas = document.getElementById('qr-canvas');
    if (qrCanvas) {
      qrCanvas.innerHTML = null;
      qrCode.append(qrCanvas);
    }
  }

  function togglePopup() {
    console.log('[QRCode] popupIsOpen', !popupIsOpen);
    setPopupIsOpen(!popupIsOpen);
  }

  async function onGoingBack() {
    if (window.location.href.includes(passwordPath)) return;

    console.log('Logging out', loggingOut.current);
    if (!loggingOut.current) {
      loggingOut.current = true;
      TdLibController.logOut();
    }
  }

  return (
      popupIsOpen ?
          <HelpPopup togglePopup={togglePopup}/> :
          <TizenPage>
            <div className="ui-content flex">
              <button onClick={togglePopup}
                      className="ui-btn ui-btn-icon ui-btn-circle btn-small"
                      style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL +
                        '/icons/help_center_white_48dp.svg'}`,
                      }}/>
              <div id="qr-canvas" className="flex qr-canvas">
                {(!link || connectionState.showConnecting) && <LoadingSpinner/>}
              </div>
            </div>
            {password && <Redirect to={passwordPath}/>}
          </TizenPage>
  );
}

function HelpPopup({togglePopup}) {
  console.log('[HelpPopup]');
  const publicPath = process.env.PUBLIC_URL;
  return (
      <TizenPage>
        <div className="ui-content" style={{marginTop: '4.5rem'}}>
          <ol style={{padding: '0 20px'}}>
            <li className="help">
              <img src={publicPath + '/icons/looks_one_white_48dp.svg'} alt="1."/>
              <span>Open Telegram on your phone</span>
            </li>
            <li className="help">
              <img src={publicPath + '/icons/looks_two_white_48dp.svg'} alt="2."/>
              <span>Go to <b>Settings</b> > <b>Devices</b> > <b>Scan QR</b></span>
            </li>
            <li className="help">
              <img src={publicPath + '/icons/looks_three_white_48dp.svg'} alt="3."/>
              <span>Point your phone at this screen to confirm login</span>
            </li>
          </ol>
        </div>
        <div className="ui-footer ui-bottom-button">
          <button className="ui-btn" onClick={togglePopup}>
            OK
          </button>
        </div>
      </TizenPage>
  );
}
