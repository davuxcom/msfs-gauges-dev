const path = require('path')

module.exports = {
  src: path.resolve(__dirname, '../src'),
 // build: path.resolve(__dirname, '../../PackageSources/html_ui/my-aircraft-name'),
  build: path.resolve(__dirname, '../BUILD'),
  static: path.resolve(__dirname, '../static'),
}
