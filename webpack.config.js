const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

/** Webpack config */
module.exports = function(env, argv) {

    // Create config
    let config = {
        entry: path.resolve(__dirname, 'js/loader.js'),
        output: {
            filename: 'loader.js',
            chunkFilename: '[id].[contenthash].bundle.js',
            assetModuleFilename: '[name].[hash][ext][query]',
            path: path.resolve(__dirname, 'dist/plugin'),
            publicPath: 'auto'
        },
        module: {
            rules: []
        },
        plugins: []
    }

    // Support for transpiling JavaScript
    config.module.rules.push({
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
    })

    // Add support for importing static files
    config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg|mp3|glb|fbx)$/i,
        type: 'asset/resource'
    })

    // Pass sourcemap inline when in development mode
    config.devtool = argv.mode == 'development' ? 'source-map' : false

    // Done
    return config

}