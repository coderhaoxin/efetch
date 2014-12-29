(function() {
  'use strict';

  if (!window.fetch) {
    throw new Error('window.fetch is undefined, need the polyfill - https://github.com/github/fetch');
  }

  if (!window.efetch) {
    window.efetch = efetch;
  }

  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function efetch(url, options) {

  }
}());
