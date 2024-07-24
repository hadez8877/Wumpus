import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  {
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      eqeqeq: "error",
      "no-var": "off",
      "prefer-const": "off",
      "no-unreachable": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off"
    },
  },
  ...tseslint.configs.recommended,
];
