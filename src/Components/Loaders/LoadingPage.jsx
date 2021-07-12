import React from 'react';
import TizenPage from '../TizenPage';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingPage() {
  console.log('[LoadingPage]');
  const flex = {
    display: 'flex !important',
    flexDirection: 'column !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    flexWrap: 'nowrap !important',
  };

  return (
      <TizenPage>
        <div className="ui-content ui-content-padding" style={flex}>
          <div className="small-processing-container">
            <LoadingSpinner/>
            <div className="ui-processing-text">Loading</div>
          </div>
        </div>
      </TizenPage>
  );
}
