/* mysql配置信息 */
module.exports = {
  mysql: {
      host: '127.0.0.1',  // 主机名
      user: 'root',       // 用户名
      password: '',       // 密码
      database: 'user',       // 数据库名
      port: 3306          // 端口号（默认都是3306）
  },
  upload: {
    path: process.cwd() + '/public/images'
  }
};