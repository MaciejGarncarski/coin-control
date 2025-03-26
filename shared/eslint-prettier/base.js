// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["public/*", "**/types.ts", "dist/*"],
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-console": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  }
);
