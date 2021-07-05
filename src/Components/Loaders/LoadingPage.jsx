import React from 'react';
import TizenPage from '../TizenPage';
import LoadingSpinner from './LoadingSpinner';

export default function LoadingPage() {
  console.log('[LoadingPage]');
  return (
      <TizenPage>
        <div className="ui-content ui-content-padding">
          <div className="small-processing-container">
            <LoadingSpinner/>
            <div className="ui-processing-text">Loading</div>
          </div>
        </div>
      </TizenPage>
  );
}
