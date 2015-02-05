'use strict';

var bodyParser = require('koa-bodyparser'),
  multipart = require('co-multipart'),
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
  if (this.request.is('multipart/*')) {
    var parts = yield * multipart(this);
    this.request.body = parts.field;
    parts.dispose();
  }

  this.body = {
    type: this.request.type,
    body: this.request.body,
    headers: this.header,
    method: this.method,
    query: this.query
  };
});

app.listen(3000);
