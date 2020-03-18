import React from 'react';
import {LeftArrow, RightArrow, Indicators} from './Transitions';
import {Slide} from './Slide';
import '../styles/sliderStyles.scss';

const SLIDE_WIDTH = 450; //width of the slide to swipe

export class SliderApp extends React.Component {

  transitionTimeout;
  wheelTimeout;
  lastTouch = 0; //shows where was the last touch on screen

    constructor(props) {
      super(props);
  
      this.prevSlide = this.prevSlide.bind(this);
      this.nextSlide = this.nextSlide.bind(this);
      this.toSlide = this.toSlide.bind(this);

      this.state = {
        activeIndex: 0,  //shows where we are at the moment
        motion: 0,
        transitionDuration: "0s",
      };
    }
  
    componentWillUnmount = () => {
      clearTimeout(this.transitionTimeout);
    };
  
    handleWheel = e => {
      clearTimeout(this.wheelTimeout);
      this.handleMotion(e.deltaX);
      this.wheelTimeout = setTimeout(() => this.handleMotionEnd(), 100);
    };

    handleTouchStart = e => {
      this.lastTouch = e.nativeEvent.touches[0].clientX;
    };

    handleTouchMove = e => {
      const direction = this.lastTouch - e.nativeEvent.touches[0].clientX;
      this.lastTouch = e.nativeEvent.touches[0].clientX;
  
      this.handleMotion(direction);
    };

    handleTouchEnd = () => {
      this.handleMotionEnd();
      this.lastTouch = 0;
    };

    toSlide(index) { //to go to a selected slide (go to slideX)
      this.setState({
        activeIndex: index
      });
    }
  
    nextSlide(e) { //to go to the next slide
      e.preventDefault();
  
      let index = this.state.activeIndex;
      let { slides } = this.props;
      let maxLength = slides.length - 1;
  
      //if we are on the last slide go to the next slide, app will go to the first slide (infinite option)
      if (index === maxLength) {
        index = -1;
      }
      ++index;
  
      this.setState({
        activeIndex: index
      });
    }

    prevSlide(e) { //to go to previous slide
      e.preventDefault();
  
      let index = this.state.activeIndex;
      let { slides } = this.props;
      let maxLength = slides.length;
  
      //if we are on the first slide go to perious slide, app will go to the last slide (infinite option)
      if (index < 1) { 
        index = maxLength;
      }
      --index;
  
      this.setState({
        activeIndex: index
      });
    }

    handleMotion = difference => {
      clearTimeout(this.transitionTimeout);
  
      this.setState(state => {
        let { slides } = this.props;
        const maxLength = slides.length - 1;
        let nextMotion = state.motion + difference;
  
        //if we scroll the first slide go to the last slide, app will go to the last slide (infinite option)
        if (nextMotion < 0) {
          nextMotion = maxLength * SLIDE_WIDTH;
        }
  
        //if we scroll the last slide go to the next slide, app will go to the first slide (infinite option)
        if (nextMotion > maxLength * SLIDE_WIDTH) {
          nextMotion = 0;
        }
  
        return {
          motion: nextMotion,
          transitionDuration: "0s",
        };
      });
    };
  
    handleMotionEnd = () => {
      const { motion, activeIndex } = this.state;
  
      //slide and the percentage of previous/next other slide
      const finalLocation = motion / SLIDE_WIDTH;

      //remainder which returns the partial piece of slide 
      const slidePart = finalLocation % 1;

      //number of slides which the user passed
      const finalIndex = finalLocation - slidePart;
      
      //to know in which direction user made motion
      const direction = finalIndex - activeIndex;
  
      let index = finalIndex;
  
      //if dierection is positive, we go to the next slide
      //if user scrolls the next slide on at least 10%, we go to the next slide
      if (direction >= 0) {
        if (slidePart >= 0.1) {
          index += 1;
        }

      //if direction is negative, we go to the previous slide
      //if user scrolls the previous slide on 90%, we go to the previous slide
      } else if (direction < 0) {
        index = activeIndex - Math.abs(direction);
        if (slidePart > 0.9) {
          index += 1;
        }
      }
  
      this.goTo(index, Math.min(0.5, 1 - Math.abs(slidePart)));
    };
    
    goTo = (index, duration) => {
      this.setState({
        motion: index * SLIDE_WIDTH,
        transitionDuration: `${duration}s`,
        activeIndex: index,
      });
  
      this.transitionTimeout = setTimeout(() => {
        this.setState({ transitionDuration: "0s" });//0s means that slides scroll instantly
      }, duration * 100); //*100 to get ms
    };

    render() {
      return (
        <div className="sliderApp">
        
          <section>
            <h1>Slider application</h1>
          </section>
  
        <div className="slider" 
            onWheel={this.handleWheel}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            >  
    
          <ul className="slides">
            {this.props.slides.map((slide, index) =>
              <Slide
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                slide={slide}/>)}
          </ul>
        </div>

          <LeftArrow onClick={e => this.prevSlide(e)} />

          <RightArrow onClick={e => this.nextSlide(e)} />
  
          <ul className="indicators">
            {this.props.slides.map((slide, index) =>
              <Indicators
                key={index}
                index={index}
                activeIndex={this.state.activeIndex}
                isActive={this.state.activeIndex === index} 
                onClick={e => this.toSlide(index)}
              />
            )}
          </ul>
        </div>
      );
    }
  }

  export default SliderApp;