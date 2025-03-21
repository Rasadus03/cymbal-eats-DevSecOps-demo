const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    fs: require.resolve('graceful-fs'),
    buffer: require.resolve("buffer"),
    crypto: false, // require.resolve("crypto-browserify") can be polyfilled here if needed
    stream: require.resolve('stream-browserify'),
    assert: false, // require.resolve("assert") can be polyfilled here if needed
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: false, // require.resolve("os-browserify") can be polyfilled here if needed
    url: require.resolve('url'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    util: require.resolve("util/"),
    process: require.resolve("process/browser"),
    events: false,
    net: false,
    child_process: false,
    processor:false,
    constants: require.resolve("constants-browserify"),
  })
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        case "stream":
          resource.request = "readable-stream";
          break;
        case "util":
          resource.request = "util";
          break;
        case "process":
          resource.request = "process";
          break;
        case "events":
          resource.request = "events";
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    })
  ]);

  return config;
}