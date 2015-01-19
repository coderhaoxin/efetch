'use strict';

var bodyParser = require('koa-bodyparser'),
  koa = require('koa');

var app = koa();
app.use(bodyParser());

app.use(function * (next) {
  this.set('Access-Control-Allow-Origin', '*');
  this.set('Access-Control-Allow-Credentials', 'true');
  this.set('Access-Control-Request-Method', 'GET,POST,PUT,DELETE');
  this.set('Access-Control-Allow-Headers', 'Accept,Content-Type,Origin,X-Requested-With');
  yield next;
});

app.use(function * () {
  this.body = {
    type: this.request.type,
    body: this.request.body,
    method: this.method,
    query: this.query
  };
});

app.listen(3000);
