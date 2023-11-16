module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "prettier",  //This config turns off formatting-related rules that might conflict with Prettier, allowing you to use Prettier with other ESLint configs like eslint-config-airbnb. https://stackoverflow.com/questions/44690308/whats-the-difference-between-prettier-eslint-eslint-plugin-prettier-and-eslint
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "standard",  //eslint-config-standard  , so put at last
    "standard-jsx", 
    "standard-react",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: '@babel/eslint-parser',
  parserOptions: { ecmaFeatures: {
    jsx: true
  } ,ecmaVersion: "latest", sourceType: "module",requireConfigFile:false },
  settings: { react: { version: "detect" } },
  plugins: ["react-refresh","react"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 0,   // if use vite , it already at root
    'react/prop-types': 'off',  //set prop can help
    'no-extra-semi': 'error',  //don't know why this is not include
  },
};
