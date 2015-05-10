'use strict'

module.exports = function(config) {
  config.set({
    basePath: '..',

    files: [
      'efetch.js',
      'test/efetch.js'
    ],

    preprocessors: {
      'efetch.js': 'coverage'
    },

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher'
    ],

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'coverage'
    },

    log: 'debug'
  })
}
