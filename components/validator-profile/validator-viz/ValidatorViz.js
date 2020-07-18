import React from "react";
import { Stage, Layer, Circle, Line, Rect, Text } from "react-konva";
import WhiteCircles from "./WhiteCircles";
import Network from "./Network";

class ValidatorViz extends React.Component {
  constructor() {
    super();
    this.container = React.createRef();
    this.state = {
      validator: "",
      nominators: [],
      showValidatorAddress: false,
      stash: "",
      showNominatorAddress: false,
      stageWidth: undefined,
      stageHeight: undefined,
      controller: "",
      totalinfo: [],
      valinfo: {},
      ValidatorData: undefined,
      copied: false,
    };
    this.ismounted = false;
    this.totalvalue = 0;
    this.ownvalue = 0;
  }

  componentDidMount() {
    this.serverApi();
    this.ismounted = true;
    this.checkSize();
    // here we should add listener for "container" resize
    // take a look here https://developers.google.com/web/updates/2016/10/resizeobserver
    // for simplicity I will just listen window resize
    window.addEventListener("resize", this.checkSize);
  }

  checkSize = () => {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    // console.log(width, height);
    this.setState({
      stageWidth: width,
      stageHeight: height,
    });
  };

  handleOnMouseOver = () => {
    this.setState({ showValidatorAddress: true });
  };
  handleOnMouseOut = () => {
    this.setState({ showValidatorAddress: false });
  };

  BackbtnhandleOnMouseOver = () => {
    document.body.style.cursor = "pointer";
  };
  BackbtnhandleOnMouseOut = () => {
    document.body.style.cursor = "default";
  };

  BackbtnhandleClick = () => {
    document.body.style.cursor = "default";
    this.props.history.push({
      pathname: "/alexander",
      state: { totalinfo: this.props.totalinfo, valinfo: this.props.valinfo },
    });
  };
  homebtnhandleClick = () => {
    document.body.style.cursor = "default";
    this.props.history.push({
      pathname: "/",
      state: { totalinfo: this.props.totalinfo, valinfo: this.props.valinfo },
    });
  };
  onCopy = () => {
    console.log("youp", this.ismounted);
    if (this.ismounted) {
      this.setState({ copied: true }, () => {
        console.log("copied state set");
        setInterval(() => {
          this.setState({ copied: false });
        }, 3000);
      });
    }
  };

  async serverApi() {
    const url =
      "https://yieldscan-api.onrender.com/api/validator/" +
      "EX98wxj7cUkpPxcsEsNK9J6qX8N79mv6om8bbjLGnu9Q1ur";
    try {
      const validator_response = await fetch(url);
      const validator_data = await validator_response.json();
      console.log("validator_data");
      console.log(validator_data);

      // // Handle validator data
      // if (validator_data && validator_data.length > 0) {
      //   arr1 = JSON.parse(JSON.stringify(validator_data)).map(({ currentValidator, accountIndex }) => {
      //     // console.log(info);
      //     return {
      //       valname: currentValidator.accountId,
      //       valinfo: currentValidator,
      //       accountIndex: accountIndex,

      //     };
      //   });
      //   // console.log('arr1++++++++++', arr1);
      // }

      // // Handle intention data
      // if (intention_data && intention_data.intentions.length > 0) {
      //   // console.log('+++++++++++______+++++++')
      //   // console.log(intention_data.intentions)
      //   const intentionsValname = intention_data.intentions
      //   const intentionsInfo = intention_data.info
      //   const arr2 = intentionsValname.map( currentIntention => {
      //     // console.log('currentIntention' + currentIntention);
      //     // console.log('currentIntention index' + JSON.stringify(intentionsValname.indexOf(currentIntention)));
      //     return {
      //       valname: currentIntention,
      //       valinfo: JSON.parse(JSON.stringify(intentionsInfo[intentionsValname.indexOf(currentIntention)])),
      //     };
      //   });
      //   // console.log('arr2++++++++++', arr2);

      //   // set state to render both intention and validators
      //   this.setState({
      //     ValidatorsData: arr1,
      //     IntentionsData: arr2,
      //   });
      // }
      this.setState({
        ValidatorData: validator_data,
      });
    } catch (err) {
      console.log("err", err);
    }
  }

  handlePolkavizClick = () => {
    document.body.style.cursor = "default";
    this.props.history.push({
      pathname: "/",
    });
  };

  handleAlexanderClick = () => {
    document.body.style.cursor = "default";
    this.props.history.push({
      pathname: "/alexander",
    });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkSize);
    this.ismounted = false;
  }
  render() {
    const width =
      this.state.stageWidth === undefined
        ? window.innerWidth
        : this.state.stageWidth;
    const height =
      this.state.stageHeight === undefined
        ? window.innerHeight
        : this.state.stageHeight;
    let valText = undefined;
    if (this.state.ValidatorData !== undefined) {
      valText =
        this.state.ValidatorData.socialInfo.name !== null
          ? this.state.ValidatorData.socialInfo.name
          : this.state.ValidatorData.keyStats.stashId;
      if (valText.length > 11) {
        valText = valText.slice(0, 5) + "..." + valText.slice(-5);
      }
    }
    const NetworkName = "KUSAMA NETWORK";
    let radius = 400;

    const validatorRectangleWidth = 110;
    const validatorRectangleHeight = 30;

    if (this.state.nominators.length > 10) {
      radius = 200;
    }
    let opacity = 0.3;

    return this.state.ValidatorData === undefined ? (
      <React.Fragment>
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </React.Fragment>
    ) : (
      <>
        <div
          className="specific-view"
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

          <Stage width={width} height={window.innerHeight}>
            <Layer>
              {this.state.copied && (
                <Text
                  text="copied"
                  x={1000}
                  y={45}
                  fill="green"
                  fontSize={18}
                />
              )}
              {/* Here n is number of white circles to draw
                        r is radius of the imaginary circle on which we have to draw white circles
                        x,y is center of imaginary circle 
                     */}

              <WhiteCircles
                r={radius}
                x={width / 2}
                y={height - 185 - validatorRectangleHeight / 2}
                maxRadius={height / 2 - 15}
                history={this.props.history}
                valinfo={this.state.ValidatorData}
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

export default ValidatorViz;
