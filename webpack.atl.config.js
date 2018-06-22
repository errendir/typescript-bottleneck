//const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = env => {
  return {
    context: __dirname,
    entry: {
      "bundle": "./",
    },
    output: {
      filename: '[name].bundle.js',
      path: __dirname + "/webpack-build",
    },
    module: {
      rules: [
        {
          // Compile the .ts(x) files with typescript only (no need for babel)
          test: /\.ts$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: { configFileName: 'tsconfig.json', useBabel: true, useCache: true }
            }
          ],
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      //new CheckerPlugin()
    ]
  }
}