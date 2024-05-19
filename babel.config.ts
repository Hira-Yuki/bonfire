module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@linaria/babel-preset",
    "@babel/preset-typescript",
    "@linaria",
  ],
  plugins: ["babel-plugin-transform-dynamic-import"],
};
