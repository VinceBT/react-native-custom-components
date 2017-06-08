import { Platform } from 'react-native';

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

function createPaperStyle(_paper = 1) {
  const paper = Math.round(_paper);
  return Platform.select({
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
  });
}

export default createPaperStyle;
