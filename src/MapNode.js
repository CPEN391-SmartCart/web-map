import React from 'react';
import Konva from 'konva';
import { Rect } from 'react-konva';
import ReactTooltip from 'react-tooltip';

class MapNode extends React.Component {
	
	constructor(props) {
		super(props);
	}

	state = {
		x: this.props.initialX,
		y: this.props.initialY,
		isDragging: false,
		isClicking: false,
	};

	render() {
		return (
			<Rect
				x={this.state.x}
				y={this.state.y}
				width={10}
				height={10}
				fill={this.state.isClicking ? "green" : this.props.isItem ? "blue" : this.state.isDragging ? "red" : "black"}
				draggable
				onDragStart={() => {
					this.setState({
						isClicking: false,
						isDragging: true
					});
				}}
				onDragEnd={e => {
					this.props.onNodeDragEnd(this.props.id, e.target.x(), e.target.y());
					this.setState({
						isClicking: false,
						isDragging: false,
						x: e.target.x(),
						y: e.target.y()
					});
				}}
				onClick={(e) => {
					this.props.onNodeClick(e, this.props.id);
				}}
				onMouseMove={e => {
					let mousePos = e.target.getStage().getPointerPosition();
					this.props.onNodeHover(this.props.id, mousePos.x - 5, mousePos.y - 20);
				}}
				onMouseDown={() => {
					this.setState({
						isClicking: true
					});
				}}
				onMouseUp={() => {
					this.setState({
						isClicking: false
					});
				}}
				onMouseOut={this.props.onNodeUnHover}
			/>
		);
	}
}

export default MapNode;