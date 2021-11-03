import React from 'react';
import ReactDOM from 'react-dom';
import Core from './Core';

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});

ReactDOM.render(
  <React.StrictMode>
    <Core />
  </React.StrictMode>,
  document.getElementById('root')
);

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});