import React from "react";
import { Circle, Line, Text, Rect } from "react-konva";

class Circleandline extends React.Component {
	constructor() {
		super();
		this.state = {
			showNominatorAddress: false,
		};
	}
	handleOnMouseOver = (e) => {
		e.target.setAttrs({
			scaleX: 1.3,
			scaleY: 1.3,
		});
		document.body.style.cursor = "pointer";
		this.setState({ showNominatorAddress: true });
	};
	handleOnMouseOut = (e) => {
		e.target.setAttrs({
			scaleX: 1,
			scaleY: 1,
		});
		document.body.style.cursor = "default";
		this.setState({ showNominatorAddress: false });
	};

	render() {
		const cardWidth = 159;
		const cardHeight = 69;

		let nomaddress =
			this.props.nomId.toString().slice(0, 5) +
			"......" +
			this.props.nomId.toString().slice(-5);

		const nombonded =
			this.props.stake !== (undefined || null)
				? "Bonded: " +
				  this.props.stake.toString().slice(0, 7) +
				  ` ${this.props.networkInfo.denom}`
				: undefined;

		let x1 = this.props.x + 15;
		let y1 = this.props.y - 8;

		if (x1 > this.props.width - cardWidth) {
			y1 = y1 + 20;
			x1 = x1 - cardWidth / 2;
		}

		return (
			<React.Fragment>
				<Line
					points={[this.props.x, this.props.y, this.props.x2, this.props.y2]}
					stroke="#35475C"
					strokeWidth={1}
				/>
				<Circle
					x={this.props.x}
					y={this.props.y}
					radius={7}
					fill="#2BCACA"
					onMouseOver={this.handleOnMouseOver}
					onMouseOut={this.handleOnMouseOut}
					// onClick={this.handleClick}
				/>

				{this.state.showNominatorAddress && (
					<Rect
						x={x1}
						y={y1}
						width={cardWidth}
						height={cardHeight}
						cornerRadius={4.69457}
						fill="#48607C"
						shadowOffsetY={10}
						shadowBlur={10}
						shadowColor="black"
						shadowOpacity={0.5}
					/>
				)}

				{this.state.showNominatorAddress && (
					<Text
						text={nomaddress}
						x={x1 + 15}
						y={y1 + 10}
						fill="#FFFFFF"
						fontSize={16}
						fontStyle={"bold"}
					/>
				)}
				{this.state.showNominatorAddress && this.props.isElected && (
					<Text text={nombonded} x={x1 + 15} y={y1 + 35} fill="#B2BECC" />
				)}
			</React.Fragment>
		);
	}
}
export default Circleandline;
