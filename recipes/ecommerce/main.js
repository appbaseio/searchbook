import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Onboarding from 'appbase-onboarding';

import { dataOperation } from '../services/DataOperation';
import LoginScreen from '../shared/LoginScreen';
import AppCreation from './steps/AppCreation';
import UpdateMapping from './steps/UpdateMapping';
import IndexData from './steps/IndexData';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			profile: null,
			loadingProgress: true
		};
	}

	componentWillMount() {
		this.getUser();
	}

	getUser() {
		this.setState({
			loadingProgress: true
		});

		dataOperation.getUser().done((res) => {
			this.setState({
				loadingProgress: false,
				profile: res
			});
			dataOperation.updateUser(res.body);
		}).fail((res) => {
			this.setState({
				loadingProgress: false
			});
		});
	}

	container() {
		let view = (<LoginScreen></LoginScreen>);
		const steps = [
			'Create an app',
			'Define data model',
			'Index data',
			'Ecommerce App UI'
		];
		if(this.state.profile) {
			view = (
				<Onboarding brandImage='' steps={steps}>
					<AppCreation key={0} />
					<UpdateMapping key={1} />
					<IndexData key={2} />
				</Onboarding>
			);
		}
		return view;
	}

	render() {
		return (
			<div>{this.container()}</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('onboarding-container'));
