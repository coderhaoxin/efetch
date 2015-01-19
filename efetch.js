(function() {
  'use strict';

  if (!window.fetch) {
    throw new Error('window.fetch is undefined, need the polyfill - https://github.com/github/fetch');
  }

  if (window.efetch) {
    console.warn('rewrite window.efetch');
  }

  window.efetch = function(url, options) {
    return new Request('GET', url, options);
  };

  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  methods.forEach(function(method) {
    method = method.toLowerCase();
    window.efetch[method] = function(url, options) {
      return new Request(method, url, options);
    };
  });

  function Request(method, url, options) {
    method = method.toUpperCase();
    if (typeof url !== 'string') {
      return new TypeError('invalid url');
    }
    options = this.options = options || {};
    this.url = url;
    options.method = method;
    // TODO: set all headers to lowerCase
    options.headers = options.headers || {};
    options.query = options.query || {};
  }

  /**
   * Set header
   *
   * Examples:
   *
   *   .set('Accept', 'application/json')
   *   .set({ Accept: 'application/json' })
   *
   * @param {String|Object} key
   * @param {String} value
   * @return {Request}
   */
  Request.prototype.set = function(key, value) {
    var headers = this.options.headers;
    if (typeof key === 'object') {
      for (var x in key) {
        headers[x] = key[x];
      }
    } else {
      headers[key] = value;
    }
    return this;
  };

  /**
   * Add query string
   *
   * @param {Object} object
   * @return {Request}
   */
  Request.prototype.query = function(object) {
    var query = this.options.query;

    for (var i in object) {
      query[i] = object[i];
    }

    return this;
  };

  /**
   * Send data
   *
   * Examples:
   *
   *   .send('name=hello')
   *   .send({ name: 'hello' })
   *
   * @param {String|Object} body
   * @return {Request}
   */
  Request.prototype.send = function(body) {
    var type = this.options.headers['content-type'];

    if (isObject(body) && isObject(this._body)) {
      // merge body
      for (var key in body) {
        this._body[key] = body[key];
      }
    } else if (typeof body === 'string') {
      if (!type) {
        this.options.headers['content-type'] = type = 'application/x-www-form-urlencoded';
      }

      if (type.indexOf('x-www-form-urlencoded') !== -1) {
        this._body = this._body ? this._body + '&' + body : body;
      } else {
        this._body = (this._body || '') + body;
      }
    } else {
      this._body = body;
    }

    // default to json
    if (!type) {
      this.options.headers['content-type'] = 'application/json';
    }

    return this;
  };

  Request.prototype.form = function() {
    // TODO
  };

  Request.prototype.sendFile = function() {
    // TODO
  };

  memo(Request.prototype, 'promise', function() {
    var options = this.options;
    var url = this.url;

    try {
      if (['GET', 'HEAD', 'OPTIONS'].indexOf(options.method.toUpperCase()) === -1) {
        if (isObject(this._body) && isJsonType(options['content-type'])) {
          options.body = JSON.stringify(this._body);
        } else if (isObject(this._body)) {
          options.body = stringify(this._body);
        } else {
          options.body = this._body;
        }
      }

      if (isObject(options.query)) {
        if (url.indexOf('?') >= 0) {
          url += '&' + stringify(options.query);
        } else {
          url += '?' + stringify(options.query);
        }
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return window.fetch(url, options);
  });

  Request.prototype.then = function(resolve, reject) {
    return this.promise.then(resolve, reject);
  };

  Request.prototype.catch = function(reject) {
    return this.promise.catch(reject);
  };

  function isObject(obj) {
    // not null
    return obj && typeof obj === 'object';
  }

  function isJsonType(contentType) {
    return contentType && contentType.indexOf('application/json') === 0;
  }

  function stringify(obj) {
    return Object.keys(obj).map(function(key) {
      return key + '=' + obj[key];
    }).join('&');
  }

  function memo(object, property, getter) {
    Object.defineProperty(object, property, {
      get: function() {
        this[property] = getter.call(this);
        return this[property];
      },
      set: function(val) {
        Object.defineProperty(this, property, {
          value: val,
          configurable: true,
          writable: true
        });
      },
      configurable: true,
    });
    return object;
  }
}());
