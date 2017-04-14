module.exports = {
	entry: './src/js/index.js',
	output: {
		path: __dirname + '/build/',
		filename: 'fast-console.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			},

			{
　　　　　　    test: /\.(png|jpg)$/,
　　　　　　	loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]'
　　　　　　}
		]
	}
}