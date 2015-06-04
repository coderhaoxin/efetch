'use strict'

describe('## efetch', function() {
  function keysEqual(obj, keys) {
    equal(Object.keys(obj), keys)
  }
  function equal(from, to) {
    expect(from).toEqual(to)
  }

  const jsonType = 'application/json; charset=utf-8'
  const host = 'http://localhost:3000'

  it('fetch, efetch should exist', function() {
    equal(typeof window.fetch, 'function')
    equal(typeof window.efetch, 'function')
  })

  it('invalid url', function() {
    try {
      window.efetch()
    } catch (e) {
      equal(e.message, 'invalid url')
    }
  })

  it('efetch()', function(done) {
    window.efetch(host)
      .then(function(res) {
        equal(res.status, 200)
        equal(res.headers.get('Content-Type'), jsonType)
        return res.json()
      })
      .then(function(json) {
        keysEqual(json, ['type', 'body', 'headers', 'method', 'query'])
        done()
      })
      .catch(function(err) {
        done.fail(err)
      })
  })

  describe('# query', function() {
    it('query()', function(done) {
      window
        .efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          keysEqual((json.query), ['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('query() - merge url', function(done) {
      window.efetch(host + '?name=haoxin')
        .query({
          pass: 123456
        })
        .query({
          type: 1
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          keysEqual(json.query, ['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('json()', function(done) {
      window.efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .json()
        .then(function(json) {
          keysEqual(json.query, ['name', 'pass', 'type'])
          done()
        }).catch(function(err) {
          done.fail(err)
        })
    })

    it('text()', function(done) {
      window.efetch(host)
        .query({
          name: 'haoxin',
          pass: 123456
        })
        .query({
          type: 1
        })
        .text()
        .then(function(text) {
          equal(typeof text, 'string')
          let json = JSON.parse(text)
          keysEqual(json.query, ['name', 'pass', 'type'])
          done()
        }).catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# config', function() {
    it('get cookie', function(done) {
      window.efetch(host + '/set-cookie')
        .config('credentials', 'same-origin')
        .then(function(res) {
          // note: whatever `same-origin` or not, fetch can't get header `set-cookie`
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          console.log(json)
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('put cookie', function(done) {
      window.efetch(host + '/cookie')
        .config({
          credentials: 'same-origin'
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          // note: although set credentials with `same-origin`, still can't fetch with cookie
          console.log(json)
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# send', function() {
    it('json', function(done) {
      window.efetch
        .post(host)
        .send({
          name: 'haoxin',
          pass: 123456
        })
        .send({
          type: 1
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'POST')
          equal(json.type, 'application/json')
          keysEqual(json.body, ['name', 'pass', 'type'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('urlencoded', function(done) {
      window.efetch
        .post(host)
        .send('name=haoxin')
        .send('pass=123456')
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'POST')
          equal(json.type, 'application/x-www-form-urlencoded')
          keysEqual(json.body, ['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('get should ignore body', function(done) {
      window.efetch(host)
        .send({
          name: 'haoxin',
          pass: 123456
        })
        .send({
          type: 1
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'GET')
          equal(json.type, 'application/json')
          keysEqual(json.body, [])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# set', function() {
    it('set(key, value)', function(done) {
      window.efetch
        .post(host)
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('x-efetch-test', 'hello')
        .send({
          name: 'haoxin'
        })
        .send({
          pass: 123456
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'POST')
          equal(json.type, 'application/x-www-form-urlencoded')
          equal(json.headers['x-efetch-test'], 'hello')
          keysEqual(json.body, ['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })

    it('set(obj)', function(done) {
      window.efetch
        .post(host + '/set')
        .set({
          'content-type': 'application/x-www-form-urlencoded',
          'x-efetch-test': 'hello'
        })
        .send({
          name: 'haoxin'
        })
        .send({
          pass: 123456
        })
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'POST')
          equal(json.type, 'application/x-www-form-urlencoded')
          equal(json.headers['x-efetch-test'], 'hello')
          keysEqual(json.body, ['name', 'pass'])
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })

  describe('# append', function() {
    it('append(key, value)', function(done) {
      window.efetch
        .post(host)
        .append('name', 'haoxin')
        .append('desc', new Blob(['<a>me</a>'], {
          type: 'text/html'
        }))
        .then(function(res) {
          equal(res.status, 200)
          equal(res.headers.get('Content-Type'), jsonType)
          return res.json()
        })
        .then(function(json) {
          equal(json.method, 'POST')
          equal(json.type, 'multipart/form-data')
          keysEqual(json.body, ['name'])
          equal(json.body.name, 'haoxin')
          done()
        })
        .catch(function(err) {
          done.fail(err)
        })
    })
  })
})
