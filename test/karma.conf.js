module.exports = function (config) {
  config.set({
    basePath : '',
    autoWatch : true,
    frameworks: ['jasmine', 'jasmine-ajax'],
    browsers : ['PhantomJS'],
    plugins : [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-jasmine-ajax'
    ],
    files: [
      'spec/*.js',
      '../fine-forever.js',

      {
        pattern: '../*.js',
        watched: true,
        served: true,
        included: false
      }
    ],
    singleRun: true,
    reporters: ['progress'],
    colors: true
  });
};
