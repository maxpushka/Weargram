import React, {useEffect, useState} from 'react';
import TizenPage from '../TizenPage';
import './Auth.css';
import ApplicationStore from '../../Utils/ApplicationStore';
import {isConnecting} from './Auth';
import QRCodeStyling from 'qr-code-styling';
import TdLibController from '../../Utils/TdLibController';
import LoadingSpinner from '../Loaders/LoadingSpinner';
import {Redirect} from 'react-router-dom';

export default function QRCode({passwordPath}) {
  console.log(`at ${QRCode.name}`);
  let [popupIsOpen, setPopupIsOpen] = useState(false);
  let [connectionState, setConnectionState] = useState({connecting: false, showConnecting: false});
  let [password, setPassword] = useState(false);
  let [link, setLink] = useState(null);

  useEffect(() => {
    console.log('redrawn existing link', link);
    loadData();
  });

  useEffect(() => {
    console.log('setting up QRCode handlers');
    ApplicationStore.on('updateConnectionState', onUpdateConnectionState);
    ApplicationStore.on('updateAuthorizationState', onUpdateAuthorizationState);

    const state = ApplicationStore.getAuthorizationState();
    if (state?.['@type'] !== 'authorizationStateWaitOtherDeviceConfirmation') {
      TdLibController.send({
        '@type': 'requestQrCodeAuthentication',
        other_user_ids: [],
      });
    } else {
      console.log('stored qr login link', state.link);
      setLink(state.link);
    }

    return function() {
      console.log('removing QRCode handlers');
      ApplicationStore.off('updateConnectionState', onUpdateConnectionState);
      ApplicationStore.off('updateAuthorizationState', onUpdateAuthorizationState);
    };
  }, []);

  useEffect(() => {
    console.log('received new link value', link);
    loadData();
  }, [link]);

  function onUpdateConnectionState(update) {
    const {state} = update;

    console.log('connection', update);

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
    console.log('QRCode new auth state', update);
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
    console.log('popupIsOpen', !popupIsOpen);
    setPopupIsOpen(!popupIsOpen);
  }

  return (
      popupIsOpen ?
          <HelpPopup togglePopup={togglePopup}/> :
          <TizenPage>
            <div className="ui-header flex" style={{margin: '1rem 0'}}>
              <button onClick={togglePopup}
                      className="ui-btn ui-btn-icon ui-btn-circle btn-small"
                      style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL +
                        '/icons/help_center_white_48dp.svg'}`,
                      }}/>
            </div>
            <div className="ui-content flex">
              <div id="qr-canvas" className="flex qr-canvas">
                {(!link || connectionState.showConnecting) && <LoadingSpinner/>}
              </div>
            </div>
            {password && <Redirect to={passwordPath}/>}
          </TizenPage>
  );
}

function HelpPopup({togglePopup}) {
  console.log(`at ${HelpPopup.name}`);
  const publicPath = process.env.PUBLIC_URL;
  return (
      <TizenPage>
        <div className="ui-content" style={{marginTop: '2.5rem'}}>
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
