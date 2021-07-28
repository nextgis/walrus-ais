const webpack = require('webpack');

const alias = {};
try {
  const { getAliases } = require('./src/@nextgis/scripts/aliases');
  Object.assign(alias, getAliases());
  delete alias['@nextgis/cancelable-promise$'];
} catch (er) {
  // console.log(er);
}

const isProd = process.env.NODE_ENV === 'development';

module.exports = {
  webpack: {
    alias,
    plugins: {
      add: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          __BROWSER__: true,
          __DEV__: !isProd,
        }),
      ],
    },
  },
};
