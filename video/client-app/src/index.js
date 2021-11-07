import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Core from './Core';
import Webcam from './Webcam';

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path={"/"}>
          <Core />
        </Route>
        <Route path={"/webcam"}>
          <Webcam />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

navigator.serviceWorker.ready.then(registration => {
  registration.unregister();
});