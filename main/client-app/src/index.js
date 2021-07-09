
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

/*
color options : 
	 'light.purple'		'dark.purple'
	 'light.blue'		  'dark.blue'
	 'light.green'		'dark.green'
	 'light.orange'		'dark.orange'
	 'light.red'		  'dark.red'
*/
import {ConnectToIo, FetchMe, roothPath, serverRoot, setConfig, validateToken} from "./util/Utils";
import React from "react";
import { setToken } from "./util/settings";
import isReachable from 'is-reachable';

export let ThemeColor = 'light.purple';
if (localStorage.getItem('themeColor')) {
	ThemeColor = localStorage.getItem('themeColor');
}

let token = localStorage.getItem('token');
setToken(token);

(async () => {

	if (await isReachable('https://kaspersoft.cloud')) {

		validateToken(token, (result) => {
			if (result) {
				let requestOptions4 = {
					method: 'POST',
					headers: {
					  'Content-Type': 'application/json',
					  'token': token
					},
					redirect: 'follow'
				  };
				fetch(serverRoot + "/auth/fetch_config", requestOptions4)
					.then(response => response.json())
					.then(result => {
						console.log(JSON.stringify(result));
						setConfig(result.config);
						ConnectToIo();
						FetchMe();
				
						let render = () => {
							const css = import('./assets/css/sass/themes/gogo.light.purple.scss').then(x => {
								const MainApp = require('./App');
							});
						};
				
						setTimeout(() => {
							render();
						}, 1000);
					});
			}
			else {
				let render = () => {
					const css = import('./assets/css/sass/themes/gogo.light.purple.scss').then(x => {
						const MainApp = require('./App');
					});
				};
				
				setTimeout(() => {
					render();
				}, 1000);
			}
		})
	} else {
		let render = () => {
			const css = import('./assets/css/sass/themes/gogo.light.purple.scss').then(x => {
				const MainApp = require('./App');
			});
		};
		
		setTimeout(() => {
			render();
		}, 1000);
	}
	
	// If you want your app to work offline and load faster, you can change
	// unregister() to register() below. Note this comes with some pitfalls.
	// Learn more about service workers: https://cra.link/PWA
	serviceWorkerRegistration.unregister();
	
	// If you want to start measuring performance in your app, pass a function
	// to log results (for example: reportWebVitals(console.log))
	// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
	reportWebVitals();
})();