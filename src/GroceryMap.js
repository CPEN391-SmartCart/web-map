import React from 'react';
import groceryMapImage from './actual_map.png';
import MapNode from './MapNode.js';
import { Stage, Layer, Image, Line, Text } from 'react-konva';
import Konva from "konva";
import uuid from 'react-uuid';
import ExportMapButton from './ExportMapButton.js';
import ImportMapButton from './ImportMapButton.js';
import ClearMapButton from './ClearMapButton.js';

const initial_ids = Array.from(Array(1000).keys());

class GroceryMap extends React.Component {

	constructor(props) {
		super(props);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onNodeDragEnd = this.onNodeDragEnd.bind(this);
		this.onNodeClick = this.onNodeClick.bind(this);
		this.clearNodes = this.clearNodes.bind(this);
		this.onNodeHover = this.onNodeHover.bind(this);
		this.onNodeUnHover = this.onNodeUnHover.bind(this);
		this.importNodes = this.importNodes.bind(this);
		this.clearParent = this.clearParent.bind(this);
	}

	state = {
		nodes: [],
		node_ids: initial_ids,
		parent: null,
		tooltip: {
			x: 30,
			y: 40,
			visible: false
		}
	}

	onMouseDown(e) {
		if (e.evt.button == 0)
		{
			if (!e.evt.altKey) {
				let stage = e.target.getStage();
				let pointerPosition = stage.getPointerPosition();
				let offset = {x: e.target.attrs.image.x, y: e.target.attrs.image.y};

				let imageClickX = pointerPosition.x - offset.x - 5;
				let imageClickY = pointerPosition.y - offset.y - 5;

				let ids = this.state.node_ids;
				let node_id = ids[0];
				ids.splice(0, 1);

				this.setState((state) => {
					return {
						nodes: this.state.nodes.concat({x: imageClickX, y: imageClickY, id: node_id, children: [], isItem: false}),
						node_ids: ids
					}
				});
			}
			else {
				let stage = e.target.getStage();
				let pointerPosition = stage.getPointerPosition();
				let offset = {x: e.target.attrs.image.x, y: e.target.attrs.image.y};

				let imageClickX = pointerPosition.x - offset.x - 5;
				let imageClickY = pointerPosition.y - offset.y - 5;

				let ids = this.state.node_ids;
				let node_id = ids[0];
				ids.splice(0, 1);

				this.setState((state) => {
					return {
						nodes: this.state.nodes.concat({x: imageClickX, y: imageClickY, id: node_id, children: [], isItem: true}),
						node_ids: ids
					}
				});
			}
		}
	}

	onNodeClick(e, id) {
		if (e.evt.button == 2)
		{
			let ids = this.state.node_ids;
			let nodes = this.state.nodes;
			for (let i = 0; i < nodes.length; i++) {
				let node = nodes[i];
				
				for (let j = 0; j < nodes.length; j++)
				{
					if (j != i)
					{
						let other_node = nodes[j];
						for (let k = 0; k < other_node.children.length; k++)
						{
							let child = other_node.children[k];
							if (child.id == id)
							{
								other_node.children.splice(k, 1);
							}
						}
					}
				}

				if (node.id == id)
				{
					nodes.splice(i, 1); 
					ids.push(i);
				}
			}

			this.setState({ nodes: nodes, node_ids: ids });
		}
		else if (e.evt.ctrlKey)
		{
			let parent = this.state.parent;
			let nodes = this.state.nodes;
			let found_node = null;
			for (let i = 0; i < nodes.length; i++) {
				let nodetest = nodes[i];
				if (nodetest.id == id)
				{
					found_node = nodetest;
				}
			}


			if (parent != null && parent.id != found_node.id)
			{
				if (this.containsChild(parent.children, found_node.id) == false)
				{
					console.log(parent.children);
					console.log(found_node.id);
					parent.children.push(found_node);
				}

				if (this.containsChild(found_node.children, parent.id) == false)
				{
					found_node.children.push(parent);
				}
				this.setState({ parent: null });
			}
			else
			{
				this.setState({ parent: found_node });
			}
		}
	}

	containsChild(children, id) {
		for (let i = 0; i < children.length; i++)
		{
			if (children[i].id == id)
				return true;
		}

		return false;
	}

	onNodeDragEnd(id, x, y) {
		let nodes = this.state.nodes;
		let index = -1;
		for (let i = 0; i < nodes.length; i++)
		{
			if (nodes[i].id == id)
			{
				index = i;
				nodes[i].x = x;
				nodes[i].y = y;
			}
		}

		if (index != -1)
		{
			this.setState({nodes});
		}
	}

	onNodeHover(id, x, y) {
		this.setState({ tooltip: { text: id, x: x, y: y, visible: true } });
	}

	onNodeUnHover() {
		this.setState({ tooltip: { visible: false } })
	}

	clearNodes() {
		this.setState({nodes: []});
	}

	importNodes() {
		let import_nodes_string_real = "\"{\"x\":21,\"y\":18,\"id\":1,\"children\":[]}\"|\"{\"x\":107,\"y\":18,\"id\":2,\"children\":[]}\"|\"{\"x\":107,\"y\":49,\"id\":3,\"children\":[]}\"|\"{\"x\":107,\"y\":84,\"id\":4,\"children\":[]}\"|\"{\"x\":107,\"y\":119,\"id\":5,\"children\":[]}\"|\"{\"x\":107,\"y\":156,\"id\":6,\"children\":[]}\"|\"{\"x\":107,\"y\":192,\"id\":7,\"children\":[]}\"|\"{\"x\":107,\"y\":228,\"id\":8,\"children\":[]}\"|\"{\"x\":137,\"y\":228,\"id\":9,\"children\":[]}\"|\"{\"x\":137,\"y\":267,\"id\":10,\"children\":[]}\"|\"{\"x\":75,\"y\":267,\"id\":11,\"children\":[]}\"|\"{\"x\":75,\"y\":311,\"id\":12,\"children\":[]}\"|\"{\"x\":137,\"y\":310,\"id\":13,\"children\":[]}\"|\"{\"x\":137,\"y\":348,\"id\":14,\"children\":[]}\"|\"{\"x\":127,\"y\":380,\"id\":15,\"children\":[]}\"|\"{\"x\":127,\"y\":414,\"id\":16,\"children\":[]}\"|\"{\"x\":127,\"y\":445,\"id\":17,\"children\":[]}\"|\"{\"x\":128,\"y\":348,\"id\":18,\"children\":[]}\"|\"{\"x\":21,\"y\":49,\"id\":19,\"children\":[]}\"|\"{\"x\":21,\"y\":85,\"id\":20,\"children\":[]}\"|\"{\"x\":21,\"y\":120,\"id\":21,\"children\":[]}\"|\"{\"x\":20,\"y\":157,\"id\":22,\"children\":[]}\"|\"{\"x\":20,\"y\":193,\"id\":23,\"children\":[]}\"|\"{\"x\":21,\"y\":229,\"id\":24,\"children\":[]}\"|\"{\"x\":20,\"y\":267,\"id\":25,\"children\":[]}\"|\"{\"x\":20,\"y\":311,\"id\":26,\"children\":[]}\"|\"{\"x\":20,\"y\":348,\"id\":27,\"children\":[]}\"|\"{\"x\":20,\"y\":381,\"id\":28,\"children\":[]}\"|\"{\"x\":20,\"y\":415,\"id\":29,\"children\":[]}\"|\"{\"x\":21,\"y\":446,\"id\":30,\"children\":[]}\"|\"{\"x\":231,\"y\":18,\"id\":31,\"children\":[]}\"|\"{\"x\":231,\"y\":48,\"id\":32,\"children\":[]}\"|\"{\"x\":231,\"y\":85,\"id\":33,\"children\":[]}\"|\"{\"x\":231,\"y\":120,\"id\":34,\"children\":[]}\"|\"{\"x\":231,\"y\":156,\"id\":35,\"children\":[]}\"|\"{\"x\":231,\"y\":193,\"id\":36,\"children\":[]}\"|\"{\"x\":231,\"y\":227,\"id\":37,\"children\":[]}\"|\"{\"x\":231,\"y\":266,\"id\":38,\"children\":[]}\"|\"{\"x\":231,\"y\":310,\"id\":39,\"children\":[]}\"|\"{\"x\":231,\"y\":347,\"id\":40,\"children\":[]}\"|\"{\"x\":231,\"y\":380,\"id\":41,\"children\":[]}\"|\"{\"x\":231,\"y\":414,\"id\":42,\"children\":[]}\"|\"{\"x\":231,\"y\":444,\"id\":43,\"children\":[]}\"|\"{\"x\":277,\"y\":427,\"id\":44,\"children\":[]}\"|\"{\"x\":306,\"y\":427,\"id\":45,\"children\":[]}\"|\"{\"x\":334,\"y\":427,\"id\":46,\"children\":[]}\"|\"{\"x\":277,\"y\":244,\"id\":47,\"children\":[]}\"|\"{\"x\":306,\"y\":244,\"id\":48,\"children\":[]}\"|\"{\"x\":335,\"y\":244,\"id\":49,\"children\":[]}\"|\"{\"x\":367,\"y\":244,\"id\":50,\"children\":[]}\"|\"{\"x\":366,\"y\":348,\"id\":51,\"children\":[]}\"|\"{\"x\":365,\"y\":427,\"id\":52,\"children\":[]}\"|\"{\"x\":371,\"y\":445,\"id\":53,\"children\":[]}\"|\"{\"x\":411,\"y\":445,\"id\":54,\"children\":[]}\"|\"{\"x\":460,\"y\":445,\"id\":55,\"children\":[]}\"|\"{\"x\":508,\"y\":445,\"id\":56,\"children\":[]}\"|\"{\"x\":548,\"y\":445,\"id\":57,\"children\":[]}\"|\"{\"x\":548,\"y\":348,\"id\":58,\"children\":[]}\"|\"{\"x\":509,\"y\":348,\"id\":59,\"children\":[]}\"|\"{\"x\":460,\"y\":347,\"id\":60,\"children\":[]}\"|\"{\"x\":412,\"y\":347,\"id\":61,\"children\":[]}\"|\"{\"x\":413,\"y\":244,\"id\":62,\"children\":[]}\"|\"{\"x\":460,\"y\":244,\"id\":63,\"children\":[]}\"|\"{\"x\":509,\"y\":244,\"id\":64,\"children\":[]}\"|\"{\"x\":548,\"y\":244,\"id\":65,\"children\":[]}\"|\"{\"x\":548,\"y\":197,\"id\":66,\"children\":[]}\"|\"{\"x\":508,\"y\":197,\"id\":67,\"children\":[]}\"|\"{\"x\":459,\"y\":197,\"id\":68,\"children\":[]}\"|\"{\"x\":411,\"y\":197,\"id\":69,\"children\":[]}\"|\"{\"x\":366,\"y\":197,\"id\":70,\"children\":[]}\"|\"{\"x\":286,\"y\":197,\"id\":71,\"children\":[]}\"|\"{\"x\":286,\"y\":150,\"id\":72,\"children\":[]}\"|\"{\"x\":366,\"y\":150,\"id\":73,\"children\":[]}\"|\"{\"x\":366,\"y\":102,\"id\":74,\"children\":[]}\"|\"{\"x\":286,\"y\":102,\"id\":75,\"children\":[]}\"|\"{\"x\":287,\"y\":55,\"id\":76,\"children\":[]}\"|\"{\"x\":366,\"y\":54,\"id\":77,\"children\":[]}\"|\"{\"x\":366,\"y\":18,\"id\":78,\"children\":[]}\"|\"{\"x\":287,\"y\":17,\"id\":79,\"children\":[]}\"|\"{\"x\":411,\"y\":18,\"id\":80,\"children\":[]}\"|\"{\"x\":459,\"y\":18,\"id\":81,\"children\":[]}\"|\"{\"x\":508,\"y\":18,\"id\":82,\"children\":[]}\"|\"{\"x\":548,\"y\":18,\"id\":83,\"children\":[]}\"";
		let import_nodes_string = "\"{\"x\":108,\"y\":19,\"id\":1,\"children\":[]}\"|\"{\"x\":108,\"y\":49,\"id\":2,\"children\":[]}\"|\"{\"x\":108,\"y\":84,\"id\":3,\"children\":[]}\"|\"{\"x\":108,\"y\":120,\"id\":4,\"children\":[]}\"|\"{\"x\":108,\"y\":157,\"id\":5,\"children\":[]}\"|\"{\"x\":108,\"y\":194,\"id\":6,\"children\":[]}\"|\"{\"x\":108,\"y\":228,\"id\":7,\"children\":[]}\"|\"{\"x\":136,\"y\":230,\"id\":8,\"children\":[]}\"|\"{\"x\":136,\"y\":269,\"id\":9,\"children\":[]}\"|\"{\"x\":75,\"y\":270,\"id\":10,\"children\":[]}\"|\"{\"x\":75,\"y\":311,\"id\":11,\"children\":[]}\"|\"{\"x\":136,\"y\":310,\"id\":12,\"children\":[]}\"|\"{\"x\":136,\"y\":347,\"id\":13,\"children\":[]}\"|\"{\"x\":129,\"y\":380,\"id\":14,\"children\":[]}\"|\"{\"x\":129,\"y\":416,\"id\":15,\"children\":[]}\"|\"{\"x\":233,\"y\":380,\"id\":16,\"children\":[]}\"|\"{\"x\":233,\"y\":347,\"id\":17,\"children\":[]}\"|\"{\"x\":233,\"y\":311,\"id\":18,\"children\":[]}\"|\"{\"x\":233,\"y\":268,\"id\":19,\"children\":[]}\"|\"{\"x\":233,\"y\":230,\"id\":20,\"children\":[]}\"|\"{\"x\":233,\"y\":193,\"id\":21,\"children\":[]}\"|\"{\"x\":233,\"y\":157,\"id\":22,\"children\":[]}\"|\"{\"x\":233,\"y\":120,\"id\":23,\"children\":[]}\"|\"{\"x\":233,\"y\":83,\"id\":24,\"children\":[]}\"|\"{\"x\":233,\"y\":48,\"id\":25,\"children\":[]}\"|\"{\"x\":233,\"y\":18,\"id\":26,\"children\":[]}\"|\"{\"x\":285,\"y\":17,\"id\":27,\"children\":[]}\"|\"{\"x\":285,\"y\":55,\"id\":28,\"children\":[]}\"|\"{\"x\":285,\"y\":103,\"id\":29,\"children\":[]}\"|\"{\"x\":285,\"y\":151,\"id\":30,\"children\":[]}\"|\"{\"x\":285,\"y\":195,\"id\":31,\"children\":[]}\"|\"{\"x\":366,\"y\":17,\"id\":32,\"children\":[]}\"|\"{\"x\":366,\"y\":55,\"id\":33,\"children\":[]}\"|\"{\"x\":366,\"y\":103,\"id\":34,\"children\":[]}\"|\"{\"x\":366,\"y\":150,\"id\":35,\"children\":[]}\"|\"{\"x\":366,\"y\":195,\"id\":36,\"children\":[]}\"|\"{\"x\":277,\"y\":244,\"id\":37,\"children\":[]}\"|\"{\"x\":306,\"y\":244,\"id\":38,\"children\":[]}\"|\"{\"x\":335,\"y\":244,\"id\":39,\"children\":[]}\"|\"{\"x\":366,\"y\":244,\"id\":40,\"children\":[]}\"|\"{\"x\":277,\"y\":432,\"id\":41,\"children\":[]}\"|\"{\"x\":307,\"y\":432,\"id\":42,\"children\":[]}\"|\"{\"x\":335,\"y\":436,\"id\":43,\"children\":[]}\"|\"{\"x\":366,\"y\":445,\"id\":44,\"children\":[]}\"|\"{\"x\":233,\"y\":415,\"id\":45,\"children\":[]}\"|\"{\"x\":233,\"y\":445,\"id\":46,\"children\":[]}\"|\"{\"x\":129,\"y\":447,\"id\":47,\"children\":[]}\"|\"{\"x\":19,\"y\":347,\"id\":48,\"children\":[]}\"|\"{\"x\":20,\"y\":381,\"id\":49,\"children\":[]}\"|\"{\"x\":20,\"y\":416,\"id\":50,\"children\":[]}\"|\"{\"x\":20,\"y\":448,\"id\":51,\"children\":[]}\"|\"{\"x\":20,\"y\":229,\"id\":52,\"children\":[]}\"|\"{\"x\":20,\"y\":194,\"id\":53,\"children\":[]}\"|\"{\"x\":20,\"y\":158,\"id\":54,\"children\":[]}\"|\"{\"x\":21,\"y\":120,\"id\":55,\"children\":[]}\"|\"{\"x\":21,\"y\":84,\"id\":56,\"children\":[]}\"|\"{\"x\":21,\"y\":49,\"id\":57,\"children\":[]}\"|\"{\"x\":21,\"y\":18,\"id\":58,\"children\":[]}\"|\"{\"x\":20,\"y\":269,\"id\":59,\"children\":[]}\"|\"{\"x\":20,\"y\":313,\"id\":60,\"children\":[]}\"|\"{\"x\":410,\"y\":17,\"id\":61,\"children\":[]}\"|\"{\"x\":409,\"y\":195,\"id\":62,\"children\":[]}\"|\"{\"x\":458,\"y\":17,\"id\":63,\"children\":[]}\"|\"{\"x\":459,\"y\":195,\"id\":64,\"children\":[]}\"|\"{\"x\":507,\"y\":17,\"id\":65,\"children\":[]}\"|\"{\"x\":506,\"y\":195,\"id\":66,\"children\":[]}\"|\"{\"x\":547,\"y\":18,\"id\":67,\"children\":[]}\"|\"{\"x\":550,\"y\":195,\"id\":68,\"children\":[]}\"|\"{\"x\":550,\"y\":245,\"id\":69,\"children\":[]}\"|\"{\"x\":507,\"y\":245,\"id\":70,\"children\":[]}\"|\"{\"x\":459,\"y\":245,\"id\":71,\"children\":[]}\"|\"{\"x\":413,\"y\":245,\"id\":72,\"children\":[]}\"|\"{\"x\":550,\"y\":350,\"id\":73,\"children\":[]}\"|\"{\"x\":507,\"y\":350,\"id\":74,\"children\":[]}\"|\"{\"x\":460,\"y\":351,\"id\":75,\"children\":[]}\"|\"{\"x\":413,\"y\":351,\"id\":76,\"children\":[]}\"|\"{\"x\":367,\"y\":351,\"id\":77,\"children\":[]}\"|\"{\"x\":414,\"y\":445,\"id\":78,\"children\":[]}\"|\"{\"x\":459,\"y\":445,\"id\":79,\"children\":[]}\"|\"{\"x\":509,\"y\":445,\"id\":80,\"children\":[]}\"|\"{\"x\":549,\"y\":445,\"id\":81,\"children\":[]}\"";
		let actual_ids_real = "Wzg0LDg1LDg2LDg3LDg4LDg5LDkwLDkxLDkyLDkzLDk0LDk1LDk2LDk3LDk4LDk5LDEwMCwxMDEsMTAyLDEwMywxMDQsMTA1LDEwNiwxMDcsMTA4LDEwOSwxMTAsMTExLDExMiwxMTMsMTE0LDExNSwxMTYsMTE3LDExOCwxMTksMTIwLDEyMSwxMjIsMTIzLDEyNCwxMjUsMTI2LDEyNywxMjgsMTI5LDEzMCwxMzEsMTMyLDEzMywxMzQsMTM1LDEzNiwxMzcsMTM4LDEzOSwxNDAsMTQxLDE0MiwxNDMsMTQ0LDE0NSwxNDYsMTQ3LDE0OCwxNDksMTUwLDE1MSwxNTIsMTUzLDE1NCwxNTUsMTU2LDE1NywxNTgsMTU5LDE2MCwxNjEsMTYyLDE2MywxNjQsMTY1LDE2NiwxNjcsMTY4LDE2OSwxNzAsMTcxLDE3MiwxNzMsMTc0LDE3NSwxNzYsMTc3LDE3OCwxNzksMTgwLDE4MSwxODIsMTgzLDE4NCwxODUsMTg2LDE4NywxODgsMTg5LDE5MCwxOTEsMTkyLDE5MywxOTQsMTk1LDE5NiwxOTcsMTk4LDE5OSwyMDAsMjAxLDIwMiwyMDMsMjA0LDIwNSwyMDYsMjA3LDIwOCwyMDksMjEwLDIxMSwyMTIsMjEzLDIxNCwyMTUsMjE2LDIxNywyMTgsMjE5LDIyMCwyMjEsMjIyLDIyMywyMjQsMjI1LDIyNiwyMjcsMjI4LDIyOSwyMzAsMjMxLDIzMiwyMzMsMjM0LDIzNSwyMzYsMjM3LDIzOCwyMzksMjQwLDI0MSwyNDIsMjQzLDI0NCwyNDUsMjQ2LDI0NywyNDgsMjQ5LDI1MCwyNTEsMjUyLDI1MywyNTQsMjU1LDI1NiwyNTcsMjU4LDI1OSwyNjAsMjYxLDI2MiwyNjMsMjY0LDI2NSwyNjYsMjY3LDI2OCwyNjksMjcwLDI3MSwyNzIsMjczLDI3NCwyNzUsMjc2LDI3NywyNzgsMjc5LDI4MCwyODEsMjgyLDI4MywyODQsMjg1LDI4NiwyODcsMjg4LDI4OSwyOTAsMjkxLDI5MiwyOTMsMjk0LDI5NSwyOTYsMjk3LDI5OCwyOTksMzAwLDMwMSwzMDIsMzAzLDMwNCwzMDUsMzA2LDMwNywzMDgsMzA5LDMxMCwzMTEsMzEyLDMxMywzMTQsMzE1LDMxNiwzMTcsMzE4LDMxOSwzMjAsMzIxLDMyMiwzMjMsMzI0LDMyNSwzMjYsMzI3LDMyOCwzMjksMzMwLDMzMSwzMzIsMzMzLDMzNCwzMzUsMzM2LDMzNywzMzgsMzM5LDM0MCwzNDEsMzQyLDM0MywzNDQsMzQ1LDM0NiwzNDcsMzQ4LDM0OSwzNTAsMzUxLDM1MiwzNTMsMzU0LDM1NSwzNTYsMzU3LDM1OCwzNTksMzYwLDM2MSwzNjIsMzYzLDM2NCwzNjUsMzY2LDM2NywzNjgsMzY5LDM3MCwzNzEsMzcyLDM3MywzNzQsMzc1LDM3NiwzNzcsMzc4LDM3OSwzODAsMzgxLDM4MiwzODMsMzg0LDM4NSwzODYsMzg3LDM4OCwzODksMzkwLDM5MSwzOTIsMzkzLDM5NCwzOTUsMzk2LDM5NywzOTgsMzk5LDQwMCw0MDEsNDAyLDQwMyw0MDQsNDA1LDQwNiw0MDcsNDA4LDQwOSw0MTAsNDExLDQxMiw0MTMsNDE0LDQxNSw0MTYsNDE3LDQxOCw0MTksNDIwLDQyMSw0MjIsNDIzLDQyNCw0MjUsNDI2LDQyNyw0MjgsNDI5LDQzMCw0MzEsNDMyLDQzMyw0MzQsNDM1LDQzNiw0MzcsNDM4LDQzOSw0NDAsNDQxLDQ0Miw0NDMsNDQ0LDQ0NSw0NDYsNDQ3LDQ0OCw0NDksNDUwLDQ1MSw0NTIsNDUzLDQ1NCw0NTUsNDU2LDQ1Nyw0NTgsNDU5LDQ2MCw0NjEsNDYyLDQ2Myw0NjQsNDY1LDQ2Niw0NjcsNDY4LDQ2OSw0NzAsNDcxLDQ3Miw0NzMsNDc0LDQ3NSw0NzYsNDc3LDQ3OCw0NzksNDgwLDQ4MSw0ODIsNDgzLDQ4NCw0ODUsNDg2LDQ4Nyw0ODgsNDg5LDQ5MCw0OTEsNDkyLDQ5Myw0OTQsNDk1LDQ5Niw0OTcsNDk4LDQ5OSw1MDAsNTAxLDUwMiw1MDMsNTA0LDUwNSw1MDYsNTA3LDUwOCw1MDksNTEwLDUxMSw1MTIsNTEzLDUxNCw1MTUsNTE2LDUxNyw1MTgsNTE5LDUyMCw1MjEsNTIyLDUyMyw1MjQsNTI1LDUyNiw1MjcsNTI4LDUyOSw1MzAsNTMxLDUzMiw1MzMsNTM0LDUzNSw1MzYsNTM3LDUzOCw1MzksNTQwLDU0MSw1NDIsNTQzLDU0NCw1NDUsNTQ2LDU0Nyw1NDgsNTQ5LDU1MCw1NTEsNTUyLDU1Myw1NTQsNTU1LDU1Niw1NTcsNTU4LDU1OSw1NjAsNTYxLDU2Miw1NjMsNTY0LDU2NSw1NjYsNTY3LDU2OCw1NjksNTcwLDU3MSw1NzIsNTczLDU3NCw1NzUsNTc2LDU3Nyw1NzgsNTc5LDU4MCw1ODEsNTgyLDU4Myw1ODQsNTg1LDU4Niw1ODcsNTg4LDU4OSw1OTAsNTkxLDU5Miw1OTMsNTk0LDU5NSw1OTYsNTk3LDU5OCw1OTksNjAwLDYwMSw2MDIsNjAzLDYwNCw2MDUsNjA2LDYwNyw2MDgsNjA5LDYxMCw2MTEsNjEyLDYxMyw2MTQsNjE1LDYxNiw2MTcsNjE4LDYxOSw2MjAsNjIxLDYyMiw2MjMsNjI0LDYyNSw2MjYsNjI3LDYyOCw2MjksNjMwLDYzMSw2MzIsNjMzLDYzNCw2MzUsNjM2LDYzNyw2MzgsNjM5LDY0MCw2NDEsNjQyLDY0Myw2NDQsNjQ1LDY0Niw2NDcsNjQ4LDY0OSw2NTAsNjUxLDY1Miw2NTMsNjU0LDY1NSw2NTYsNjU3LDY1OCw2NTksNjYwLDY2MSw2NjIsNjYzLDY2NCw2NjUsNjY2LDY2Nyw2NjgsNjY5LDY3MCw2NzEsNjcyLDY3Myw2NzQsNjc1LDY3Niw2NzcsNjc4LDY3OSw2ODAsNjgxLDY4Miw2ODMsNjg0LDY4NSw2ODYsNjg3LDY4OCw2ODksNjkwLDY5MSw2OTIsNjkzLDY5NCw2OTUsNjk2LDY5Nyw2OTgsNjk5LDcwMCw3MDEsNzAyLDcwMyw3MDQsNzA1LDcwNiw3MDcsNzA4LDcwOSw3MTAsNzExLDcxMiw3MTMsNzE0LDcxNSw3MTYsNzE3LDcxOCw3MTksNzIwLDcyMSw3MjIsNzIzLDcyNCw3MjUsNzI2LDcyNyw3MjgsNzI5LDczMCw3MzEsNzMyLDczMyw3MzQsNzM1LDczNiw3MzcsNzM4LDczOSw3NDAsNzQxLDc0Miw3NDMsNzQ0LDc0NSw3NDYsNzQ3LDc0OCw3NDksNzUwLDc1MSw3NTIsNzUzLDc1NCw3NTUsNzU2LDc1Nyw3NTgsNzU5LDc2MCw3NjEsNzYyLDc2Myw3NjQsNzY1LDc2Niw3NjcsNzY4LDc2OSw3NzAsNzcxLDc3Miw3NzMsNzc0LDc3NSw3NzYsNzc3LDc3OCw3NzksNzgwLDc4MSw3ODIsNzgzLDc4NCw3ODUsNzg2LDc4Nyw3ODgsNzg5LDc5MCw3OTEsNzkyLDc5Myw3OTQsNzk1LDc5Niw3OTcsNzk4LDc5OSw4MDAsODAxLDgwMiw4MDMsODA0LDgwNSw4MDYsODA3LDgwOCw4MDksODEwLDgxMSw4MTIsODEzLDgxNCw4MTUsODE2LDgxNyw4MTgsODE5LDgyMCw4MjEsODIyLDgyMyw4MjQsODI1LDgyNiw4MjcsODI4LDgyOSw4MzAsODMxLDgzMiw4MzMsODM0LDgzNSw4MzYsODM3LDgzOCw4MzksODQwLDg0MSw4NDIsODQzLDg0NCw4NDUsODQ2LDg0Nyw4NDgsODQ5LDg1MCw4NTEsODUyLDg1Myw4NTQsODU1LDg1Niw4NTcsODU4LDg1OSw4NjAsODYxLDg2Miw4NjMsODY0LDg2NSw4NjYsODY3LDg2OCw4NjksODcwLDg3MSw4NzIsODczLDg3NCw4NzUsODc2LDg3Nyw4NzgsODc5LDg4MCw4ODEsODgyLDg4Myw4ODQsODg1LDg4Niw4ODcsODg4LDg4OSw4OTAsODkxLDg5Miw4OTMsODk0LDg5NSw4OTYsODk3LDg5OCw4OTksOTAwLDkwMSw5MDIsOTAzLDkwNCw5MDUsOTA2LDkwNyw5MDgsOTA5LDkxMCw5MTEsOTEyLDkxMyw5MTQsOTE1LDkxNiw5MTcsOTE4LDkxOSw5MjAsOTIxLDkyMiw5MjMsOTI0LDkyNSw5MjYsOTI3LDkyOCw5MjksOTMwLDkzMSw5MzIsOTMzLDkzNCw5MzUsOTM2LDkzNyw5MzgsOTM5LDk0MCw5NDEsOTQyLDk0Myw5NDQsOTQ1LDk0Niw5NDcsOTQ4LDk0OSw5NTAsOTUxLDk1Miw5NTMsOTU0LDk1NSw5NTYsOTU3LDk1OCw5NTksOTYwLDk2MSw5NjIsOTYzLDk2NCw5NjUsOTY2LDk2Nyw5NjgsOTY5LDk3MCw5NzEsOTcyLDk3Myw5NzQsOTc1LDk3Niw5NzcsOTc4LDk3OSw5ODAsOTgxLDk4Miw5ODMsOTg0LDk4NSw5ODYsOTg3LDk4OCw5ODksOTkwLDk5MSw5OTIsOTkzLDk5NCw5OTUsOTk2LDk5Nyw5OTgsOTk5LDBd";
		let actual_ids = "WzgyLDgzLDg0LDg1LDg2LDg3LDg4LDg5LDkwLDkxLDkyLDkzLDk0LDk1LDk2LDk3LDk4LDk5LDEwMCwxMDEsMTAyLDEwMywxMDQsMTA1LDEwNiwxMDcsMTA4LDEwOSwxMTAsMTExLDExMiwxMTMsMTE0LDExNSwxMTYsMTE3LDExOCwxMTksMTIwLDEyMSwxMjIsMTIzLDEyNCwxMjUsMTI2LDEyNywxMjgsMTI5LDEzMCwxMzEsMTMyLDEzMywxMzQsMTM1LDEzNiwxMzcsMTM4LDEzOSwxNDAsMTQxLDE0MiwxNDMsMTQ0LDE0NSwxNDYsMTQ3LDE0OCwxNDksMTUwLDE1MSwxNTIsMTUzLDE1NCwxNTUsMTU2LDE1NywxNTgsMTU5LDE2MCwxNjEsMTYyLDE2MywxNjQsMTY1LDE2NiwxNjcsMTY4LDE2OSwxNzAsMTcxLDE3MiwxNzMsMTc0LDE3NSwxNzYsMTc3LDE3OCwxNzksMTgwLDE4MSwxODIsMTgzLDE4NCwxODUsMTg2LDE4NywxODgsMTg5LDE5MCwxOTEsMTkyLDE5MywxOTQsMTk1LDE5NiwxOTcsMTk4LDE5OSwyMDAsMjAxLDIwMiwyMDMsMjA0LDIwNSwyMDYsMjA3LDIwOCwyMDksMjEwLDIxMSwyMTIsMjEzLDIxNCwyMTUsMjE2LDIxNywyMTgsMjE5LDIyMCwyMjEsMjIyLDIyMywyMjQsMjI1LDIyNiwyMjcsMjI4LDIyOSwyMzAsMjMxLDIzMiwyMzMsMjM0LDIzNSwyMzYsMjM3LDIzOCwyMzksMjQwLDI0MSwyNDIsMjQzLDI0NCwyNDUsMjQ2LDI0NywyNDgsMjQ5LDI1MCwyNTEsMjUyLDI1MywyNTQsMjU1LDI1NiwyNTcsMjU4LDI1OSwyNjAsMjYxLDI2MiwyNjMsMjY0LDI2NSwyNjYsMjY3LDI2OCwyNjksMjcwLDI3MSwyNzIsMjczLDI3NCwyNzUsMjc2LDI3NywyNzgsMjc5LDI4MCwyODEsMjgyLDI4MywyODQsMjg1LDI4NiwyODcsMjg4LDI4OSwyOTAsMjkxLDI5MiwyOTMsMjk0LDI5NSwyOTYsMjk3LDI5OCwyOTksMzAwLDMwMSwzMDIsMzAzLDMwNCwzMDUsMzA2LDMwNywzMDgsMzA5LDMxMCwzMTEsMzEyLDMxMywzMTQsMzE1LDMxNiwzMTcsMzE4LDMxOSwzMjAsMzIxLDMyMiwzMjMsMzI0LDMyNSwzMjYsMzI3LDMyOCwzMjksMzMwLDMzMSwzMzIsMzMzLDMzNCwzMzUsMzM2LDMzNywzMzgsMzM5LDM0MCwzNDEsMzQyLDM0MywzNDQsMzQ1LDM0NiwzNDcsMzQ4LDM0OSwzNTAsMzUxLDM1MiwzNTMsMzU0LDM1NSwzNTYsMzU3LDM1OCwzNTksMzYwLDM2MSwzNjIsMzYzLDM2NCwzNjUsMzY2LDM2NywzNjgsMzY5LDM3MCwzNzEsMzcyLDM3MywzNzQsMzc1LDM3NiwzNzcsMzc4LDM3OSwzODAsMzgxLDM4MiwzODMsMzg0LDM4NSwzODYsMzg3LDM4OCwzODksMzkwLDM5MSwzOTIsMzkzLDM5NCwzOTUsMzk2LDM5NywzOTgsMzk5LDQwMCw0MDEsNDAyLDQwMyw0MDQsNDA1LDQwNiw0MDcsNDA4LDQwOSw0MTAsNDExLDQxMiw0MTMsNDE0LDQxNSw0MTYsNDE3LDQxOCw0MTksNDIwLDQyMSw0MjIsNDIzLDQyNCw0MjUsNDI2LDQyNyw0MjgsNDI5LDQzMCw0MzEsNDMyLDQzMyw0MzQsNDM1LDQzNiw0MzcsNDM4LDQzOSw0NDAsNDQxLDQ0Miw0NDMsNDQ0LDQ0NSw0NDYsNDQ3LDQ0OCw0NDksNDUwLDQ1MSw0NTIsNDUzLDQ1NCw0NTUsNDU2LDQ1Nyw0NTgsNDU5LDQ2MCw0NjEsNDYyLDQ2Myw0NjQsNDY1LDQ2Niw0NjcsNDY4LDQ2OSw0NzAsNDcxLDQ3Miw0NzMsNDc0LDQ3NSw0NzYsNDc3LDQ3OCw0NzksNDgwLDQ4MSw0ODIsNDgzLDQ4NCw0ODUsNDg2LDQ4Nyw0ODgsNDg5LDQ5MCw0OTEsNDkyLDQ5Myw0OTQsNDk1LDQ5Niw0OTcsNDk4LDQ5OSw1MDAsNTAxLDUwMiw1MDMsNTA0LDUwNSw1MDYsNTA3LDUwOCw1MDksNTEwLDUxMSw1MTIsNTEzLDUxNCw1MTUsNTE2LDUxNyw1MTgsNTE5LDUyMCw1MjEsNTIyLDUyMyw1MjQsNTI1LDUyNiw1MjcsNTI4LDUyOSw1MzAsNTMxLDUzMiw1MzMsNTM0LDUzNSw1MzYsNTM3LDUzOCw1MzksNTQwLDU0MSw1NDIsNTQzLDU0NCw1NDUsNTQ2LDU0Nyw1NDgsNTQ5LDU1MCw1NTEsNTUyLDU1Myw1NTQsNTU1LDU1Niw1NTcsNTU4LDU1OSw1NjAsNTYxLDU2Miw1NjMsNTY0LDU2NSw1NjYsNTY3LDU2OCw1NjksNTcwLDU3MSw1NzIsNTczLDU3NCw1NzUsNTc2LDU3Nyw1NzgsNTc5LDU4MCw1ODEsNTgyLDU4Myw1ODQsNTg1LDU4Niw1ODcsNTg4LDU4OSw1OTAsNTkxLDU5Miw1OTMsNTk0LDU5NSw1OTYsNTk3LDU5OCw1OTksNjAwLDYwMSw2MDIsNjAzLDYwNCw2MDUsNjA2LDYwNyw2MDgsNjA5LDYxMCw2MTEsNjEyLDYxMyw2MTQsNjE1LDYxNiw2MTcsNjE4LDYxOSw2MjAsNjIxLDYyMiw2MjMsNjI0LDYyNSw2MjYsNjI3LDYyOCw2MjksNjMwLDYzMSw2MzIsNjMzLDYzNCw2MzUsNjM2LDYzNyw2MzgsNjM5LDY0MCw2NDEsNjQyLDY0Myw2NDQsNjQ1LDY0Niw2NDcsNjQ4LDY0OSw2NTAsNjUxLDY1Miw2NTMsNjU0LDY1NSw2NTYsNjU3LDY1OCw2NTksNjYwLDY2MSw2NjIsNjYzLDY2NCw2NjUsNjY2LDY2Nyw2NjgsNjY5LDY3MCw2NzEsNjcyLDY3Myw2NzQsNjc1LDY3Niw2NzcsNjc4LDY3OSw2ODAsNjgxLDY4Miw2ODMsNjg0LDY4NSw2ODYsNjg3LDY4OCw2ODksNjkwLDY5MSw2OTIsNjkzLDY5NCw2OTUsNjk2LDY5Nyw2OTgsNjk5LDcwMCw3MDEsNzAyLDcwMyw3MDQsNzA1LDcwNiw3MDcsNzA4LDcwOSw3MTAsNzExLDcxMiw3MTMsNzE0LDcxNSw3MTYsNzE3LDcxOCw3MTksNzIwLDcyMSw3MjIsNzIzLDcyNCw3MjUsNzI2LDcyNyw3MjgsNzI5LDczMCw3MzEsNzMyLDczMyw3MzQsNzM1LDczNiw3MzcsNzM4LDczOSw3NDAsNzQxLDc0Miw3NDMsNzQ0LDc0NSw3NDYsNzQ3LDc0OCw3NDksNzUwLDc1MSw3NTIsNzUzLDc1NCw3NTUsNzU2LDc1Nyw3NTgsNzU5LDc2MCw3NjEsNzYyLDc2Myw3NjQsNzY1LDc2Niw3NjcsNzY4LDc2OSw3NzAsNzcxLDc3Miw3NzMsNzc0LDc3NSw3NzYsNzc3LDc3OCw3NzksNzgwLDc4MSw3ODIsNzgzLDc4NCw3ODUsNzg2LDc4Nyw3ODgsNzg5LDc5MCw3OTEsNzkyLDc5Myw3OTQsNzk1LDc5Niw3OTcsNzk4LDc5OSw4MDAsODAxLDgwMiw4MDMsODA0LDgwNSw4MDYsODA3LDgwOCw4MDksODEwLDgxMSw4MTIsODEzLDgxNCw4MTUsODE2LDgxNyw4MTgsODE5LDgyMCw4MjEsODIyLDgyMyw4MjQsODI1LDgyNiw4MjcsODI4LDgyOSw4MzAsODMxLDgzMiw4MzMsODM0LDgzNSw4MzYsODM3LDgzOCw4MzksODQwLDg0MSw4NDIsODQzLDg0NCw4NDUsODQ2LDg0Nyw4NDgsODQ5LDg1MCw4NTEsODUyLDg1Myw4NTQsODU1LDg1Niw4NTcsODU4LDg1OSw4NjAsODYxLDg2Miw4NjMsODY0LDg2NSw4NjYsODY3LDg2OCw4NjksODcwLDg3MSw4NzIsODczLDg3NCw4NzUsODc2LDg3Nyw4NzgsODc5LDg4MCw4ODEsODgyLDg4Myw4ODQsODg1LDg4Niw4ODcsODg4LDg4OSw4OTAsODkxLDg5Miw4OTMsODk0LDg5NSw4OTYsODk3LDg5OCw4OTksOTAwLDkwMSw5MDIsOTAzLDkwNCw5MDUsOTA2LDkwNyw5MDgsOTA5LDkxMCw5MTEsOTEyLDkxMyw5MTQsOTE1LDkxNiw5MTcsOTE4LDkxOSw5MjAsOTIxLDkyMiw5MjMsOTI0LDkyNSw5MjYsOTI3LDkyOCw5MjksOTMwLDkzMSw5MzIsOTMzLDkzNCw5MzUsOTM2LDkzNyw5MzgsOTM5LDk0MCw5NDEsOTQyLDk0Myw5NDQsOTQ1LDk0Niw5NDcsOTQ4LDk0OSw5NTAsOTUxLDk1Miw5NTMsOTU0LDk1NSw5NTYsOTU3LDk1OCw5NTksOTYwLDk2MSw5NjIsOTYzLDk2NCw5NjUsOTY2LDk2Nyw5NjgsOTY5LDk3MCw5NzEsOTcyLDk3Myw5NzQsOTc1LDk3Niw5NzcsOTc4LDk3OSw5ODAsOTgxLDk4Miw5ODMsOTg0LDk4NSw5ODYsOTg3LDk4OCw5ODksOTkwLDk5MSw5OTIsOTkzLDk5NCw5OTUsOTk2LDk5Nyw5OTgsOTk5LDBd";
		

		let nodes = import_nodes_string_real.split("|");
		let actual_nodes = [];


		nodes.forEach(node_string => {

			let node_test = JSON.parse(node_string.slice(0,-1).substring(1));
			node_test.id = node_test.id - 1;

			actual_nodes.push(node_test);
		});

		this.setState({
			nodes: actual_nodes,
			node_ids: JSON.parse(atob(actual_ids_real))
		})
	}

	clearParent() {
		this.setState({
			parent: null
		});
	}

	render() {
		let nodes = [];
		let lines = [];
		for (let i = 0; i < this.state.nodes.length; i++) {
        	nodes.push(<MapNode key={this.state.nodes[i].id} isItem={this.state.nodes[i].isItem} onNodeHover={this.onNodeHover} onNodeUnHover={this.onNodeUnHover} id={this.state.nodes[i].id} initialX={this.state.nodes[i].x} initialY={this.state.nodes[i].y} onNodeDragEnd={this.onNodeDragEnd} onNodeClick={this.onNodeClick} />);
        	
        	let node = this.state.nodes[i];
        	for (let j = 0; j < node.children.length; j++) {
        		let child = node.children[j];

        		if (child != null)
        		{
        			lines.push(<Line points={[node.x + 5, node.y + 5, child.x + 5, child.y + 5]} stroke="black"/>);
        		}
        	}
        }

        const element = (<GroceryMapImage onMouseDown={this.onMouseDown}/>);
        const layer = (<Layer>
		        			{ element }
		        			{ nodes }
		        			{ lines }
				        </Layer>);

		return (
			<div>
				<div onContextMenu={(e) => e.preventDefault()}>
					<Stage width={800} height={480}>
		        		{layer}
				        <Layer x={this.state.tooltip.x} y={this.state.tooltip.y} visible={this.state.tooltip.visible}>
				        	<Text text={this.state.tooltip.text} />
				        </Layer>
				    </Stage>
			    </div>
			    <div>
			    	<ExportMapButton nodes={this.state.nodes} node_ids={this.state.node_ids}/>
			    </div>
			    <div>
			    	<ImportMapButton importNodes={this.importNodes} />
			    </div>
			    <div>
			    	<ClearMapButton clearNodes={this.clearNodes} />
			    </div>
			    <div>
			    	<button onClick={this.clearParent}>
			    		Clear Parent
			    	</button>
			    </div>
			</div>
		);
	}
}

class GroceryMapImage extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    const image = new window.Image();
    image.src = groceryMapImage;
    image.onload = () => {
      // setState will redraw layer
      // because "image" property is changed
      this.setState(
        {
          image: image
        },
        () => {
          this.myImage.cache();
          this.myImage.getLayer().draw();
        }
      );
    };
    image.crossOrigin = "Anonymous";
  }

  render() {

  	const element = (<Image
        image={this.state.image}
        ref={node => {
          this.myImage = node;
        }}
        width={800}
        height={480}
        onMouseDown={this.props.onMouseDown}
      />);

    return (
      element
    );
  }
}

export default GroceryMap;