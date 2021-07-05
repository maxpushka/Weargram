import React from 'react';

export default React.forwardRef(
    function TizenPage({children}, ref) {
      // "ui-page-active" class is essential here
      // since the first occurrence of div with this
      // class is shown on screen while others are hidden
      return (
          <div ref={ref} className="ui-page ui-page-active">
            {children}
          </div>
      );
    }
);