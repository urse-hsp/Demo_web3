module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        alias: {
          '@pages': './src/pages',
        },
        root: ['./src'],
      },
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    ["import", { libraryName: "@ant-design/react-native" }]
  ]
};
