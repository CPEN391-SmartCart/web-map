import React from 'react';

class ExportMapButton extends React.Component {
	
	constructor(props) {
		super(props);

		this.exportNodes = this.exportNodes.bind(this);
	}

	line(x, y, x2, y2) {
		let coords = [];
		let w = x2 - x;
		let h = y2 - y;

		let dx1 = 0;
		let dy1 = 0;
		let dx2 = 0;
		let dy2 = 0;

		if (w < 0)
		{
			dx1 = -1;
		}
		else if (w > 0)
		{
			dx1 = 1;
		}
		
		if (h < 0)
		{
			dy1 = -1;
		}
		else if (h > 0)
		{
			dy1 = 1;
		}

		if (w < 0)
		{
			dx2 = -1;
		}
		else if (w > 0)
		{
			dx2 = 1;
		} 

		let longest = Math.abs(w);
		let shortest = Math.abs(h);

		if (!(longest > shortest))
		{
			longest = Math.abs(h);
			shortest = Math.abs(w);
			if (h < 0)
			{
				dy2 = -1;
			}
			else if (h > 0)
			{
				dy2 = 1;
			}

			dx2 = 0;
		}

		let numerator = longest >> 1;
		for (let i = 0; i <= longest; i++)
		{
			coords.push({x: x, y: y});
			numerator += shortest;
			if (!(numerator < longest))
			{
				numerator -= longest;
				x += dx1;
				y += dy1;
			}
			else
			{
				x += dx2;
				y += dy2;
			}
		}

		return coords;
	}

	containsChild(children, id) {
		for (let i = 0; i < children.length; i++)
		{
			if (children[i].id == id)
				return true;
		}

		return false;
	}

	exportNodes() {
		let all_node_string = "";
		let total_if_else = "";
		let test = "";
		let max_nodes = 100;

		let node_struct_string = "";

		let context = document.getElementsByClassName("konvajs-content")[0].children[0].getContext('2d');
		this.props.nodes.forEach(nodeOk => {

			node_struct_string += "{" + nodeOk.x + ", " + nodeOk.y + "},\n";

			if (nodeOk.isItem)
			{
				this.props.nodes.forEach(otherNode => {
					if (nodeOk.id != otherNode.id) {
						

						let coords = this.line(nodeOk.x + 5, nodeOk.y + 5, otherNode.x + 5, otherNode.y + 5);
						let clear = true;
						coords.every(coord => {
							let pixelColour = context.getImageData(coord.x, coord.y, 1, 1).data;

							let red = pixelColour[0];
							let green = pixelColour[1];
							let blue = pixelColour[2];
							if ((red == 148 && green == 185 && blue == 66) || (red == 223 && green == 224 && blue == 226))
							{
								clear = false;
								return false;
							}

							return true;
						});

						if (clear)
						{
							if (this.containsChild(nodeOk.children, otherNode.id) == false)
							{
								nodeOk.children.push(otherNode);
							}

							if (this.containsChild(otherNode.children, nodeOk.id) == false)
							{
								otherNode.children.push(nodeOk);
							}
						}
					}
				});
			}
		});

		let i = 0;
		this.props.nodes.forEach(nodeOk => {
			if (i == max_nodes)
				return true;

			let node = { x: nodeOk.x, y: nodeOk.y, id: nodeOk.id, children: nodeOk.children };
			let node_id = ("0000" + nodeOk.id.toString(16)).substr(-4);
			let node_string = node_id;

			let arr = Array(max_nodes).fill("10000");

			arr[nodeOk.id] = "0000";

			for (let i = 0; i < nodeOk.children.length; i++)
			{
				let child = nodeOk.children[i];

				if (child != null)
				{
					let distance = Math.round(Math.sqrt(((nodeOk.x - child.x) ** 2) + ((nodeOk.y - child.y) ** 2)));

					let hex_distance = ("0000" + distance.toString(16)).substr(-4);

					arr[child.id] = hex_distance;
				}
			}
			
			node.children = [];
			all_node_string += arr.join() + "|";

			let if_else_string = "";
			for (let i = 0; i < arr.length; i++)
			{
				let distance = arr[i];

				if (distance != 0 && distance != 10000)
				{
					if_else_string += "else if ((row == " + nodeOk.id + " && i == " + i + ")) begin\n 	write_data[i] <= 14'h" + distance + ";\nend\n";
				}
			}

			console.log(if_else_string);
			console.log(arr);
			test += "\\" + JSON.stringify(JSON.stringify(arr)).slice(0, -1) + "\\\"|";
			total_if_else += if_else_string;
			i++;
		});

		console.log(all_node_string);
		console.log(total_if_else);
		console.log(node_struct_string);
		//console.log(test);
		//console.log(btoa(JSON.stringify(this.props.node_ids)));
	}

	render() {
		return (
			<button onClick={this.exportNodes}>
				Export Map
			</button>
		);
	}
}

export default ExportMapButton;