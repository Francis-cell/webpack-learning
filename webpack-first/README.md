# webpack-first

## 0、参考链接

1、[webpack 配置](https://webpack.js.org/configuration/dev-server/)

2、[不可错过的 Babel7 知识](https://juejin.cn/post/6844904008679686152)

3、[更多 html-webpack-plugin 配置项]( https://github.com/jantimon/html-webpack-plugin#configuration)



## 1、构建项目

### 1、生成 package.json 文件

```bash
npm init -y
```



### 2、安装 webpack

```bash
npm install webpack webpack-cli -D
```



### 3、编辑文件

创建一个 src 文件夹，创建一个 index.js 文件，随便写入一些代码

```javascript
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getAge() {
        return this.age;
    }
    setAge(age) {
        this.age = age;
    }
}

const xiaoHei = new User("小黑", 10);
```



### 4、执行打包操作

```bash
npx webpack --mode=development
```

**<img src="https://raw.githubusercontent.com/Francis-cell/Picture/main/image-20230911211722450.png" alt="image-20230911211722450" style="zoom:80%;" />**

默认打包输出的结果在 dist/main.js 下，打开查看关键文件

```js
/***/ (() => {

eval("class User {\r\n    constructor(name, age) {\r\n        this.name = name;\r\n        this.age = age;\r\n    }\r\n    getName() {\r\n        return this.name;\r\n    }\r\n    setName(name) {\r\n        this.name = name;\r\n    }\r\n    getAge() {\r\n        return this.age;\r\n    }\r\n    setAge(age) {\r\n        this.age = age;\r\n    }\r\n}\r\n\r\nconst xiaoHei = new User(\"小黑\", 10);\n\n//# sourceURL=webpack://webpack-first/./src/index.js?");

/***/ })
```

可以看到代码没有被转成低版本的代码



### 5、将 JS 转义成低版本

借助 babel-loader，执行安装操作

```bash
npm install babel-loader -D
```

此外还需要配置 babel，安装以下依赖

```bash
npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D

npm install @babel/runtime @babel/runtime-corejs3
```



==知识点补充==：[不可错过的 Babel7 知识](https://juejin.cn/post/6844904008679686152)



### 6、新建 webpack.config.js

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除 node_modules 目录
            }
        ]
    }
}
```



### 7、配置 babel

#### 1、单独创建 .babelrc 进行 babel 的配置

```json
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": 3
            }
        ]
    ]
}
```



#### 2、webpack 下配置 babel

```js
module.exports = {
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
            }
        ]
    }
}
```



之后重新运行 `npx webpack --mode=development` 查看 dist/main.js



### 8、mode

将 mode 添加到 webpack.config.js 文件中

```js
module.exports = {
    //....
    mode: "development",
    module: {
        //...
    }
}
```

```bash
mode 配置项，告知 webpack 使用相应模式的内置优化。
mode 配置项，支持以下两个配置:
# development：将 process.env.NODE_ENV 的值设置为 development，启用 NamedChunksPlugin 和 NamedModulesPlugin
# production：将 process.env.NODE_ENV 的值设置为 production，启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin
```

现在，我们直接使用 `npx webpack` 进行编译即可。



## 2、在浏览器中查看页面

### 1、html-webpack-plugin

#### 1、html-webpack-plugin 的基本使用

安装 html-webpack-plugin 插件

```bash
npm install html-webpack-plugin -D 
```



新建 `public` 目录，并在其中新建一个 `index.html` 文件

修改 `webpack.config.js` 文件。



```js
//首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    //...
    plugins: [
        //数组 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false, //是否折叠空白
            },
            // hash: true //是否加上hash，默认是 false
        })
    ]
}
```

此时执行 `npx webpack`，可以看到 `dist` 目录下新增了 `index.html` 文件，并且其中自动插入了 `<script>` 脚本，引入的是我们打包之后的 js 文件



#### 2、config 妙用

上案例：

在 `public` 目录下新增一个 `config.js` ( 文件名你喜欢叫什么就叫什么 )，将其内容设置为:

```js
//public/config.js 除了以下的配置之外，这里面还可以有许多其他配置，例如,pulicPath 的路径等等
module.exports = {
    dev: {
        template: {
            title: '你好',
            header: false,
            footer: false
        }
    },
    build: {
        template: {
            title: '你好才怪',
            header: true,
            footer: false
        }
    }
}
```



修改 `webpack.config.js`:

```js
// 首先引入插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']

module.exports = {
    // mode: "development",
    mode: isDev ? 'development' : 'production',
    // ...
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
    ]
}
```



修改 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>
        <% if(htmlWebpackPlugin.options.config.header) { %>
            小黑
        <% } %>
    </title>
</head>
<body>
    <h3>hello</h3>
</body>
</html>
```



执行 npm run dev

**![image-20230911222734003](https://raw.githubusercontent.com/Francis-cell/Picture/main/image-20230911222734003.png)**



执行 npm run build

**![image-20230911222845895](https://raw.githubusercontent.com/Francis-cell/Picture/main/image-20230911222845895.png)**



为了兼容Windows和Mac，我们先安装一下 `cross-env`:

```bash
npm install cross-env -D
```



调整 package.json 文件中的相关配置

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack",
    "build": "cross-env NODE_ENV=production webpack"
},
```



==更多 html-webpack-plugin 配置项== https://github.com/jantimon/html-webpack-plugin#configuration



### 2、在浏览器中展示效果

安装依赖

```bash
npm install webpack-dev-server -D
```

修改 package.json 下的 scripts

```json
"scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server",
    "build": "cross-env NODE_ENV=production webpack"
},
```

在 webpack.config.js 中进行 webpack-dev-server 的其他配置（指定端口号、设置浏览器控制台信息、是否压缩等）

```js
// ...

module.exports = {
    // ...
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
    }
}
```

![image-20230911225310514](https://raw.githubusercontent.com/Francis-cell/Picture/main/image-20230911225310514.png)

overlay 启动后

**<img src="https://raw.githubusercontent.com/Francis-cell/Picture/main/17098ee5021b37bd%7Etplv-t2oaga2asx-jj-mark%3A3024%3A0%3A0%3A0%3Aq75.awebp" alt="img" style="zoom:80%;" />**



### 3、devtool

`devtool` 中的一些设置，可以帮助我们将编译后的代码映射回原始源代码。不同的值会明显影响到构建和重新构建的速度。

对我而言，能够定位到源码的行即可，因此，综合构建速度，在开发模式下，我设置的 `devtool` 的值是 `cheap-module-eval-source-map`。

```js
//webpack.config.js
module.exports = {
    devtool: 'cheap-module-eval-source-map' //开发环境下使用
}
```



## 3、样式

```txt
webpack 不能直接处理 css，需要借助 loader。如果是 .css，我们需要的 loader 通常有： style-loader、css-loader，考虑到兼容性问题，还需要 postcss-loader，而如果是 less 或者是 sass 的话，还需要 less-loader 和 sass-loader，这里配置一下 less 和 css 文件(sass 的话，使用 sass-loader即可):
```



安装依赖

```bash
npm install style-loader less-loader css-loader postcss-loader autoprefixer less -D
```

配置 webpack.config.js 

```js
//webpack.config.js
module.exports = {
    //...
    module: {
        rules: [
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
                exclude: /node_modules/
            }
        ]
    }
}
```

























