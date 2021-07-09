import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {colors, token} from '../../util/settings';

class ColorSwitcher extends Component {
	constructor(props) {
		super();

		this.toggle = this.toggle.bind(this);
		this.changeThemeColor = this.changeThemeColor.bind(this);
		this.addEvents = this.addEvents.bind(this);
		this.removeEvents = this.removeEvents.bind(this);
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.getContainer = this.getContainer.bind(this);

		this.state = {
			isOpen: false,
			selectedColor:localStorage.getItem('themeColor')
		};
	}

	getContainer() {
		return ReactDOM.findDOMNode(this);
	}

	toggle(e) {
		e.preventDefault();
		const isOpen = this.state.isOpen;
		if (!isOpen) {
			this.addEvents();
		} else {
			this.removeEvents();
		}
		this.setState({
			isOpen: !isOpen
		})
	}
	changeThemeColor(e, color) {
		e.preventDefault();
		/*localStorage.setItem('themeColor', color)
		this.toggle(e);
		let requestOptions4 = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'token': token
			},
			body: JSON.stringify({
				themeColor: color
			}),
			redirect: 'follow'
		};
		fetch("../auth/setup_config", requestOptions4)
			.then(response => response.json())
			.then(result => {
				console.log(JSON.stringify(result));
				setTimeout(()=>{
					window.location.reload();
				},500);
			});*/
	}

	componentWillMount() {
		this.removeEvents();
	}


	addEvents() {
		['click', 'touchstart'].forEach(event =>
			document.addEventListener(event, this.handleDocumentClick, true)
		);
	}
	removeEvents() {
		['click', 'touchstart'].forEach(event =>
			document.removeEventListener(event, this.handleDocumentClick, true)
		);
	}

	handleDocumentClick(e) {
		const container = this.getContainer();
		if ((container.contains(e.target) || container === e.target)) {
			return;
		}
		this.toggle(e);
	}

	render() {
		const selectedColor = this.state.selectedColor
		return (
		<div style={{marginTop: -56, backgroundColor: colors.primaryDark, width: window.innerWidth + 'px', height: window.innerHeight + 'px', position: 'absolute', left: 0, right: 0, top: 56, bottom: 0}}>
			<h1>تنظیمات</h1>
			<div className={`theme-colors ${'shown'}`} style={{backgroundColor: colors.primaryLight, position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 300}}>
				<div className="p-4">
					<p style={{color: colors.textIcons}}>تم روشن</p>
					<div className="d-flex flex-row justify-content-between mb-4">
						<a href="#" className={`theme-color theme-color-purple ${selectedColor==='light.purple'?'active':''}`} onClick={e => this.changeThemeColor(e, 'light.purple')}></a>
						<a href="#" className={`theme-color theme-color-blue ${selectedColor==='light.blue'?'active':''}`} onClick={e => this.changeThemeColor(e, 'light.blue')}></a>
						<a href="#" className={`theme-color theme-color-green ${selectedColor==='light.green'?'active':''}`} onClick={e => this.changeThemeColor(e, 'light.green')}></a>
						<a href="#" className={`theme-color theme-color-orange ${selectedColor==='light.orange'?'active':''}`} onClick={e => this.changeThemeColor(e, 'light.orange')}></a>
						<a href="#" className={`theme-color theme-color-red ${selectedColor==='light.red'?'active':''}`} onClick={e => this.changeThemeColor(e, 'light.red')}></a>
					</div>
					<p style={{color: colors.textIcons}}>تم تیره</p>
					<div className="d-flex flex-row justify-content-between">
						<a href="#" className={`theme-color theme-color-purple ${selectedColor==='dark.purple'?'active':''}`} onClick={e => this.changeThemeColor(e, 'dark.purple')}></a>
						<a href="#" className={`theme-color theme-color-blue ${selectedColor==='dark.blue'?'active':''}`} onClick={e => this.changeThemeColor(e, 'dark.blue')}></a>
						<a href="#" className={`theme-color theme-color-green ${selectedColor==='dark.green'?'active':''}`} onClick={e => this.changeThemeColor(e, 'dark.green')}></a>
						<a href="#" className={`theme-color theme-color-orange ${selectedColor==='dark.orange'?'active':''}`} onClick={e => this.changeThemeColor(e, 'dark.orange')}></a>
						<a href="#" className={`theme-color theme-color-red ${selectedColor==='dark.red'?'active':''}`} onClick={e => this.changeThemeColor(e, 'dark.red')}></a>
					</div>
				</div>
			</div>
		</div>
		);
	}
}

export default ColorSwitcher;

