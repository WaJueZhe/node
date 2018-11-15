
var express = require('express')
var router  = express.Router();

var responseJSON = function(res,ret){
  if(typeof ret === 'undefined') {
    res.json({
      code:'-200',
      msg:'操作失败'
    })
  }else {
    res.json(ret);
  }
}

router.get('/laowang',function(req,res){
  var data = {
    code:200,
    msg:'查询成功',
    result:[{name:'老王'},{name:'老宋'}]
  };
  // 以json形式，把操作结果返回给前台页面
  responseJSON(res,data)
})

module.exports = router;//暴露出去