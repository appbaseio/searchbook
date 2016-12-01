import React, { Component } from 'react';
import { dataOperation } from '../../services/DataOperation';
import { urlShare } from '../../services/UrlShare';
import { JsonView } from '../../shared/JsonView';

export default class UpdateMapping extends Component {
	constructor(props) {
		super(props);
		this.state = {
			typeName: 'test',
			readOnly: false,
			error: false,
			gemUrl: null
		};
		this.errorMsg = '';
		this.handleChange = this.handleChange.bind(this);
		this.applyUrl =  this.applyUrl.bind(this);
		this.dataObj = {
			"properties" : {
				"category" : {
					"type" : "string"
				},
				"brand" : {
					"type" : "string"
				},
				"name" : {
					"type" : "string"
				},
				"rating" : {
					"type" : "integer"
				},
				"dateOfRelease" : {
					"type" : "date",
					"format" : "YYYY-mm-dd"
				},
				"prize" :  {
					"type" : "double"
				},
				"piecesSold" : {
					"type" : "integer"
				}
			}
		};
	}
	componentWillMount() {
		let obj = {
			url: 'https://'+dataOperation.app.username+':'+dataOperation.app.password+'@scalr.api.appbase.io',
			appname: dataOperation.app.appName,
			version: '2.4.0',
			selectedType: [this.state.typeName],
			selectedTypes: [this.state.typeName],
			mappingObj: {
				inputFormat: 'mapping',
				selectedType: 'test',
				input: this.dataObj
			}
		};
		urlShare.compressInputState(obj).then((url) => {
			this.applyUrl(url);
		}).catch((error) => console.log(error));
	}
	applyUrl(url) {
		this.setState({
			gemUrl: 'https://opensource.appbase.io/gem/#?input_state='+url+'&h=false&subscribe=false'
			// gemUrl: 'http://127.0.0.1:8001/gem/#?input_state='+url+'&h=false&subscribe=false'
		});
	}
	handleChange(event) {
		this.setState({
			typeName: event.target.value
		});
	}
	submit() {
		this.readMapping();
	}
	readMapping() {
		dataOperation.readMapping(this.state.typeName).done((res) => {
			this.validateMapping(res);
		}).fail((res) => {
		});
	}
	validateMapping(res) {
		let flag = true;
		let errorMsg = null;
		let appProps = {
			"category": null,
			"brand": null,
			"name": null,
			"rating": null,
			"dateOfRelease": null,
			"prize": null,
			"piecesSold": null
		};
		if(res[dataOperation.app.appName].mappings.hasOwnProperty(this.state.typeName)) {
			for(let appProp in res[dataOperation.app.appName].mappings[this.state.typeName].properties) {
				appProps[appProp] = res[dataOperation.app.appName].mappings[this.state.typeName].properties[appProp];
				switch(appProp) {
					case 'category':
					case 'brand':
					case 'name':
						if(appProps[appProp].type !== 'string') {
							flag = false;
							errorMsg = appProp+' is set as '+appProps[appProp].type +' instead of string';
						}
					break;
					case 'rating':
					case 'piecesSold':
						if(appProps[appProp].type !== 'integer') {
							flag = false;
							errorMsg = appProp+' is set as '+appProps[appProp].type +' instead of integer';
						}
					break;
					case 'dateOfRelease':
						if(appProps[appProp].type !== 'date') {
							flag = false;
							errorMsg = appProp+' is set as '+appProps[appProp].type +' instead of date';
						}
					break;
					case 'prize':
						if(appProps[appProp].type !== 'double') {
							flag = false;
							errorMsg = appProp+' is set as '+appProps[appProp].type +' instead of double';
						}
					break;
				}
			}
			if(flag) {
				for(let appProp in appProps) {
					if(!appProps[appProp]) {
						flag = false;
						errorMsg = appProp+' is missing in mapping!';
					}
				}
			}
		} else {
			flag = false;
			errorMsg = 'Test type is missing, Type test in choose or create a type box and then apply mapping!';
		}
		if(flag) {
			this.setState({
				readOnly: true,
				error: false
			});
			this.props.nextStep();
		} else {
			this.errorMsg = errorMsg;
			this.setState({
				error: true
			});
		}
	}
	updateMapping() {
		dataOperation.updateMapping(this.state.typeName, this.mappingObj).done((res) => {
			this.setState({
				readOnly: true
			});
			this.props.nextStep();
		}).fail((res) => {
		});
	}
	renderComponent(type) {
		let element;
		switch(type) {
			case 'iframe':
				if(this.state.gemUrl) {
					element = (<iframe src={this.state.gemUrl} height="500px" width="100%" frameBorder="0"></iframe>);
				}
			break;
			case 'next':
				if(this.state.gemUrl) {
					if(!this.state.readOnly) {
						element = (
							<div className="input-field">
								<button className="btn btn-primary submit-btn pos-static" onClick={() => this.submit()}>
									Next
								</button>
							</div>
						);
					}
				}
			break;
		}
		return element;
	}
	showError() {
		return (
			<div className="error-box">
				{this.errorMsg}
			</div>
		)
	}
	render() {
		let readOnly = {
			readOnly: this.state.readOnly
		};
		return (
			<section className="step" id="upate-mapping">
				<h2>Define Data Model</h2>
				<p>
					We will now define the data model (aka schema). In the data model editor's left pane below, we show sample JSON data that we intend to index in the next step. In the right pane, the editor shows the inferred data types. You can edit these to be more specific, but for this demo - we're all set.
				</p>
				<p>
					Select <strong>Apply Mapping</strong> to apply the data model for the type <strong>test</strong> and then press <strong>Next</strong>.
				</p>
				{this.state.error ? this.showError(): null}

		  {this.renderComponent('iframe')}

		  {this.renderComponent('next')}
		</section>
	  );
  }
}

UpdateMapping.propTypes = {
};
// Default props value
UpdateMapping.defaultProps = {
};
