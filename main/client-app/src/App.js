import React, {Component, Fragment} from "react";
import {BrowserRouter, BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import ReactDOM from 'react-dom';
import App from "./containers/App";
import {useTheme, useMediaQuery, createMuiTheme, ThemeProvider, colors, createTheme} from '@material-ui/core';
import { AnimatedSwitch } from 'react-router-transition';
import './App.css';
import { ColorBase } from "./util/settings";
import { Provider } from 'react-redux';
import store from './redux/main';
import { createBrowserHistory } from "history";

export const hist = createBrowserHistory();

export let isDesktop;
let pageOnTheWay, setPageOnTheWay;

export let gotoPage = (p) => {
	setPageOnTheWay(p);
  setTimeout(() => {
    document.getElementById('gotoPageOnTheWay').click();
  }, 500);
}

export let drawerOpen = null, setDrawerOpen = null;
export let currentNav = null, setCurrentNav = null;

let Goto = (props) => {
	[pageOnTheWay, setPageOnTheWay] = React.useState('');
	return <Link id={'gotoPageOnTheWay'} to={pageOnTheWay} style={{display: 'none'}}/>
}

let DesktopDetector = (props) => {
  const theme = useTheme();
  isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  return <div/>;
}

function MainApp(props) {
  [drawerOpen, setDrawerOpen] = React.useState(false)
  [currentNav, setCurrentNav] = React.useState(0)
  let t = createTheme({
      zIndex: {
        appBar: 1048,
        modal: 1049,
      }
  })
  return (
      <ThemeProvider theme={t}>
        <Router history={hist}>
          <DesktopDetector/>
          <ColorBase/>
          <Goto/>
          <AnimatedSwitch
      atEnter={{ opacity: 0 }}
      atLeave={{ opacity: 0 }}
      atActive={{ opacity: 1 }}>
            <Route path="/" component={App}/>
          </AnimatedSwitch>
        </Router>
      </ThemeProvider>
  );
}

export default  ReactDOM.render(
  <Provider store={store}>
    <MainApp />
  </Provider>,
  document.getElementById("root")
);