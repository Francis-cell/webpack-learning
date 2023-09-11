// 首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
    // mode: "development",
    mode: isDev ? 'development' : 'production',
    module: {
        rules: [
            {
                // 匹配规则
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                // 排除 node-modules 目录
                exclude: /node-modules/
            },
            // 样式处理规则
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                }, 'less-loader'],
                // 排除 node-modules 目录
                exclude: /node-modules/
            }
        ]
    },
    // 数组，放置着所有的 webpack 插件
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            // 打包后生成的文件名
            filename: 'index.html',
            minify: {
                // 是否删除属性的双引号
                removeAttributeQuotes: false,
                // 是否折叠空白
                collapseWhitespace: false
            },
            // 是否加上 hash，默认是 false
            // hash: true,
            config: config.template
        })
    ],
    devServer: {
        // 默认是 8080
        port: '3000',
        // 默认不启用（一旦启用，webpack 的错误或者警告将不会在控制台展示）
        // quiet: false, // [不存在了]
        // // 默认开启 inline 模式，如果设置为 false，开启 iframe 模式
        // inline: false, // [不存在了]
        // 终端仅打印 error
        // stats: 'errors-only',   // [不存在了]
        // 默认不启用，启用之后出现错误将会有全屏的错误展示
        // overlay: true, // [不存在了]
        // 日志等级（当使用内联模式时，在浏览器的控制台将显示消息，如：在重新加载之前，在一个错误之前，或者模块热替换启用时。如果你不喜欢看这些信息，可以将其设置为 silent）
        // clientLogLevel: 'silent',  // [不存在了]
        // 是否启用 gzip 压缩
        compress: true
    },
    // 开发环境下使用
    devtool: 'cheap-module-source-map'
}