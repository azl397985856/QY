const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "bin/qy-cli.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  target: "node",
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [new webpack.BannerPlugin("#!/usr/bin/env node")]
};
