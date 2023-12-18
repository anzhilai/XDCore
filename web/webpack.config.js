const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const buildDone = require("./buildDone")
const webpack = require('webpack')

function time() {
  function padZero(num) {
    return num > 9 ? num : '0' + num;
  }

  const dt = new Date();
  const y = dt.getFullYear();
  const m = padZero(dt.getMonth() + 1)
  const d = padZero(dt.getDate())
  const hh = padZero(dt.getHours())
  const mm = padZero(dt.getMinutes())
  return `${y}${m}${d}.${hh}${mm}`;
}

let version = "";
// let version = "_" + time();
// console.log("version:" + version);

module.exports = (env) => {
  return {
    mode: "production",
    entry: {
      index: {
        import: "./src/index.tsx",
      },
    },
    output: {
      filename: "[name]" + version + ".js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
      libraryTarget: "umd",
      publicPath: './xdcore/',
      /* webpackChunkName: "MyFile" */
      chunkFilename: '[name]' + version + '.js'//动态import(/* webpackChunkName: "MyFile" */ )文件名   '[name].[hash:8].js'
    },
    performance: {
      maxEntrypointSize: 10000000,
      maxAssetSize: 30000000,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // eslint-disable-line @typescript-eslint/camelcase
              warnings: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      moduleIds: "deterministic",
      // splitChunks: {
      //   cacheGroups: {
      //     antd: {
      //       test: /[\\/]antd[\\/]/,
      //       name: "antd",
      //       chunks: "all",
      //     },
      //     echarts: {
      //       test: /[\\/]echarts[\\/]/,
      //       name: "echarts",
      //       chunks: "all",
      //     },
      //     tuigrid: {
      //       test(module) {
      //         // `module.resource` contains the absolute path of the file on disk.
      //         // Note the usage of `path.sep` instead of / or \, for cross-platform compatibility.
      //         return (
      //           module.resource && module.resource.includes("tui-grid")
      //           //module.resource.includes(`${path.sep}cacheable_svgs${path.sep}`)   module.resource.endsWith('.svg')
      //         );
      //       },
      //       name: "tuigrid",
      //       chunks: "all",
      //     },
      //     vendors: {
      //       test: /[\\/]node_modules[\\/]/,
      //       name: "vendors",
      //       chunks: "all",
      //       priority: -100,
      //     },
      //   },
      // },
    },
    plugins: [
      new webpack.ProvidePlugin({process: 'process/browser',}),
      new WebpackBar(),
      //new CopyWebpackPlugin({patterns: [{from: "public", to: ""},]}),
      //new BundleAnalyzerPlugin(),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: "[name]" + version + ".css",
        chunkFilename: "[id]" + version + ".css",
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
      new buildDone(version),
      // new CompressionPlugin({
      //   // gzip压缩配置
      //   test: /\.js$|\.html$|\.css/, // 匹配文件名
      //   threshold: 10240, // 对超过10kb的数据进行压缩
      //   deleteOriginalAssets: false, // 是否删除原文件
      // }),
    ],
    resolve: {
      extensions: [".tsx", ".jsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {test: /\.m?js/, resolve: {fullySpecified: false,}},
        {
          test: /\.(js|tsx|jsx)?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-typescript", {allowDeclareFields: true}],
                  "@babel/preset-env",
                  ["@babel/preset-react", {runtime: "automatic",},],
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [
            {loader: MiniCssExtractPlugin.loader, options: {publicPath: "../",},},
            "css-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
        {
          test: /\.tsx?$/,
          use: [{loader: "ts-loader",},],
          exclude: /node_modules/,
        },
      ],
    },
    externals: [
      {
        react: {
          commonjs: "react",
          commonjs2: "react",
          amd: "react",
          root: "React",
        },
        "react-dom": {
          commonjs: "react-dom",
          commonjs2: "react-dom",
          amd: "react-dom",
          root: "ReactDOM",
        },
        "react-router-dom": {
          commonjs: "react-router-dom",
          commonjs2: "react-router-dom",
          amd: "react-router-dom",
          root: "ReactRouterDom",
        },
      },
    ],
  };
};
