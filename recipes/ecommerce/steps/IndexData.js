import { default as React, Component } from 'react';
import { Popover, OverlayTrigger} from 'react-bootstrap';
import Highlight from 'react-highlight';
import { dataOperation } from '../../services/DataOperation';
import { JsonView } from '../../shared/JsonView';
import { indexData } from '../../services/indexData';

export default class IndexData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			typeName: 'test'
		};
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		this.setState({
			typeName: event.target.value
		});
	}
	submit() {
		let finalData = indexData.map((record, i) => {
			record['item_info'] = this.refs['info'+i].value;
			return record;
		});
		this.IndexData();
	}
	IndexData() {
		dataOperation.indexData(indexData).on('data', function(res) {
		   this.props.nextStep();
		}.bind(this)).on('error', function(err) {
			alert('Try different name please!');
		});
	}
	setJsonPopover(fieldRecord) {
		let fieldRecordStringify = JSON.stringify(fieldRecord, null, 2);
		const jsonPopover = (
		  <Popover id="jsonPopover" className='jsonPopover'>
			<Highlight className="json">{fieldRecordStringify}</Highlight>
		  </Popover>
		);
		const jsonOverlay = (
		  <OverlayTrigger trigger={['click']} rootClose placement="right" overlay={jsonPopover}>
			<button className="jsonPopoverBtn"></button>
		  </OverlayTrigger>
		);
		return jsonOverlay;
	}
	records() {
		return indexData.map((record, i) => {
			return (
				<tr key={i}>
					<td>
						{this.setJsonPopover(record)}
					</td>
					<td>
						<div className="form-group place-info-inputbox">
							<i className="fa fa-pencil input-prefix"></i>
							<input type="text" className="form-control" ref={'info'+i} defaultValue={"item"+(i+1)} placeholder="Type item info" />
						</div>
					</td>
					<td>
						{record.category}
					</td>
					<td>
						{record.brand}
					</td>
					<td>
						{record.name}
					</td>
					<td>
						{record.rating}
					</td>
					<td>
						{record.dateOfRelease}
					</td>
					<td>
						{record.prize}
					</td>
					<td>
						{record.piecesSold}
					</td>
				</tr>
			);
		});
	}
	submitBtn() {
		let btn;
		if(this.props.completedStep >= 2) {
			btn = (
				<button className="btn btn-primary pos-static submit-btn" onClick={() => this.props.setStep(3)}>
					Next
				</button>
			);
		} else {
			btn = (
				<button className="btn btn-primary pos-static submit-btn" onClick={() => this.submit()}>
					Submit
				</button>
			);
		}
		return btn;
	}
	render() {
		return (
		  <section className="step" id="index-data">
			<h2>Index Data</h2>
			<p>
			  In this step, we will index 10 sample JSON objects so that we have something to see in our map view.
			</p>
			<p>
				In the table below, you can change the <strong>Item Info</strong> field. Once you have the descriptions to your liking, go to the <strong>Next</strong> step.
			</p>
			<div className="row">
				<div className="input-field" style={{'maxWidth': '600px'}}>
					<table className="table table-bordered">
						<thead>
							<tr>
								<th>
									JSON
								</th>
								<th>
									Item Info
								</th>
								<th>
									Category
								</th>
								<th>
									Brand
								</th>
								<th>
									Name
								</th>
								<th>
									Rating
								</th>
								<th>
									Date of Release
								</th>
								<th>
									Prize
								</th>
								<th>
									Pieces Sold
								</th>
							</tr>
						</thead>
						<tbody>
							{this.records()}
						</tbody>
					</table>

					{this.submitBtn()}
				</div>
			</div>
		  </section>
		);
  }
}

IndexData.propTypes = {
};
// Default props value
IndexData.defaultProps = {
};
