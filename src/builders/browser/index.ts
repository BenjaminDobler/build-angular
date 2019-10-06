import { BuilderContext, BuilderOutput, createBuilder } from "@angular-devkit/architect";
import { executeBrowserBuilder, ExecutionTransformer } from "@angular-devkit/build-angular";
import { json, normalize } from "@angular-devkit/core";
import { BrowserBuilderOptions } from "@schematics/angular/utility/workspace-models";
import { Observable } from "rxjs";
import { Configuration } from 'webpack';
import { buildWebpackConfig, WebpackConfigOptions } from "../../utils/webpack";


export type ExtendedBrowserBuilderOptions = BrowserBuilderOptions & WebpackConfigOptions;


export function buildWebpackBrowser(options: ExtendedBrowserBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
  return executeBrowserBuilder(options as any, context, getTransforms(options, context));
}

export const getTransforms = (options: ExtendedBrowserBuilderOptions, context: BuilderContext) => ({
  webpackConfiguration: customWebpackConfigTransformFactory(options, context)
})


export const customWebpackConfigTransformFactory:
  (options: ExtendedBrowserBuilderOptions, context: BuilderContext) => ExecutionTransformer<Configuration> =
  (options, { workspaceRoot }) => (browserWebpackConfig) => {
    return buildWebpackConfig(
      normalize(workspaceRoot),
      options.webpackConfig,
      browserWebpackConfig,
      options //TODO: pass Target options as well (configuration option in particular)
    );
  }




export default createBuilder<json.JsonObject & ExtendedBrowserBuilderOptions>(buildWebpackBrowser);
