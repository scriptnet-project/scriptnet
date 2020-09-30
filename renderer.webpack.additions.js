const path = require('path');

module.exports = {
  externals: {
    react: 'commonjs react',
   'react-dom': 'commonjs react-dom',
  },
  resolve: {
    alias: {
      'Renderer': path.resolve(__dirname, 'src', 'renderer'),
      'Components': path.resolve(__dirname, 'src', 'renderer', 'components'),
      'Hooks': path.resolve(__dirname, 'src', 'renderer', 'hooks'),
      'Ducks': path.resolve(__dirname, 'src', 'renderer', 'store'),
    },
  },
};
