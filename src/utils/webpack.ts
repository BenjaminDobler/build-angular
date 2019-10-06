
import { Configuration } from 'webpack';
import { Path } from "@angular-devkit/core";
import webpackMerge = require('webpack-merge');


export interface WebpackConfig {
  path: string;
  externals: any[];
}

export interface WebpackConfigOptions {
  webpackConfig: WebpackConfig;
}


export const buildWebpackConfig = (root: Path,
  config: WebpackConfig,
  baseWebpackConfig: Configuration,
  buildOptions: any): Configuration => {
  if (!config) {
    return baseWebpackConfig;
  }

  let externals: string[] = [];


  let customConfig: any = {};
  if (config.path) {
    customConfig = require(config.path);
  }

  if (config.externals) {
    externals = [...externals, ...config.externals];
  }

  customConfig.externals = externals;

  const newConfig = webpackMerge(baseWebpackConfig, customConfig);
  return newConfig;

}
