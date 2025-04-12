import type { NoPathAliasRuleOptions } from "./rules/no-path-alias.js";
import { noPathAliasRule } from "./rules/no-path-alias.js";

export const relativeImportPlugin = {
  rules: {
    "no-path-alias": noPathAliasRule,
  },
};

export const relativeImport = (options: NoPathAliasRuleOptions) => ({
  plugins: {
    "relative-import": relativeImportPlugin,
  },
  rules: {
    "relative-import/no-path-alias": ["error", options],
  },
});
