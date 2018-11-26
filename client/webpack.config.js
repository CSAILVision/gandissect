const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        // pt1:'./ts/pt1.ts',
        ganpaint:'./ts/ganpaint.ts',
        ganclient:'./ts/ganclient.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'cache-loader'
                },
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: require('os').cpus().length - 1,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true // IMPORTANT! use happyPackMode mode to speed-up  compilation and reduce errors reported to webpack
                        }
                    }
                ].slice(process.env.CI ? 2 : 0) // no optimizations for CIs
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            // publicPath: '../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]

            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit: 20000 //inline <= 10kb
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 20000, //inline <= 20kb
                    mimetype: 'application/font-woff'
                }
            },
            {
                test: /\.svg(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000, //inline <= 10kb
                    mimetype: 'image/svg+xml'
                }
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            // filename: "style.css",
            // chunkFilename: "chunk.css"
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "initial",
                    name: "vendor",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../client_dist/')
    },
    devServer: {
        port: 8090,
        proxy: {
            '/api/*': {
                target: 'http://localhost:8080',
                secure: false,
                ws: true
            }
        }
    }
};
