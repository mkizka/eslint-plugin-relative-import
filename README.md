# @mkizka/eslint-plugin-aaa

This ESLint plugin checks that `arrange`, `act`, and `assert` comments are present in test files.

```js
test("sample test", () => {
  // arrange
  setupSomething();
  // act
  const actual = testFunction();
  // assert
  expect(actual).toBe(expected);
});
```

## Installation

```
npm i -D @mkizka/eslint-plugin-aaa
```

## Example

```js
// eslint.config.js
import { arrangeActAssert } from "@mkizka/eslint-plugin-aaa";

export default [arrangeActAssert];
```

or

```js
// eslint.config.js
import { arrangeActAssertPlugin } from "@mkizka/eslint-plugin-aaa";

export default [
  {
    plugins: {
      aaa: arrangeActAssertPlugin,
    },
    rules: {
      "aaa/arrange-act-assert": "warn",
    },
  },
];
```
