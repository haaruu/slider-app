import React from 'react';
import '../styles/slideStyles.scss';

export class Slide extends React.Component {
    render() {
      return (
        <li className={
            this.props.index === this.props.activeIndex
              ? "slide slide--active" : "slide" }>
          <p className="text">{this.props.slide.text}</p>
        </li>
      );
    }
  }
  export default Slide;