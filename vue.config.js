const path = require('path')
const webpack = require('webpack')
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  // 输出文件目录
  outputDir: 'docker/release',
  // Vue-ECharts 默认在 webpack 环境下会引入未编译的源码版本
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  configureWebpack: config => {
    const plugins = []
    config.externals = Object.assign(
      {},
      IS_PROD && {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        'element-ui': 'ELEMENT'
      },
      {
        AMap: 'AMap',
        AMapUI: 'AMapUI'
      }
    )
    if (IS_PROD) {
      // gzip
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )

      //添加代码压缩工具，及设置生产环境自动删除console
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log'] //移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      less: {
        // $src可以配置图片cdn前缀
        data: `
        $src: "${process.env.VUE_APP_OSS_SRC}";
        `
      }
    }
  },
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
    // 引入babel-polyfill
    config
      .entry('index')
      .add('babel-polyfill')
      .end()
    // 移除 prefetch 插件 - 关于打包后请求数的优化点Preload and Prefetch
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    const cdn = {
      js: IS_PROD
        ? [
            '//unpkg.com/vue@2.6.10/dist/vue.min.js',
            '//unpkg.com/vue-router@3.0.6/dist/vue-router.min.js',
            '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
            '//unpkg.com/axios@0.19.0/dist/axios.min.js',
            '//unpkg.com/element-ui/lib/index.js'
          ]
        : [],
      css: ['//unpkg.com/element-ui/lib/theme-chalk/index.css']
    }
    // 添加别名
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolve('src'))
      .set('@ajax', resolve('src/plugins/axios.ts'))
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = 'none'
      return args
    })
  },
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    open: true, // 是否打开浏览器
    host: '0.0.0.0',
    port: '8085', // 代理断就
    hotOnly: true, // 热更新
    proxy: {
      '/api': {
        //本地
        // target: 'http://192.168.102.13:8080/',
        target: process.env.API,
        ws: false,
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      patterns: [resolve('src/assets/style/*.less')],
      preProcessor: 'less'
    }
  }
}
