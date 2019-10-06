import { BuilderContext, BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { ExecutionTransformer, executeDevServerBuilder, DevServerBuilderOptions } from "@angular-devkit/build-angular";
import { json, normalize } from "@angular-devkit/core";
import { Observable } from "rxjs";
import { Configuration } from 'webpack';
import { WebpackConfigOptions, buildWebpackConfig } from "../../utils/webpack";



export type ExtendedDevServerBuilderOptions = DevServerBuilderOptions & WebpackConfigOptions;


export function buildWebpackBrowser(options: ExtendedDevServerBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
  return executeDevServerBuilder(options as any, context, getTransforms(options, context));
}

export const getTransforms = (options: ExtendedDevServerBuilderOptions, context: BuilderContext) => ({
  webpackConfiguration: customWebpackConfigTransformFactory(options, context)
})


export const customWebpackConfigTransformFactory:
  (options: ExtendedDevServerBuilderOptions, context: BuilderContext) => ExecutionTransformer<Configuration> =
  (options, { workspaceRoot }) => (browserWebpackConfig) => {
    return buildWebpackConfig(
      normalize(workspaceRoot),
      options.webpackConfig,
      browserWebpackConfig,
      options //TODO: pass Target options as well (configuration option in particular)
    );
  }


export default createBuilder<json.JsonObject & ExtendedDevServerBuilderOptions>(buildWebpackBrowser);
