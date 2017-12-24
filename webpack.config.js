const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ja/)
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
};
