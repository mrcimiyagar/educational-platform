import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch, Link } from 'react-router-dom';

import { NotificationContainer } from "../components/ReactNotifications";

import MainRoute from '../routes';
import error from '../routes/pages/error'
import AppLocale from '../lang';

import RegisterLayout from "../routes/pages/register";
import Auth from "../routes/pages/auth";
import Auth2 from "../routes/pages/auth2";
import Auth3 from "../routes/pages/auth3";
import Verification from "../routes/pages/verification";

import '../assets/css/vendor/bootstrap.min.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { AnimatedSwitch } from 'react-router-transition';
import '../App.css';

const InitialPath = ({ component: Component, authUser, ...rest }) =>
	<Route
		{...rest}
		render={props =>
			<Component {...props} />}
	/>;

class App extends Component {
	render() {
		const { location, match, user, locale } = this.props;
		const currentAppLocale = AppLocale[locale];
		return (
			<Fragment>
						<NotificationContainer />
						
						<AnimatedSwitch
      atEnter={{ opacity: 0 }}
      atLeave={{ opacity: 0 }}
      atActive={{ opacity: 1 }}>
							<Redirect exact from={`/`} to={`/app/home`} />
							<Route path={`/app/register`} component={Auth3} />
							<Route path={`/app/auth`} component={Auth} />
							<Route path={`/app/auth2`} component={Auth2} />
							<Route path={`/app/auth3`} component={RegisterLayout} />
            				<Route path={`/app/verification`} component={Verification} />
							<InitialPath
								path={`${match.url}app`}
								authUser={user}
								component={MainRoute}
							/>
							<Route path={`/error`} component={error} />
						</AnimatedSwitch>
			</Fragment>
				
		);
	}
}

export default App;