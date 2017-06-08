import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import SwipeCard from './SwipeCard';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const THRESHOLDS = {
  top: 0,
  left: 80,
  right: 80,
  bottom: 0,
};
const RELEASE_ANIM_DURATION = 200;
const SWIPE_ANIM_DURATION = 250;

class SwipeStack extends Component {

  getCurrentCard() {
    return this._firstCard;
  }

  _firstCard = null;

  _handleCardStartMoving = (initialTouch, relativeDrag) => {
  };

  _handleCardMove = (initialTouch, relativeDrag) => {
    if (this.props.animLeft && THRESHOLDS.left) {
      this.props.animLeft.setValue(clamp(relativeDrag.x / -THRESHOLDS.left, 0, 1));
    }
    if (this.props.animRight && THRESHOLDS.right) {
      this.props.animRight.setValue(clamp(relativeDrag.x / THRESHOLDS.right, 0, 1));
    }
    if (this.props.animTop && THRESHOLDS.top) {
      this.props.animTop.setValue(clamp(relativeDrag.y / -THRESHOLDS.top, 0, 1));
    }
    if (this.props.animBottom && THRESHOLDS.bottom) {
      this.props.animBottom.setValue(clamp(relativeDrag.y / THRESHOLDS.bottom, 0, 1));
    }
  };

  _handleCardRelease = (initialTouch, relativeDrag) => {
    let swiped = false;
    if (THRESHOLDS.left && (relativeDrag.x < 0) && (Math.abs(relativeDrag.x) > THRESHOLDS.left)) {
      // LEFT
      swiped = true;
      this._firstCard.swipeTo({ x: -1000, y: 0, rotation: -Math.PI, duration: SWIPE_ANIM_DURATION });
      this.props.onSwipeLeft(this._firstCard.getCardData(), SWIPE_ANIM_DURATION);
    } else if (THRESHOLDS.right && (relativeDrag.x > 0) && (Math.abs(relativeDrag.x) > THRESHOLDS.right)) {
      // RIGHT
      swiped = true;
      this._firstCard.swipeTo({ x: 1000, y: 0, rotation: Math.PI, duration: SWIPE_ANIM_DURATION });
      this.props.onSwipeRight(this._firstCard.getCardData(), SWIPE_ANIM_DURATION);
    } else if (THRESHOLDS.top && (relativeDrag.y < 0) && (Math.abs(relativeDrag.y) > THRESHOLDS.top)) {
      // TOP
      swiped = true;
      this._firstCard.swipeTo({ x: 0, y: -1000, rotation: 0, duration: SWIPE_ANIM_DURATION });
      this.props.onSwipeTop(this._firstCard.getCardData(), SWIPE_ANIM_DURATION);
    } else if (THRESHOLDS.bottom && (relativeDrag.y > 0) && (Math.abs(relativeDrag.y) > THRESHOLDS.bottom)) {
      // BOTTOM
      swiped = true;
      this._firstCard.swipeTo({ x: 0, y: 1000, rotation: 0, duration: SWIPE_ANIM_DURATION });
      this.props.onSwipeBottom(this._firstCard.getCardData(), SWIPE_ANIM_DURATION);
    } else {
      this._firstCard.reset(150);
    }
    setTimeout(() => {
      if (this.props.animLeft) {
        Animated.timing(this.props.animLeft, {
          toValue: 0,
          duration: RELEASE_ANIM_DURATION,
        }).start();
      }
      if (this.props.animRight) {
        Animated.timing(this.props.animRight, {
          toValue: 0,
          duration: RELEASE_ANIM_DURATION,
        }).start();
      }
      if (this.props.animTop) {
        Animated.timing(this.props.animTop, {
          toValue: 0,
          duration: RELEASE_ANIM_DURATION,
        }).start();
      }
      if (this.props.animBottom) {
        Animated.timing(this.props.animBottom, {
          toValue: 0,
          duration: RELEASE_ANIM_DURATION,
        }).start();
      }
    }, swiped ? 200 : 10);
  };

  render() {
    const { cardDataSource, renderCard, renderEmpty } = this.props;
    const arrangedCardData = cardDataSource.reverse().slice(-3);
    const firstCardIndex = arrangedCardData.length - 1;
    return (
      <View style={[this.props.style, { position: 'relative' }]}>
        {renderEmpty()}
        {arrangedCardData.map((cardData, i) => (
          <SwipeCard
            key={cardData.hash}
            cardData={cardData}
            ref={(c) => {
              if (i === firstCardIndex) this._firstCard = c;
            }}
            disabled={(i !== firstCardIndex)}
            onStartMoving={this._handleCardStartMoving}
            onMove={this._handleCardMove}
            onRelease={this._handleCardRelease}
            releaseAnimDuration={RELEASE_ANIM_DURATION}
            directions={THRESHOLDS}>
            {renderCard(cardData)}
          </SwipeCard>
        ))}
      </View>
    );
  }

}

SwipeStack.propTypes = {
  style: PropTypes.any,
  cardDataSource: PropTypes.array.isRequired,
  renderCard: PropTypes.func.isRequired,
  renderEmpty: PropTypes.func.isRequired,
  animLeft: PropTypes.instanceOf(Animated.Value),
  animRight: PropTypes.instanceOf(Animated.Value),
  animTop: PropTypes.instanceOf(Animated.Value),
  animBottom: PropTypes.instanceOf(Animated.Value),
  onSwipeLeft: PropTypes.func,
  onSwipeRight: PropTypes.func,
  onSwipeTop: PropTypes.func,
  onSwipeBottom: PropTypes.func,
  onTouch: PropTypes.func,
};
SwipeStack.defaultProps = {
  enableSwiping: true,
  onSwipeLeft: () => {
  },
  onSwipeRight: () => {
  },
  onSwipeTop: () => {
  },
  onSwipeBottom: () => {
  },
  onTouch: () => {
  },
};

export default SwipeStack;
