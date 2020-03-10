const mysql = require("mysql");
class Db {
  constructor({
    host = "127.0.0.1",
    user = "root",
    password = "root",
    database = "demo",
    port = "3306"
  } = {}) {
    this.config = {
      host,
      user,
      password,
      database,
      port
    };
    this.connection = null;
    this.connect();
  }
  //   连接操作
  connect() {
    this.connection = mysql.createConnection(this.config);
    this.connection.connect(err => {
      if (err) {
        throw err;
        // console.error("error connecting: " + err.stack);
        // return;
      }
    });
  }
  //   解决async...await异常的封装
  to(promise) {
    this.close(); //关闭连接
    return promise
      .then(rst => {
        return [null, rst];
      })
      .catch(err => {
        return [err];
      });
  }
  //   封装promise操作
  operator(sql, args) {
    let p = new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    return p;
  }
  //   通用CRUD操作方法
  async query(sql, ...args) {
    return await this.to(this.operator(sql, args));
  }
  //   关闭连接
  close() {
    this.connection.end();
  }
}

module.exports = Db;

// 测试代码
// async function test() {
//   let db = new Db();
//   let [err, rows] = await db.query("select * from ??", "user");
//   console.log(err, rows);
// }
// test();
