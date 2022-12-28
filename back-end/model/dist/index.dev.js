"use strict";

var mongoose = require('mongoose');

var connect = function connect() {
  //   if (process.env.NODE_ENV !== 'production') {
  //     mongoose.set('debug', true);
  //   }
  mongoose.connect(process.env.SERVER, {
    dbName: 'mongo',
    useNewUrlParser: true,
    userCreateIndex: true
  }, function (error) {
    if (error) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결 성공');
    }
  });
};

mongoose.connection.on('error', function (error) {
  console.error('몽고디비 연결 에러', error);
});
mongoose.connection.on('disconnected', function () {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다');
  connect();
});
module.exports = connect;