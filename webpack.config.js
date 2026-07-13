const { HtmlWebpackPlugin, copyPlugin, defineEnvPlugin } = require('@event-chat/micro-dev-config/plugins')
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const path = require('path');

const ROOT_CONFIG_URL = process.env.DEPLOY_BASE ?? "/micro-single-app-substrate";

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "levi";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",    // @levi/root-config
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  const isProduction = argv.p || argv.mode === "production";
  const deployBase = isProduction ? `${ROOT_CONFIG_URL}/` : "/";

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      defineEnvPlugin({ production: isProduction }, {
        APP_NAME: '@levi/root-config',
        BASE_URL: deployBase
      }),
      copyPlugin([
        {
          from: path.resolve(__dirname, 'public'),
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/index.html']
          },
        }
      ]),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          deployBase,
          orgName,
        },
      }),
    ],
  });
};
