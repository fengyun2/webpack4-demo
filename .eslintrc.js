module.exports = {
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    commonjs: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'import/no-extraneous-dependencies': 0,
    semi: 0,
    'no-debugger': 0,
    'no-console': 0,
    'comma-dangle': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'linebreak-style': 0
  }
};
