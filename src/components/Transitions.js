import React from 'react';
import '../styles/transitionStyles.scss';

export class LeftArrow extends React.Component {
    render() {
      return (
        <a
          href="#"
          className="leftArrow"
          onClick={this.props.onClick}
        >
          <div className="arrows" ><h1>&#60;</h1></div>
        </a>
      );
    }
  }
  
  export class RightArrow extends React.Component {
    render() {
      return (
        <a
          href="#"
          className="rightArrow"
          onClick={this.props.onClick}>
          <div className="arrows"><h1>&#62;</h1></div>
        </a>
      );
    }
  }

  export class Indicators extends React.Component {
    render() {
      return (
        <li>
          <a
            className={
              this.props.index === this.props.activeIndex
                ? "indicator indicator--active" : "indicator" }
            onClick={this.props.onClick}
          />
        </li>
      );
    }
  }