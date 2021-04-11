module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    fill: theme => ({
      red: theme('colors.red.primary'),
    }),
    colors: {
      white: '#ffffff',
      blue: {
        medium: '#005c98', //blue-medium
      },
      black: {
        light: '#005c98',
        faded: '#00000059',
      },
      gray: {
        base: '#616161', //gray-base
        background: '#fafafa',
        primary: '#dbdbdb', //gray-primary
      },
      red: {
        primary: '#ed4956', //red-primary
      },
    },
  },
};
