process.env.ESLINT_TSCONFIG = "tsconfig.json";

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    globals: {
        NodeJS: true,
        NodeListOf: true,
    },
    env: {
        es2022: true,
        node: true,
        browser: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "eslint-config-prettier"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "unused-imports",
        "standbard"
    ],
    rules: {
        "eol-last": "off",
        "jsx-quotes": ["warn", "prefer-double"],
        "quotes": ["warn", "double"],
        "semi": ["error", "always"],
        "no-constant-binary-expression": "warn",
        "no-debugger": "warn",
        "no-extend-native": "off",
        "no-trailing-spaces": "warn",
        "space-before-function-paren": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "unused-imports/no-unused-imports": "warn",
        "no-case-declarations": "off",
        "object-curly-newline": [
            "warn",
            {
                consistent: true,
                multiline: true,
            },
        ],
        "object-curly-spacing": ["warn", "always"],
        "array-element-newline": ["warn", "consistent"],
        "array-bracket-newline": ["warn", "consistent"],
    },
};
