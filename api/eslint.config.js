import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
	{
		ignores: ["dist/", "node_modules/"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
	},
	{
		plugins: {
			unicorn: eslintPluginUnicorn,
			"unused-imports": eslintPluginUnusedImports,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"no-console": "warn",
			"@typescript-eslint/no-unused-vars": "off",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	importPlugin.flatConfigs.typescript,
	...tseslint.configs.recommended,
];
