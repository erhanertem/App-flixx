const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

// Load environment variables from.env file
const webpack = require('webpack');
const dotenv = require('dotenv').config({
	path: path.join(__dirname, '.env'),
});

module.exports = {
	mode: 'development',

	entry: './src/js/script.js', //Entry point
	output: {
		// Designate build folder
		path: path.resolve(__dirname, 'dist'),
		// Clean before rebuild
		clean: true,
	},

	// Declare webpack folder aliases
	resolve: {
		alias: {
			'@styles': path.resolve(__dirname, 'src/css'),
			'@images': path.resolve(__dirname, 'src/images'),
			'@scripts': path.resolve(__dirname, 'src/js'),
			'@library': path.resolve(__dirname, 'src/lib'),
			'@views': path.resolve(__dirname, 'src/views'),
			'@webfonts': path.resolve(__dirname, 'src/webfonts'),
		},
	},

	// LOADERS
	module: {
		rules: [
			// styles
			{
				test: /\.(css|sass|scss)$/,
				use: ['css-loader', 'sass-loader'],
			},
			// images
			{
				// The plugin resolves image references specified in HTML and allows Webpack to copy those images to the output directory. We can define a hashed output filename for images using the generator.filename in the rule: To optimise loading of small images we can inline images directly in the HTML using the type: 'asset' and parser.dataUrlCondition.maxSize in the rule:
				test: /\.(png|jpe?g|ico|svg)$/,
				type: 'asset',
				generator: {
					// save images to file
					filename: 'assets/img/[name].[hash:8][ext]',
				},
				parser: {
					dataUrlCondition: {
						// inline images < 2 KB
						maxSize: 2 * 1024,
					},
				},
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				include: path.resolve(__dirname, 'src/js'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(dotenv.parsed),
		}),
		new HtmlBundlerPlugin({
			// define a relative or absolute path to entry templates for
			// automatically processing templates in all subdirs
			entry: 'src/views', // => dist/index.html
			// - OR - define many templates manually
			// entry: {
			// 	// output => dist/index.html
			// 	index: 'src/views/home/index.html',
			// 	// output => dist/pages/about.html
			// 	'pages/about': 'src/views/about/index.html',
			// 	// ...
			// },
			js: {
				// output filename of compiled JavaScript
				filename: 'js/[name].[contenthash:8].js',
			},
			css: {
				// output filename of extracted CSS
				filename: 'css/[name].[contenthash:8].css',
			},
		}),
	],

	// enable HMR with live reload
	devServer: {
		static: path.resolve(__dirname, 'dist'),
		hot: true,
		watchFiles: {
			paths: ['src/**/*.*'],
			options: {
				usePolling: true,
			},
		},
	},
};
