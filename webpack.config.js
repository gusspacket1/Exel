const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]
  if (isDev) {
    loaders.push("eslint-loader")
  }
  return loaders
}

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    devServer: {
      compress: true,
      hot: isDev,
      port: 3000,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    },
    devtool: isDev ? "source-map": false,
    entry: ["@babel/polyfill", "./index.js"],
    mode: 'development',
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
          {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      }
        ],
      },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "favicon.ico"),
                    to: path.resolve(__dirname, "dist")
                },
            ],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename("css")
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src"),
            '@core': path.resolve(__dirname, "src", "core"),
        },
        extensions: ['.js']
    }
}