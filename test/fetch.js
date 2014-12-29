'use strict';

describe('## efetch', function() {
  describe('# fetch', function() {
    it('fetch should exist', function() {
      expect(typeof window.fetch).toEqual('function');
    });

    it('fetch should exist', function(done) {
      window.fetch('http://httpbin.org/headers').then(function(res) {
        expect(res.status).toEqual(200);
        expect(res.headers.get('Content-Type')).toEqual('application/json');
        return res.json();
      }).then(function(json) {
        json['Content-Type'].toEqual('application/json');
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });
});
