const path = require("path");
module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.min.js'
    },
    optimization: {
        //minimize: false
        minimize: true
    }
}