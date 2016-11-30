import React from 'react';
import ReactDOM from 'react-dom';
import Onboarding from 'appbase-onboarding';

import AppCreation from './steps/AppCreation';

const steps = [
	'Create an app',
	'Define data model',
	'Index data',
	'Ecommerce App UI'
];

ReactDOM.render(
	<Onboarding brandImage='' steps={steps}>
		<AppCreation key={0} />
	</Onboarding>,
	document.getElementById('onboarding-container')
);
