import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { LoginModal } from './LoginModal';

export default class LoginScreen extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		var loginModal = (<LoginModal></LoginModal>);
		return (
			<div>
				<div className="left">
				</div>
				<div className="right">
					<div className="step">
						<h2>Get started with an interactive tutorial for Ecommerce App</h2>
						{loginModal}
					</div>
				</div>
			</div>
		);
	}
}

LoginScreen.propTypes = {
};
// Default props value
LoginScreen.defaultProps = {
};
