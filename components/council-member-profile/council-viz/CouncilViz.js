import React from "react";
import { Stage, Layer, Circle, Line, Rect, Text } from "react-konva";
import WhiteCircles from "./WhiteCircles";
import Network from "./Network";

class CouncilViz extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.state = {
      stageWidth: undefined,
      stageHeight: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      stageWidth: this.container.offsetWidth,
      stageHeight: this.container.offsetHeight,
    });
  }

  render() {
    const width =
      this.state.stageWidth !== undefined
        ? this.state.stageWidth
        : window.innerWidth;
    const height =
      this.state.stageHeight !== undefined
        ? this.state.stageHeight
        : window.innerHeight;
    let valText = "";
    if (this.props.memberInfo !== undefined) {
      valText =
        this.props.memberInfo.socialInfo.name !== null
          ? this.props.memberInfo.socialInfo.name
          : this.props.memberInfo.keyStats.stashId;
      if (valText.length > 11) {
        valText = valText.slice(0, 5) + "..." + valText.slice(-5);
      }
    }
    const NetworkName = this.props.networkName;
    let radius = 400;

    const validatorRectangleWidth = 110;
    const validatorRectangleHeight = 30;

    let opacity = 0.3;

    return this.props.memberInfo === undefined ? (
      <React.Fragment>
        <div></div>
      </React.Fragment>
    ) : (
      <>
        <div
          className="viz"
          ref={(node) => {
            this.container = node;
          }}
        >
          {/* <div
          className="back-arrow"
          onClick={this.BackbtnhandleClick}
          onMouseOver={this.BackbtnhandleOnMouseOver}
          onMouseOut={this.BackbtnhandleOnMouseOut}
        >
          &#8592;
        </div> */}

          <Stage width={width} height={height}>
            <Layer>
              {/* Here n is number of white circles to draw
                        r is radius of the imaginary circle on which we have to draw white circles
                        x,y is center of imaginary circle 
                     */}

              <WhiteCircles
                r={radius}
                x={width / 2}
                y={height - 185 - validatorRectangleHeight / 2}
                maxRadius={height / 2 - 50}
                memberInfo={this.props.memberInfo}
              />
              {/* Adding 6 to stating and ending y point and 24 to length of line
                    because the upper left corner of rectangle is at width/2,height/2
                    so mid point of rectangle becomes width/2+12,height/2+6
                 */}
              <Line
                points={[width / 2, height - 185, width / 2, height]}
                fill="#35475C"
                strokeWidth={2}
                stroke="#35475C"
                opacity={opacity}
              />
              {/* Arc used to create the semicircle on the right, 
                    Rotation is used to rotate the arc drawn by 90 degrees in clockwise direction
                */}
              <Circle
                x={width / 2}
                y={height + 135}
                rotation={180}
                angle={180}
                radius={235}
                fill={"#212D3B"}
                stroke={"#35475C"}
                strokeWidth={4}
              />

              <Rect
                x={width / 2 - validatorRectangleWidth / 2}
                y={height - 185 - validatorRectangleHeight}
                width={validatorRectangleWidth}
                height={validatorRectangleHeight}
                fill={"#48607C"}
                cornerRadius={8}
                // onMouseOver={this.handleOnMouseOver}
                // onMouseOut={this.handleOnMouseOut}
              />
              <Text
                text={valText}
                x={width / 2 - validatorRectangleWidth / 2}
                y={height - 185 - validatorRectangleHeight + 10}
                width={validatorRectangleWidth}
                height={validatorRectangleHeight}
                align="center"
                fill="white"
                fontSize={12}
                fontStyle="bold"
              />
              <Network
                x={width / 2}
                y={height + 135}
                NetworkName={NetworkName}
              />
            </Layer>
          </Stage>
        </div>
      </>
    );
  }
}

export default CouncilViz;
