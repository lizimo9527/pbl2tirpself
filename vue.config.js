const path = require('path')

module.exports = {
  transpileDependencies: [],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './')
      }
    }
  },
  chainWebpack: config => {
    // 配置svg-sprite-loader
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}