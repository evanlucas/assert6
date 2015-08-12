'use strict'

const assert = require('assert')
const AssertionError = assert.AssertionError
const fail = assert.fail

function Assert(value, message) {
  return assert.ok(value, message)
}

module.exports = Assert

Assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual)
  }
}

Assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual)
  }
}

const keys = Object.keys(assert)
for (var i = 0, len = keys.length; i < len; i++) {
  if (!Assert.hasOwnProperty(keys[i]))
    Assert[keys[i]] = assert[keys[i]]
}

Assert.assertMap = function assertMap(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual)
  }
}

Assert.assertMapStrict = function assertMapStrict(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual)
  }
}

Assert.assertSet = function assertSet(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual)
  }
}

Assert.assertSetStrict = function assertSetStrict(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual)
  }
}

function compareMaps(a, b, strict) {
  if (a.size !== b.size)
    return false

  for (let kvs of a) {
    const key = kvs[0]
    const val = kvs[1]
    if (!b.has(key))
      return false

    if (!_deepEqual(val, b.get(key), strict))
      return false
  }

  return true
}

function compareSets(a, b) {
  if (a.size !== b.size)
    return false

  for (let item of a) {
    if (!b.has(item))
      return false
  }

  return true
}

function _deepEqual(a, b, strict) {
  const aStr = Object.prototype.toString.call(a)
  const bStr = Object.prototype.toString.call(b)
  if (aStr === '[object Map]' && bStr === '[object Map]') {
    return compareMaps(a, b, strict)
  } else if (aStr === '[object Set]' && bStr === '[object Set]') {
    return compareSets(a, b)
  }
  try {
    if (strict) {
      assert.deepStrictEqual(a, b)
    } else {
      assert.deepEqual(a, b)
    }
    return true
  }
  catch (err) {
    if (err instanceof AssertionError)
      return false

    throw err
  }
}
