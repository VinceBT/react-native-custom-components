// @flow
import React, { PropTypes } from 'react';
import { Animated, View, Platform } from 'react-native';

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
            shadowColor: 'rgba(0, 0, 0, 0.7)',
            shadowOffset: { width: 2, height: 2 },
            shadowRadius: 2,
            shadowOpacity: 1.0,
          },
          web: {
            boxShadow: 'rgba(0, 0, 0, 0.7) 0px 0px 6px 1px',
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
