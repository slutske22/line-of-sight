module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  plugins: ["react", "react-hooks", "prettier", "@typescript-eslint"],
  rules: {
    /** eslint rules: */
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "no-shadow": [0],
    "no-plusplus": [0],
    "no-console": [0],
    camelcase: [0],
    "lines-between-class-members": [0],
    "no-unused-vars": "off",

    /** typescript rules: */
    "@typescript-eslint/no-var-requires": [0],
    "@typescript-eslint/ban-ts-comment": [0],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-empty-function": [0],
    "@typescript-eslint/no-namespace": [0],
    "@typescript-eslint/no-unnecessary-type-constraint": [0],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    /** react rules: */
    "react/jsx-key": [1],
    "react/button-has-type": [0],
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".tsx", ".ts"] },
    ],
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": [0],
    "react/no-array-index-key": [0],
    "react/destructuring-assignment": [0],
    "react/prop-types": [0],
    "react/no-unescaped-entities": [0],

    /** import rules: */
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/prefer-default-export": [0],
    "import/named": [0],
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
          {
            pattern: "react**",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "never",
      },
    ],

    /** a11y rules: */
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/aria-role": [0],
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/href-no-hash": "off",
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/label-has-associated-control": [0],
  },
};
