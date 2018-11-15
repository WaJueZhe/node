
var express = require('express');
var path = require('path');
var indexRouter = require('./router/index');
var userRouter = require('./router/user');

var bodyParser = require("body-parser")


var app = express();//实例化对象
var jsonParser =  bodyParser.json();
//创建application / x-www-form-urlencoded解析器
var urlencodedParser =  bodyParser.urlencoded({extended:false })
//解决跨域，一定要写在最上面
app.all('*', jsonParser, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.use(express.static(path.join(__dirname, 'public')))
app.use('/public',express.static('public'))

app.use('/',indexRouter);
app.use('/user',urlencodedParser,userRouter);

// app.post('/detail',function(req,res){
//   res.send('这是后台返回的数据')
// })

app.listen(3000,function(err){
  if(err) {
    console.log('监听失败');
    throw err;
  }
  console.log('服务器开启成功，端口号为3000')
})
