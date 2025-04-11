import { noPathAliasRule } from "./rules/no-path-alias.js";

const relativeImportPlugin = {
  rules: {
    "no-path-alias": noPathAliasRule,
  },
};

export const arrangeActAssert = {
  plugins: {
    "relative-import": relativeImportPlugin,
  },
  rules: {
    "relative-import/no-path-alias": "error",
  },
};
