import type { Rule } from "eslint";
import type { ImportDeclaration } from "estree";
import path from "path";

const isObject = (obj: unknown) => {
  return typeof obj === "object" && obj !== null;
};

export type NoPathAliasRuleOptions = {
  alias: Record<string, string>;
};

const parseOptions = (options: unknown[]): NoPathAliasRuleOptions => {
  if (!isObject(options[0])) {
    throw new Error("Invalid options format");
  }
  if (!("alias" in options[0])) {
    throw new Error("Missing alias in options");
  }
  if (!isObject(options[0].alias)) {
    throw new Error("Alias should be an object");
  }
  return { alias: options[0].alias as Record<string, string> };
};

const isUsingAlias = (
  importPath: string,
  alias: NoPathAliasRuleOptions["alias"],
) => {
  return Object.keys(alias).some((aliasKey) => importPath.startsWith(aliasKey));
};

const normalizeAlias = (alias: NoPathAliasRuleOptions["alias"]) => {
  return Object.fromEntries(
    Object.entries(alias).map(([key, value]) => {
      const newKey = key.replace(/\/\*$/, "");
      return [newKey, value.replace(/\/\*$/, "")];
    }),
  );
};

const resolveRelativePath = ({
  filename,
  aliasImportPath,
  alias,
}: {
  filename: string;
  aliasImportPath: string;
  alias: NoPathAliasRuleOptions["alias"];
}) => {
  const aliasKey = Object.keys(alias).find((key) =>
    aliasImportPath.startsWith(key),
  );
  if (!aliasKey) {
    return aliasImportPath;
  }
  const aliasPath = alias[aliasKey];
  const relativePath = path.relative(
    path.dirname(filename),
    path.join(aliasPath, aliasImportPath.slice(aliasKey.length)),
  );
  return relativePath.startsWith(".") ? relativePath : `./${relativePath}`;
};

export const noPathAliasRule: Rule.RuleModule = {
  meta: {
    type: "problem",
    fixable: "code",
    messages: {
      noPathAlias:
        "Do not use path alias '{{alias}}'. Use relative path instead.",
    },
    schema: [
      {
        type: "object",
        properties: {
          alias: { type: "object" },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = parseOptions(context.options);
    const normalizedAlias = normalizeAlias(options.alias);
    return {
      ImportDeclaration(node: ImportDeclaration) {
        const importPath = node.source.value as string;
        if (!isUsingAlias(importPath, normalizedAlias)) {
          return;
        }
        const relativePath = resolveRelativePath({
          filename: context.filename,
          aliasImportPath: importPath,
          alias: normalizedAlias,
        });
        context.report({
          node: node.source,
          messageId: "noPathAlias",
          data: { alias: importPath },
          fix: (fixer) => {
            if (!node.source.range) {
              throw new Error("node.source.range is undefined");
            }
            const from = node.source.range[0] + 1;
            const to = node.source.range[1] - 1;
            return fixer.replaceTextRange([from, to], relativePath);
          },
        });
      },
    };
  },
};
