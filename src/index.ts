import type { NoPathAliasRuleOptions } from "./rules/no-path-alias.js";
import { noPathAliasRule } from "./rules/no-path-alias.js";

export const relativeImportPlugin = {
  rules: {
    "no-path-alias": noPathAliasRule,
  },
};

export const relativeImport = (options: NoPathAliasRuleOptions) => ({
  plugins: {
    "@mkizka/relative-import": relativeImportPlugin,
  },
  rules: {
    "@mkizka/relative-import/no-path-alias": ["error", options],
  },
});

// for eslintrc
export const rules = relativeImportPlugin.rules;
