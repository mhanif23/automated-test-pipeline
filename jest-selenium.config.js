module.exports = {
  testTimeout: 30000,
  reporters: [
    'default',
    ['jest-html-reporters', {
      openReport: !process.env.CI,
      publicPath: './',
      filename: 'jest_html_reporters.html'
    }]
  ]
};
