import React from 'react';

class ClearMapButton extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<button onClick={this.props.clearNodes}>
				Clear Map
			</button>
		);
	}
}

export default ClearMapButton;