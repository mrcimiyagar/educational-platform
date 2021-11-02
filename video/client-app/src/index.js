import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import App from './App';

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});