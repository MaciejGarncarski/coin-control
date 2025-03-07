import baseConfig from "./base.js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import testingLibrary from "eslint-plugin-testing-library";

export default [
  ...baseConfig,
  ...pluginRouter.configs["flat/recommended"],
  ...pluginQuery.configs["flat/recommended"],
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "testing-library": testingLibrary,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react/prop-types": 0,
    },
  },
];
