module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    public: 'mc.raiix.com:8082',
    watchOptions: {
      ignored: /node_modules/
    }
  }
}