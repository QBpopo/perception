import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import oxlint from "eslint-plugin-oxlint";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
	oxlint.configs["flat/all"],
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
		...stylistic.configs.recommended,
	},
	{
		files: ["**/*.{ts,mts,cts}"],
		languageOptions: { parser: tseslint.parser },
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
		plugins: { "@stylistic": stylistic },
		rules: {
			"@stylistic/arrow-parens": ["warn", "as-needed"],
			"@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true }],
			"@stylistic/comma-dangle": ["warn", "always-multiline"], // override recommended
			"@stylistic/dot-location": ["warn", "property"],
			"@stylistic/eol-last": ["warn", "always"],
			"@stylistic/generator-star-spacing": ["warn", "after"],
			"@stylistic/indent": ["warn", "tab", { flatTernaryExpressions: true }], // override recommended
			"@stylistic/indent-binary-ops": ["warn", "tab"], // override recommended
			"@stylistic/max-len": "off",
			"@stylistic/member-delimiter-style": [
				"warn", { multiline: { delimiter: "semi", requireLast: true } },
			],
			"@stylistic/multiline-ternary": ["warn", "always-multiline"],
			"@stylistic/no-extra-parens": ["warn", "all", { nestedBinaryExpressions: false }],
			"@stylistic/no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
			"@stylistic/no-multiple-empty-lines": ["error", {
				max: 1, maxBOF: 1, maxEOF: 1,
			}],
			"@stylistic/no-tabs": ["off", { allowIndentationTabs: true }],
			"@stylistic/nonblock-statement-body-position": ["warn", "beside"],
			"@stylistic/object-curly-spacing": ["warn", "always"],
			"@stylistic/object-property-newline": ["warn", { allowAllPropertiesOnSameLine: true }],
			"@stylistic/one-var-declaration-per-line": ["warn", "initializations"],
			"@stylistic/operator-linebreak": ["warn", "before", { overrides: { "?": "after" } }],
			"@stylistic/padded-blocks": ["warn", "never"],
			"@stylistic/quote-props": ["warn", "consistent-as-needed"], // override recommended
			"@stylistic/quotes": ["warn", "double", { avoidEscape: true }], // override recommended
			"@stylistic/rest-spread-spacing": ["warn", "never"],
			"@stylistic/semi": ["warn", "always"], // override recommended
			"@stylistic/semi-spacing": ["warn", { before: false, after: true }], // override recommended
			"@stylistic/semi-style": ["warn", "last"], // override recommended
			"@stylistic/space-before-blocks": ["warn", "always"],
			"@stylistic/space-before-function-paren": [
				"warn", {
					anonymous: "never", named: "never", asyncArrow: "always", catch: "always",
				},
			],
			"@stylistic/space-in-parens": ["warn", "never"],
			"@stylistic/switch-colon-spacing": ["warn", { after: true, before: false }],
			"@stylistic/template-curly-spacing": ["warn", "never"],
			"@stylistic/template-tag-spacing": ["warn", "never"],
			"@stylistic/wrap-iife": ["warn", "inside", { functionPrototypeMethods: true }],
			"@stylistic/wrap-regex": "off",
			"@stylistic/yield-star-spacing": ["warn", "after"],
		},
	},
]);
