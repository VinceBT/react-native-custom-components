import React  from 'react';
import PropTypes from 'prop-types';
import { Animated, View, Platform } from 'react-native';

const shadowMap = [{
  opacity: 0.12,
  blur: 6,
}, {
  opacity: 0.16,
  blur: 10,
}, {
  opacity: 0.19,
  blur: 30,
}, {
  opacity: 0.25,
  blur: 45,
}, {
  opacity: 0.30,
  blur: 60,
}];

const PaperView = (props) => {
  const { style, paper = 1, ...otherProps } = props;
  return (
    <Animated.View
      {...otherProps}
      style={[style, {
        ...Platform.select({
          android: {
            elevation: paper,
          },
          ios: {
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: shadowMap[paper].blur,
            shadowOpacity: shadowMap[paper].opacity,
          },
          web: {
            boxShadow: `rgba(0, 0, 0, ${shadowMap[paper].opacity}) 0px 0px ${shadowMap[paper].blur}px`,
          },
        }),
      }]} />
  );
};

PaperView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  paper: PropTypes.number,
};

export default PaperView;
