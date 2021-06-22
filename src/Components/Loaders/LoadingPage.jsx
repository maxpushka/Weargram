import React, {useEffect, useRef, useState} from 'react';

export default function LoadingPage() {
  const page = useRef(null);
  let [processing, setProcessing] = useState({visibility: 'hidden'});

  useEffect(() => {
    page.current.addEventListener('pageshow',
        () => setProcessing({visibility: ''}), {once: true});
    page.current.addEventListener('pagebeforehide',
        () => setProcessing({visibility: 'hidden'}), {once: true});
  }, []);

  return (
      <div className="ui-page ui-page-active" ref={page}>
        <div className="ui-content ui-content-padding">
          <div className="small-processing-container">
            <div className="ui-processing" style={processing}/>
            <div className="ui-processing-text">Loading</div>
          </div>
        </div>
      </div>
  );
}
