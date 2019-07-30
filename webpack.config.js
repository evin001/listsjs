const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const appDirName = 'app'
const ROOT_DIR = path.resolve(__dirname, 'app');

const config = {
  mode: isProd ? 'production' : 'development',
  entry: {
    index: ['@babel/polyfill', `./${appDirName}/index.tsx`]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
	  alias: {
      'lists-core': path.resolve(__dirname, 'core'),
      '~': ROOT_DIR
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      /* {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }, */
	    {
		    test: /\.css$/i,
		    use: ['style-loader', 'css-loader'],
	    },
      {
	      test: /\.((woff(2)?)|ttf|eot|otf)(\?[a-z0-9#=&.]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Babel + TypeScript + React = ❤️',
      template: `${appDirName}/index.html`,
    }),
  ]
};

if (!isProd) {
  config.devServer = {
    port: 3000, // https://webpack.js.org/configuration/dev-server/#devserverport
    open: true, // https://webpack.js.org/configuration/dev-server/#devserveropen
    hot: true, // https://webpack.js.org/configuration/dev-server/#devserverhot
    compress: true, // https://webpack.js.org/configuration/dev-server/#devservercompress
    stats: 'errors-only', // https://webpack.js.org/configuration/dev-server/#devserverstats-
    overlay: true // https://webpack.js.org/configuration/dev-server/#devserveroverlay
  };
}

module.exports = config;