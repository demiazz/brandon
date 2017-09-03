module.exports = {
  extends: [
    "eslint-config-airbnb-base",
    "plugin:flowtype/recommended",
    "prettier",
    "prettier/flowtype"
  ],

  plugins: ["flowtype", "prettier"],

  env: {
    browser: true
  },

  rules: {
    "prettier/prettier": "error",

    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false
      }
    ],

    "no-param-reassign": "off",
    "prefer-spread": "off",
    "prefer-rest-params": "off"
  },

  parser: "babel-eslint",

  overrides: [
    {
      files: ["spec/*.js"],
      env: {
        browser: true,
        jasmine: true
      }
    }
  ]
};
