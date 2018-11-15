
var express = require('express')
var fs = require('fs')
var router  = express.Router()

var mysql = require('mysql')//引入数据库
var dbconfig = require('../module/mysqlConnet')//引入配置文件
var uuid = require('node-uuid');
var multer = require('multer');

// 图片裁截base64上传请求处理
router.post('/upload/img', function (req, res) {
  // 读取上传的图片信息
  var imgSrc = req.body.image;
  //过滤图片url
  let base64 = imgSrc.replace(/^data:image\/\w+;base64,/, '')
  //把图片转换成buffer对象
  let dataBuffer = new Buffer(base64, 'base64')
  //图片生成随机数名字
  let imgId = uuid.v1();
  //保存图片的地址是
  let path = 'public/img/' + imgId +'.jpg'
  //保存图片
  fs.writeFile(path,dataBuffer,(err) => {
    if(err) {
        console.log(err)
    }else {
      console.log('保存图片成功')
    }
    var result = {
      code:200,
      imgUrl:'http://localhost:3000/' + path
    }
    res.send(result);
  })
});

var storage = multer.diskStorage({
  //设置上传文件路径,以后可以扩展成上传文件服务器等等
  //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
  destination: dbconfig.upload.path,
  //给上传文件重命名
  filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      cb(null, uuid.v4() + "." + fileFormat[fileFormat.length - 1]);
  }
});

//添加配置文件到muler对象。
var upload = multer({
  storage: storage
});

//图片上传
router.post('/upload/image',upload.single('imgfile'),function(req,res){
  if (req.file) {
    var path = '/images/'+req.file['filename'];
    res.json({state:"success",path:path});
    console.log(req.file);
  }
})

//创建mysql连接池
var pool = mysql.createPool(dbconfig.mysql)

var responseJSON = function (res, ret) {
  if(typeof ret === 'undefined') {
      res.json({
        code:'-200',
        msg: '操作失败'
      });
  } else {
      res.json(ret);
  }
};

router.post('/list',function (req, res) {
  pool.getConnection(function(err,connection){
    var param = req.body;
    var total = (param.page - 1) * param.count;
    var count = param.count * 1;
    var searchData = param.searchData.searchKey;
    //建立连接
    var sql = null;
    var data = null;
    if(searchData === '' || searchData === 'undefined') {
      sql = 'SELECT * FROM `tabuser` LIMIT ?, ?';
      data = [total,count]
    }else {
      sql = 'SELECT * FROM `tabuser` WHERE age = ? LIMIT ?, ?'
      data = [searchData,total,count]
    }

    connection.query(sql,data,function(err,rows,fields){
      var querryRows = rows;//返回的数据
      var size = count;//每页多少条数据
      connection.query('SELECT count(*) as rowsCount FROM `tabuser`',function(counterr,countrows) {
        var querryCount = countrows[0].rowsCount;//总共多少条数据
        var result = {
          code:200,
          msg:'查询成功',
          data:querryRows,
          size:size,//每页多少条数据
          count:querryCount,//总共多少条数据
          total:querryCount % count == 0 ? querryCount/count : parseInt(querryCount/count) + 1//有多少页
        }
        // 以json形式，把操作结果返回给前台页面
        responseJSON(res, result);
        //释放连接
        connection.release();
      })
    })
  })
});

router.post('/delete',function(req,res){
  pool.getConnection(function(err,connection){
    var param = req.body;
    var id = param.id;
    connection.query('DELETE FROM `tabuser` WHERE id = ?',[id],function(err,rows,fields){
      var result = {
        code:200,
        msg:'删除成功',
      }
      // 以json形式，把操作结果返回给前台页面
      responseJSON(res, result);
      //释放连接
      connection.release();
    })
  })
})

module.exports = router;