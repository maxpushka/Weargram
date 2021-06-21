import React from 'react';

export default function TizenPage({children}) {
  // "ui-page-active" class is essential here
  // since the page with this class is shown on
  // screen while others are hidden
  return (
      <div className="ui-page ui-page-active">
        {children}
      </div>
  );
}