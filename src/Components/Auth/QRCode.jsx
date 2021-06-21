import React from 'react';
import TizenPage from '../TizenPage';

export default function QRCode() {
  console.log('at QRCode');
  return (
      <TizenPage>
        <div className="ui-content">
          <p>QR login page</p>
        </div>
      </TizenPage>
  );
}