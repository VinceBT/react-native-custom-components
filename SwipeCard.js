import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
});

class SwipeCard extends Component {

  getCardData = () => {
    return this.props.cardData;
  };

  swipeTo = ({ x, y, rotation, duration }) => {
    Animated.timing(this.animOffsetX, { toValue: x, duration }).start();
    Animated.timing(this.animOffsetY, { toValue: y, duration }).start();
    Animated.timing(this.animRotate, { toValue: rotation, duration }).start();
  };

  reset = (duration) => {
    this.swipeTo({ x: 0, y: 0, rotation: 0, duration });
  };

  dragging = false;

  initialTouch = {
    x: 0,
    y: 0,
  };
  relativeDrag = {
    x: 0,
    y: 0,
  };

  animOffsetX = new Animated.Value(0);
  animOffsetY = new Animated.Value(0);
  animRotate = new Animated.Value(0);

  _handleStartShouldSetResponder = (event, gestureState) => {
    if (this.props.disabled === true) {
      return false;
    }
    this.dragging = true;
    this.initialTouch = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    this.props.onStartMoving(this.initialTouch, this.relativeDrag);
    this.props.onMove(this.initialTouch, this.relativeDrag);
    return true;
  };

  _handleMoveShouldSetResponder = (event, gestureState) => {
    if (this.props.disabled === true) {
      return false;
    }
    const { dx, dy } = gestureState;
    if (!dx || !dy) {
      return false;
    }
    return true;
  };

  _handleResponderMove = (event, gestureState) => {
    if (this.props.disabled === true) {
      return;
    }
    if (this.dragging) {
      this.relativeDrag = {
        x: event.nativeEvent.pageX - this.initialTouch.x,
        y: event.nativeEvent.pageY - this.initialTouch.y,
      };
      this.props.onMove(this.initialTouch, this.relativeDrag);
      if ((this.relativeDrag.x < 0 && this.props.directions.left) || (this.relativeDrag.x > 0 && this.props.directions.right)) {
        this.animOffsetX.setValue(this.relativeDrag.x);
      }
      if ((this.relativeDrag.y < 0 && this.props.directions.top) || (this.relativeDrag.y > 0 && this.props.directions.bottom)) {
        this.animOffsetY.setValue(this.relativeDrag.y);
      }
      this.animRotate.setValue(Math.tan(this.animOffsetX._value / 1200));
    }
  };

  _handleResponderRelease = (event, gestureState) => {
    if (this.props.disabled === true) {
      return;
    }
    this.dragging = false;
    this.props.onMove(this.initialTouch, this.relativeDrag);
    this.props.onRelease(this.initialTouch, this.relativeDrag);
    this.initialTouch = { x: 0, y: 0 };
    this.relativeDrag = { x: 0, y: 0 };
  };

  render() {
    return (
      <Animated.View
        onResponderMove={this._handleResponderMove}
        onResponderRelease={this._handleResponderRelease}
        onStartShouldSetResponder={this._handleStartShouldSetResponder}
        onMoveShouldSetResponder={this._handleMoveShouldSetResponder}
        style={[StyleSheet.absoluteFill, {
          transform: [
            { translateX: this.animOffsetX },
            { translateY: this.animOffsetY },
            {
              rotateZ: this.animRotate.interpolate({
                inputRange: [0, Math.PI],
                outputRange: ['0deg', '180deg'],
              }),
            },
          ],
        }]}>
        <View style={styles.cardWrapper}>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }

}

SwipeCard.propTypes = {
  disabled: PropTypes.bool,
  cardData: PropTypes.object.isRequired,
  onStartMoving: PropTypes.func,
  onMove: PropTypes.func,
  onRelease: PropTypes.func,
  onTap: PropTypes.func,
  directions: PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    bottom: PropTypes.number,
  }).isRequired,
  children: PropTypes.element.isRequired,
};
SwipeCard.defaultProps = {
  disabled: false,
  onStartMoving: () => {
  },
  onMove: () => {
  },
  onRelease: () => {
  },
  onTouch: () => {
  },
  releaseAnimDuration: 200,
};

export default SwipeCard;
