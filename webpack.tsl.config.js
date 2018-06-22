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
              loader: 'ts-loader',
              options: { configFile: 'tsconfig.json' }
            }
          ],
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
  }
}