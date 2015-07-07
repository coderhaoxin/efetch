'use strict'

const bodyParser = require('koa-bodyparser')
const multipart = require('co-multipart')
const koa = require('koa')

let app = koa()
app.use(bodyParser())

app.use(function*(next) {
  this.set('Access-Control-Max-Age', '60')
  this.set('Access-Control-Allow-Origin', '*')
  this.set('Access-Control-Allow-Credentials', 'true')
  this.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  this.set('Access-Control-Allow-Headers', 'Accept,Content-Type,Origin,X-Requested-With,X-Efetch-Test')
  yield next
})

app.use(function*() {
  if (this.request.is('multipart/*')) {
    var parts = yield * multipart(this)
    this.request.body = parts.field
    parts.dispose()
  }

  if (this.path.includes('set-cookie')) {
    this.cookies.set('hello', 'world')
  }

  this.body = {
    type: this.request.type,
    body: this.request.body,
    path: this.request.path,
    headers: this.header,
    method: this.method,
    query: this.query
  }
})

app.listen(3000)
