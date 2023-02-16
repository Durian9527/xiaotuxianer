const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = defineConfig({
  // 设置外部扩展，导入qc后将不做打包
  configureWebpack: {
    externals: {
      // 模块名: 全局变量名
      qc: 'QC'
    },
    plugins: [
      new BundleAnalyzerPlugin()
    ]
  },
  // 开启IP域名访问权限
  devServer: {
    // disableHostCheck: true
    allowedHosts: ['www.corho.com'] // www.corho.com=>扫码授权后的回调地址
  },
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/style/variables.less'),
        path.join(__dirname, './src/assets/style/mixins.less')
      ]
    },
    chainWebpack: config => {
      // 图片加载
      config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 10000 }))
      // 开启IP域名访问权限
      // config.devServer.disableHostCheck(true)
    }
  }
})
