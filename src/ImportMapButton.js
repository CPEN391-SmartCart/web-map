import React from 'react';

class ImportMapButton extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<button onClick={this.props.importNodes}>
				Import Map
			</button>
		);
	}
}

export default ImportMapButton;