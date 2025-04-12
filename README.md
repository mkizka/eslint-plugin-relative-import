# @mkizka/eslint-plugin-relative-import

```js
import { foo } from "~/lib/utils";
// ↓
import { foo } from "../lib/utils";
```

## Installation

```
npm i -D @mkizka/eslint-plugin-relative-import
```

## Example

```js
// eslint.config.js
import { relativeImport } from "@mkizka/eslint-plugin-relative-import";

export default [relativeImport({ alias: { "~": "./src" } })];
```

or

```js
// eslint.config.js
import { relativeImportPlugin } from "@mkizka/eslint-plugin-relative-import";

export default [
  {
    plugins: {
      "relative-import": relativeImportPlugin,
    },
    rules: {
      "relative-import/no-path-alias": ["error", { alias: { "~": "./src" } }],
    },
  },
];
```
