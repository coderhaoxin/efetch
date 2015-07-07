<!--
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
-->
[![License][license-img]][license-url]

### efetch

extend the whatwg `fetch` - [fetch spec](https://fetch.spec.whatwg.org),
makes it easier to use.

### api

* config - set options
* set() - set http header
* send() - send body data
* query() - set query string
* append() - append form data

* text() - convert response body to `string`
* json() - convert response body to `object`

### Usage

```js
let request = new Fetch({
  prefix: 'http://example.com/api/v1'
})
```

* default options

```js
{
  prefix: '',
  mode: 'cors',
  cache: 'no-cache',
  credentials: 'same-origin'
}
```

```js
request
  .get(path)
  .config({
    credentials: 'omit'
  })
  .query({
    type: 1
  })
  .query({
    name: 'hello'
  })
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })

// get json body

request
  .get(path)
  .query({
    type: 1
  })
  .send({
    name: 'hello'
  })
  .json()
  .then(function(data) {
    // response body
  })
  .catch(function(err) {
    // ...
  })

// get text body

request
  .get(path)
  .query({
    type: 1
  })
  .send({
    name: 'hello'
  })
  .text()
  .then(function(data) {
    // response body
  })
  .catch(function(err) {
    // ...
  })

// send json

request
  .post(path)
  .send({
    type: 1
  })
  .send({
    name: 'hello'
  })
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })

// send urlencoded

request
  .post(path)
  .send('type=1')
  .send('name=hello')
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })

// send urlencoded

request
  .post(path)
  .set('content-type', 'application/x-www-form-urlencoded')
  .send({
    type: 1,
    name: 'hello'
  })
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })

// set header

request
  .post(path)
  .set({
    'content-type': 'application/json'
  })
  .send({
    type: 1
  })
  .send({
    name: 'hello'
  })
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })

// send form (upload file)

request
  .post(path)
  .append({
    filename: 'user.png'
  })
  .append({
    file: document.querySelector('input[type="file"]')files[0]
  })
  .then(function(res) {
    // fetch response
  })
  .catch(function(err) {
    // ...
  })
```

### License
MIT

[travis-img]: https://img.shields.io/travis/coderhaoxin/efetch.svg?style=flat-square
[travis-url]: https://travis-ci.org/coderhaoxin/efetch
[coveralls-img]: https://img.shields.io/coveralls/coderhaoxin/efetch.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/coderhaoxin/efetch?branch=master
[license-img]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
