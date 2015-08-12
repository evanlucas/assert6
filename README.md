# assert6

[![Build Status](https://travis-ci.org/evanlucas/assert6.svg)](https://travis-ci.org/evanlucas/assert6)
[![Coverage Status](https://coveralls.io/repos/evanlucas/assert6/badge.svg?branch=master&service=github)](https://coveralls.io/github/evanlucas/assert6?branch=master)

Node assert with support for Maps and Sets

## Install

```bash
$ npm install [--save-dev] assert6
```

## API

`assert6` has the same api as the built-in `assert` with a few additional
methods. The main difference is that `assert.deepEqual` and
`assert.deepStrictEqual` work for Maps and Sets.

### assert.assertMap(actual, expected, message)

### assert.assertMapStrict(actual, expected, message)

### assert.assertSet(actual, expected, message)

### assert.assertSetStrict(actual, expected, message)

## Author

Evan Lucas

## License

MIT (See `LICENSE` for more info)
