import { RuleTester } from "eslint";
import { describe, test, vi } from "vitest";

import { noPathAliasRule } from "./no-path-alias.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020 },
});

vi.spyOn(process, "cwd").mockReturnValue("/project");

/**
 * /project/src
 *   - /foo
 *     - /bar.ts
 *   - /lib
 *    - utils.ts
 *   - /main.ts
 */

describe("no-path-alias", () => {
  test("allow relative imports", () => {
    ruleTester.run("no-path-alias", noPathAliasRule, {
      valid: [
        {
          filename: "/project/src/main.ts",
          options: [{ alias: { "~": "./src" } }],
          code: `import { foo } from './lib/utils'`,
        },
      ],
      invalid: [],
    });
  });
  test.each`
    alias                       | filename                     | from               | resolvedFrom
    ${{ "~": "./src" }}         | ${"/project/src/main.ts"}    | ${`"~/lib/utils"`} | ${`"./lib/utils"`}
    ${{ "~": "src" }}           | ${"/project/src/main.ts"}    | ${`"~/lib/utils"`} | ${`"./lib/utils"`}
    ${{ "~/": "src" }}          | ${"/project/src/main.ts"}    | ${`"~/lib/utils"`} | ${`"./lib/utils"`}
    ${{ "~": "./src" }}         | ${"/project/src/main.ts"}    | ${`'~/lib/utils'`} | ${`'./lib/utils'`}
    ${{ "~": "./src" }}         | ${"/project/src/foo/bar.ts"} | ${`"~/lib/utils"`} | ${`"../lib/utils"`}
    ${{ "~/lib": "./src/lib" }} | ${"/project/src/main.ts"}    | ${`"~/lib/utils"`} | ${`"./lib/utils"`}
    ${{ "~/lib": "./src/lib" }} | ${"/project/src/foo/bar.ts"} | ${`"~/lib/utils"`} | ${`"../lib/utils"`}
  `(
    "resolve relative path $from to $resolvedFrom",
    ({ alias, filename, from, resolvedFrom }) => {
      ruleTester.run("no-path-alias", noPathAliasRule, {
        valid: [],
        invalid: [
          {
            filename,
            options: [{ alias }],
            code: `import { foo } from ${from}`,
            output: `import { foo } from ${resolvedFrom}`,
            errors: [{ messageId: "noPathAlias" }],
          },
        ],
      });
    },
  );
});
