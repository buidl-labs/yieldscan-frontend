import React from "react";
import { Text } from "react-konva";

class Network extends React.Component {
	render() {
		let angle = 180 * 0.0174533 - (1 / 5) * Math.PI;
		const maxAngle = (1 / 5) * 2 * Math.PI;
		const arr = [];
		const reversedName = this.props.networkInfo.name.split("").reverse();

		const radius = 220;

		reversedName.forEach((element, index) => {
			angle += maxAngle / (Number(reversedName.length) + 1);
			arr.push(
				<Text
					x={radius * Math.sin(angle) + this.props.x}
					y={radius * Math.cos(angle) + this.props.y}
					text={element}
					fill="#798594"
					history={this.props.history}
					angle={angle}
					radius={200}
					fontSize={6}
				/>
			);
		});

		return arr;
	}
}

export default Network;
