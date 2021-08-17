
import React, {Component, Fragment, useEffect} from "react";
import { Suspense } from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./redux/main";
import { useLoading, TailSpin } from '@agney/react-loading';
import CloudIcon from '@material-ui/icons/Cloud';
import { Typography } from "@material-ui/core";
import RoomWallpaper from './images/roomWallpaper.png'

const MainApp = React.lazy(() => {
	return Promise.all([
	  import("./App"),
	  new Promise(resolve => setTimeout(resolve, 5000))
	])
	.then(([moduleExports]) => moduleExports);
});

let Loading = (props) => {
	const { containerProps, indicatorEl } = useLoading({
	  loading: true,
	  indicator: <TailSpin width="256" height="256"/>,
	})
	return (
		<section {...props}>
			<div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
				<CloudIcon style={{width: 112, height: 112, fill: '#fff'}}/>
				<Typography variant={'h5'} style={{width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center', color: '#fff'}}>ابر آسمان</Typography>
			</div>
	    	{indicatorEl}
		</section>
	)
}

ReactDOM.render(
	<Provider store={store}>
	  <Suspense fallback={
	  	<div style={{width: '100%', height: '100vh', backgroundColor: 'rgba(96, 0, 128, 1)'}}>
		  <img src={RoomWallpaper} style={{marginRight: -16, position: 'fixed', width: 'calc(100% + 16px)', height: '100%', objectFit: 'cover'}}/>
		  <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', position: 'fixed', top: 0, left: 0}}/>
		  <Loading style={{position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}/>
		</div>}>
	    <MainApp />
	  </Suspense>
	</Provider>,
	document.getElementById("root")
);
  