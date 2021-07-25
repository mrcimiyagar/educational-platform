import React, { Component } from 'react';
import { Route, withRouter, Switch, Redirect, Link } from 'react-router-dom';

import TopNav from '../containers/TopNav'
import Sidebar from '../containers/Sidebar';

import ConferencePage from "./pages/room"
import HomePage from "./pages/home"
import surveyDetail from "./pages/survey-detail"
import surveyList from "./pages/survey"
import SettingsPage from "./pages/settings"
import DefaultDashboard from "./pages/main"
import MessengerPage from './pages/messenger'
import ChatPage from './pages/chat'
import ProfilePage from './pages/profile'
import StorePage from './pages/store'
import StoreBotPage from './pages/storeBot'
import StoreAdsPage from './pages/storeAds'
import DeckPage from './pages/deck'
import NotesPage from './pages/notes'
import PollPage from './pages/polls'
import RoomsTreePage from './pages/roomsTree'
import HomeSpacePage from './pages/homeSpace'
import { AnimatedSwitch } from 'react-router-transition'
import '../App.css'

class MainApp extends Component {
	render() {
		const { match, containerClassnames} = this.props;
		return (
			<div id="app-container" className={containerClassnames}>
				<main>
					<div>
          <AnimatedSwitch
      atEnter={{ opacity: 0 }}
      atLeave={{ opacity: 0 }}
      atActive={{ opacity: 1 }}>
            				<Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
							<Route path={`${match.url}/conf`} component={ConferencePage} />
							<Route path={`${match.url}/home`} component={HomePage} />
							<Route path={`${match.url}/messenger`} component={MessengerPage} />
							<Route path={`${match.url}/chat`} component={ChatPage} />
							<Route path={`${match.url}/profile`} component={ProfilePage} />
							<Route path={`${match.url}/store`} component={StorePage} />
							<Route path={`${match.url}/storebot`} component={StoreBotPage} />
							<Route path={`${match.url}/storeads`} component={StoreAdsPage} />
							<Route path={`${match.url}/deck`} component={DeckPage} />
							<Route path={`${match.url}/notes`} component={NotesPage} />
							<Route path={`${match.url}/poll`} component={PollPage} />
							<Route path={`${match.url}/roomstree`} component={RoomsTreePage} />
							<Route path={`${match.url}/homespace`} component={HomeSpacePage} />
							<Route path={`${match.url}/main`} component={DefaultDashboard} />
							<Route
								path={`${match.url}/survey/:surveyid`}
								component={surveyDetail}
								isExact
							/>
							<Route
								path={`${match.url}/survey`}
								component={surveyList}
								isExact
							/>
						</AnimatedSwitch>
					</div>
				</main>
			</div>
		);
	}
}
  
export default withRouter(MainApp);