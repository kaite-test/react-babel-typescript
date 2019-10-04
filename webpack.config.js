const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const PATHS = {
  dist: path.join(__dirname, 'dist'),
  src: path.join(__dirname, 'src')
};
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index',
    output: {
      path: PATHS.dist,
      filename: 'bundle.[hash].js'
    },
    devtool: isDev ? 'inline-source-map' : 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre'
        },
        {
          test: /\.(tsx|jsx|ts)?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/proposal-class-properties',
                '@babel/proposal-object-rest-spread',
                'react-hot-loader/babel'
              ]
            }
          }
        },
        {
          test: /\.(sc|c|sa)ss$/,
          use: [
            MiniCSSExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({ grid: true }),
                  require('postcss-flexbugs-fixes')
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
          loader: 'url-loader',
          options: {
            limit: 5000,
            name: '[name].[ext]',
            outputPath: 'assets/images',
            publicPath: '../assets/images'
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new MiniCSSExtractPlugin({
        filename: 'css/style.css',
        publicPath: '../'
      }),
      //   new CleanWebpackPlugin(),
      new PurgecssPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
      }),
      new ImageminPlugin({
        disable: isDev,
        pngquant: {
          quality: '65-80'
        },
        plugins: [
          ImageminMozjpeg({
            quality: 80
          })
        ]
      }),
      new CaseSensitivePathsPlugin(),
      new WatchMissingNodeModulesPlugin(path.resolve('node_modules'))
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: '6',
            compress: {
              drop_console: true
            }
          }
        }),
        new OptimizeCSSAssetsPlugin()
      ]
    },
    devServer: {
      open: true,
      contentBase: 'dist',
      hot: true,
      historyApiFallback: true,
      stats: {
        children: false,
        maxModules: 0
      }
    }
  };
};
