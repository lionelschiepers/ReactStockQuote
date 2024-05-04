const helmet = require('helmet')
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(helmet());
    app.use(
        '/api',
        createProxyMiddleware({
          target: 'http://localhost:7071/api',
          changeOrigin: true,
        })
      );
};