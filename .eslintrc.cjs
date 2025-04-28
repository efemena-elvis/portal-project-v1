module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "@vue/standard",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["off", "single"], // Turn off the quotes rule
    "comma-dangle": "off", // Ignore trailing commas
    semi: "off", // Ignore semi-colons
    "space-before-function-paren": ["error", "ignore"],
    "prettier/prettier": [
      "error",
      {
        spaceBeforeFunctionParen: false,
      },
    ],
  },
};
