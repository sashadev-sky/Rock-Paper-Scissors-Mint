/* config-overrides.js */
/* eslint-disable react-hooks/rules-of-hooks */
const { useBabelRc, override } = require('customize-cra');
const webpack = require('webpack');

module.exports = {
  ...override(useBabelRc()),
  webpack: function override(config, env) {
    // ...add your webpack config
    // don't overwrite the default cra resolve.fallback
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      fs: false,
      url: require.resolve('url'),
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      util: require.resolve('util/'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      process: require.resolve('process/browser'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
    });
    config.resolve.fallback = fallback;
    config.resolve.extensions = [
      '.ts',
      '.js',
      '.tsx',
      '.jsx',
      ...config.resolve.extensions,
    ];
    config.plugins = [
      // don't overwrite the default cra plugins
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ];
    return config;
  },
};
