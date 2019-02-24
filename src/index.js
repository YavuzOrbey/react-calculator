import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function CalculatorButton(props) {
  let classStyle = "calc-button col-lg-2 " + props.color;
  return (
    <button className={classStyle} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
class Buttons extends React.Component {
  renderButton(i, color = "black") {
    return (
      <CalculatorButton
        color={color}
        value={i}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    const buttons = [
      ["OFF", 7, 8, 9, "\\(\\sqrt{n}\\)", "%"],
      ["!", 4, 5, 6, "\\(\\times\\)", "\\(\\div\\)"],
      ["CE", 1, 2, 3, "+", "-"],
      ["ON", 0, ".", "+/-", "+", "="]
    ];
    const buttonsAsHTML = buttons.map((buttonGroup, index) => {
      return (
        <div className="row" key={index}>
          {buttonGroup.map((button, indexTwo) => {
            return this.renderButton(button);
          })}
        </div>
      );
    });

    console.log(buttonsAsHTML);
    return (
      <div className="calculator-layout col-lg-12">
        {/*  <div className="row">
          {this.renderButton("OFF", "gray")}
          {this.renderButton(7)}
          {this.renderButton(8)}
          {this.renderButton(9)}
          {this.renderButton("\\(\\sqrt{n}\\)", "gray")}
          {this.renderButton("%", "gray")}
        </div>
        <div className="row">
          {this.renderButton("!", "gray")}
          {this.renderButton(4)}
          {this.renderButton(5)}
          {this.renderButton(6)}
          {this.renderButton("\\(\\times\\)", "gray")}
          {this.renderButton("\\(\\div\\)", "gray")}
        </div>
        <div className="row">
          {this.renderButton("CE", "red")}
          {this.renderButton(1)}
          {this.renderButton(2)}
          {this.renderButton(3)}
          {this.renderButton("+", "gray")}
          {this.renderButton("-", "gray")}
        </div>
        <div className="row">
          {this.renderButton("ON", "red")}
          {this.renderButton(0)}
          {this.renderButton(".")}
          {this.renderButton("+/-")}
          {this.renderButton("+", "gray")}
          {this.renderButton("=", "gray")}
        </div> */}
        {buttonsAsHTML}
      </div>
    );
  }
}
class Display extends React.Component {
  render() {
    return (
      <div className="display-container">
        <h1 className="display-background col-md-12">
          888888888888888888888888
        </h1>
        <h1 className="display col-md-12">{this.props.value}</h1>
      </div>
    );
  }
}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      previousOperation: null,
      previousNum: null
    };
  }

  handleClick(i) {
    const history = this.state.history;
    // dont parseInt until a operation sign comes
    //binary operations
    switch (i) {
      case "+":
      case "-":
      case "\\(\\times\\)":
      case "\\(\\div\\)":
        let num = parseFloat(history.join("")) || 0;

        // the first number input after a page reload or pressing CLR button

        if (this.state.previousNum === null) {
          this.setState({
            previousNum: num,
            history: [],
            previousOperation: i
          });
        } else {
          const result = this.performBinaryOperation(
            this.state.previousNum,
            num,
            this.state.previousOperation
          );
          this.setState({
            previousNum: result,
            history: [],
            previousOperation: i
          });
        }
        break;

      case "=":
        num = parseFloat(history.join("")) || 0;
        let result = this.performBinaryOperation(
          this.state.previousNum,
          num,
          this.state.previousOperation
        );
        this.setState({
          previousNum: null,
          history: [].concat(result),
          previousOperation: i
        });
        break;
      case "OFF":
        this.setState({
          previousNum: null,
          history: [""],
          previousOperation: null
        });
        break;
      case "ON":
        this.setState({
          previousNum: null,
          history: [],
          previousOperation: null
        });
        break;
      case "\\(\\sqrt{n}\\)":
        num = parseFloat(history.join("")) || 0;
        result = this.performUnaryOperation(num, i);
        this.setState({
          previousNum: null,
          history: [].concat(result),
          previousOperation: this.previousOperation
        });
        break;
      case "CE":
        this.setState({
          previousNum: null,
          history: [],
          previousOperation: null
        });
        break;
      case "!":
        num = parseFloat(history.join("")) || 0;
        result = this.performUnaryOperation(num, i);
        this.setState({
          previousNum: null,
          history: [].concat(result),
          previousOperation: this.previousOperation
        });
        break;
      default:
        this.setState({ history: history.concat(i) });
    }
  }
  performBinaryOperation(a, b = 1, operation = "") {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "\\(\\times\\)":
        return a * b;
      case "\\(\\div\\)":
        return a / b;
      default:
        return;
    }
  }
  performUnaryOperation(a, operation, acc = 1) {
    switch (operation) {
      case "\\(\\sqrt{n}\\)":
        return Math.sqrt(a);
      case "!":
        if (!Number.isInteger(a)) return "ERR";
        if (a == 0) return 1;
        return a * this.performUnaryOperation(a - 1, operation, a * acc);
    }
  }
  //hopefully i in this situation will be data sent from child
  render() {
    return (
      <div className="calculator container">
        <Display
          value={
            this.state.history.length
              ? this.state.history
              : this.state.previousNum
          }
        />
        <Buttons onClick={i => this.handleClick(i)} />
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
