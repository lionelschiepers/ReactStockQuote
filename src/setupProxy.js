const proxy = require('http-proxy-middleware');
const myProxy = proxy({
    target: 'https://www.microsoft.com/',
    changeOrigin: true,
  });
module.exports = function(app) {
    
  app.use(
    '/stockApi',
    /*
    proxy({
      target: 'https://query1.finance.yahoo.com/',
      changeOrigin: true,
    }
    */
   (req,res, next) =>
   {
       delete req.headers['Referer'];
       console.log(req);
       myProxy(req, res, next);
   }
  );

  /*
  app.use(function(req,res,next)
  {
       // console.log(req); 
       // res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Origin", "http://localhost:3000");
       

       next(); 
  });
  */
};