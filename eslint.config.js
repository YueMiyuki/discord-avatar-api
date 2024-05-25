const globals = require("globals");
const pluginJs = require("@eslint/js");
const prettierConfig = require("eslint-config-prettier");
const pluginPrettier = require("eslint-plugin-prettier");

module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ...pluginJs.configs.recommended,
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
];
