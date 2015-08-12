'use strict'

const test = require('tap').test
const a = require('../')

function makeBlock(f) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    return f.apply(this, args)
  }
}


test('basic assertions', function(t) {
  t.throws(makeBlock(a, false), a.AssertionError)

  t.doesNotThrow(makeBlock(a, true))

  t.doesNotThrow(makeBlock(a, 'test', 'ok(\'test\')'))

  t.throws(makeBlock(a.ok, false), a.AssertionError)

  t.doesNotThrow(makeBlock(a.ok, true))

  t.doesNotThrow(makeBlock(a.ok, 'test'), 'ok(\'test\')')

  t.throws(makeBlock(a.equal, true, false))

  t.doesNotThrow(makeBlock(a.equal, null, null), 'equal')

  t.doesNotThrow(makeBlock(a.equal, undefined, undefined), 'equal')

  t.doesNotThrow(makeBlock(a.equal, null, undefined), 'equal')

  t.doesNotThrow(makeBlock(a.equal, true, true), 'equal')

  t.doesNotThrow(makeBlock(a.equal, 2, '2'), 'equal')

  t.doesNotThrow(makeBlock(a.notEqual, true, false), 'notEqual')

  t.throws(makeBlock(a.notEqual, true, true),
                a.AssertionError, 'notEqual')

  t.throws(makeBlock(a.strictEqual, 2, '2'),
                a.AssertionError, 'strictEqual')

  t.throws(makeBlock(a.strictEqual, null, undefined),
                a.AssertionError, 'strictEqual')

  t.doesNotThrow(makeBlock(a.notStrictEqual, 2, '2'), 'notStrictEqual')

  // deepEquals joy!
  // 7.2
  t.doesNotThrow(makeBlock(a.deepEqual, new Date(2000, 3, 14),
                      new Date(2000, 3, 14)), 'deepEqual date')

  t.throws(makeBlock(a.deepEqual, new Date(), new Date(2000, 3, 14)),
                a.AssertionError,
                'deepEqual date')

  // 7.3
  t.doesNotThrow(makeBlock(a.deepEqual, /a/, /a/))
  t.doesNotThrow(makeBlock(a.deepEqual, /a/g, /a/g))
  t.doesNotThrow(makeBlock(a.deepEqual, /a/i, /a/i))
  t.doesNotThrow(makeBlock(a.deepEqual, /a/m, /a/m))
  t.doesNotThrow(makeBlock(a.deepEqual, /a/igm, /a/igm))
  t.throws(makeBlock(a.deepEqual, /ab/, /a/))
  t.throws(makeBlock(a.deepEqual, /a/g, /a/))
  t.throws(makeBlock(a.deepEqual, /a/i, /a/))
  t.throws(makeBlock(a.deepEqual, /a/m, /a/))
  t.throws(makeBlock(a.deepEqual, /a/igm, /a/im))

  var re1 = /a/
  re1.lastIndex = 3
  t.throws(makeBlock(a.deepEqual, re1, /a/))


  // 7.4
  t.doesNotThrow(makeBlock(a.deepEqual, 4, '4'), 'deepEqual == check')
  t.doesNotThrow(makeBlock(a.deepEqual, true, 1), 'deepEqual == check')
  t.throws(makeBlock(a.deepEqual, 4, '5'),
                a.AssertionError,
                'deepEqual == check')

  // 7.5
  // having the same number of owned properties && the same set of keys
  t.doesNotThrow(makeBlock(a.deepEqual, {a: 4}, {a: 4}))
  t.doesNotThrow(makeBlock(a.deepEqual, {a: 4, b: '2'}, {a: 4, b: '2'}))
  t.doesNotThrow(makeBlock(a.deepEqual, [4], ['4']))
  t.throws(makeBlock(a.deepEqual, {a: 4}, {a: 4, b: true}),
                a.AssertionError)
  t.doesNotThrow(makeBlock(a.deepEqual, ['a'], {0: 'a'}))
  //(although not necessarily the same order),
  t.doesNotThrow(makeBlock(a.deepEqual, {a: 4, b: '1'}, {b: '1', a: 4}))
  var a1 = [1, 2, 3]
  var a2 = [1, 2, 3]
  a1.a = 'test'
  a1.b = true
  a2.b = true
  a2.a = 'test'
  t.throws(makeBlock(a.deepEqual, Object.keys(a1), Object.keys(a2)),
                a.AssertionError)
  t.doesNotThrow(makeBlock(a.deepEqual, a1, a2))

  // having an identical prototype property
  var nbRoot = {
    toString: function() { return this.first + ' ' + this.last; }
  }

  function nameBuilder(first, last) {
    this.first = first
    this.last = last
    return this
  }
  nameBuilder.prototype = nbRoot

  function nameBuilder2(first, last) {
    this.first = first
    this.last = last
    return this
  }
  nameBuilder2.prototype = nbRoot

  var nb1 = new nameBuilder('Ryan', 'Dahl')
  var nb2 = new nameBuilder2('Ryan', 'Dahl')

  t.doesNotThrow(makeBlock(a.deepEqual, nb1, nb2))

  nameBuilder2.prototype = Object
  nb2 = new nameBuilder2('Ryan', 'Dahl')
  t.doesNotThrow(makeBlock(a.deepEqual, nb1, nb2))

  // primitives and object
  t.throws(makeBlock(a.deepEqual, null, {}), a.AssertionError)
  t.throws(makeBlock(a.deepEqual, undefined, {}), a.AssertionError)
  t.throws(makeBlock(a.deepEqual, 'a', ['a']), a.AssertionError)
  t.throws(makeBlock(a.deepEqual, 'a', {0: 'a'}), a.AssertionError)
  t.throws(makeBlock(a.deepEqual, 1, {}), a.AssertionError)
  t.throws(makeBlock(a.deepEqual, true, {}), a.AssertionError)
  if (typeof Symbol === 'symbol') {
    t.throws(makeBlock(t.deepEqual, Symbol(), {}), a.AssertionError)
  }

  // primitive wrappers and object
  t.doesNotThrow(makeBlock(a.deepEqual, new String('a'), ['a']),
                      a.AssertionError)
  t.doesNotThrow(makeBlock(a.deepEqual, new String('a'), {0: 'a'}),
                      a.AssertionError)
  t.doesNotThrow(makeBlock(a.deepEqual, new Number(1), {}),
                      a.AssertionError)
  t.doesNotThrow(makeBlock(a.deepEqual, new Boolean(true), {}),
                      a.AssertionError)

  //deepStrictEqual
  t.doesNotThrow(makeBlock(a.deepStrictEqual, new Date(2000, 3, 14),
                      new Date(2000, 3, 14)), 'deepStrictEqual date')

  t.throws(makeBlock(a.deepStrictEqual, new Date(), new Date(2000, 3, 14)),
                a.AssertionError,
                'deepStrictEqual date')

  // 7.3 - strict
  t.doesNotThrow(makeBlock(a.deepStrictEqual, /a/, /a/))
  t.doesNotThrow(makeBlock(a.deepStrictEqual, /a/g, /a/g))
  t.doesNotThrow(makeBlock(a.deepStrictEqual, /a/i, /a/i))
  t.doesNotThrow(makeBlock(a.deepStrictEqual, /a/m, /a/m))
  t.doesNotThrow(makeBlock(a.deepStrictEqual, /a/igm, /a/igm))
  t.throws(makeBlock(a.deepStrictEqual, /ab/, /a/))
  t.throws(makeBlock(a.deepStrictEqual, /a/g, /a/))
  t.throws(makeBlock(a.deepStrictEqual, /a/i, /a/))
  t.throws(makeBlock(a.deepStrictEqual, /a/m, /a/))
  t.throws(makeBlock(a.deepStrictEqual, /a/igm, /a/im))

  var re1 = /a/
  re1.lastIndex = 3
  t.throws(makeBlock(a.deepStrictEqual, re1, /a/))


  // 7.4 - strict
  t.throws(makeBlock(a.deepStrictEqual, 4, '4'),
                a.AssertionError,
                'deepStrictEqual === check')

  t.throws(makeBlock(a.deepStrictEqual, true, 1),
                a.AssertionError,
                'deepStrictEqual === check')

  t.throws(makeBlock(a.deepStrictEqual, 4, '5'),
                a.AssertionError,
                'deepStrictEqual === check')

  // 7.5 - strict
  // having the same number of owned properties && the same set of keys
  t.doesNotThrow(makeBlock(a.deepStrictEqual, {a: 4}, {a: 4}))
  t.doesNotThrow(makeBlock(a.deepStrictEqual,
                                {a: 4, b: '2'},
                                {a: 4, b: '2'}))
  t.throws(makeBlock(a.deepStrictEqual, [4], ['4']))
  t.throws(makeBlock(a.deepStrictEqual, {a: 4}, {a: 4, b: true}),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, ['a'], {0: 'a'}))
  //(although not necessarily the same order),
  t.doesNotThrow(makeBlock(a.deepStrictEqual,
                                {a: 4, b: '1'},
                                {b: '1', a: 4}))

  t.throws(makeBlock(a.deepStrictEqual,
                          [0, 1, 2, 'a', 'b'],
                          [0, 1, 2, 'b', 'a']),
                a.AssertionError)

  t.doesNotThrow(makeBlock(a.deepStrictEqual, a1, a2))

  // Prototype check
  function Constructor1(first, last) {
    this.first = first
    this.last = last
  }

  function Constructor2(first, last) {
    this.first = first
    this.last = last
  }

  var obj1 = new Constructor1('Ryan', 'Dahl')
  var obj2 = new Constructor2('Ryan', 'Dahl')

  t.throws(makeBlock(a.deepStrictEqual, obj1, obj2), a.AssertionError)

  Constructor2.prototype = Constructor1.prototype
  obj2 = new Constructor2('Ryan', 'Dahl')

  t.doesNotThrow(makeBlock(a.deepStrictEqual, obj1, obj2))

  // primitives
  t.throws(makeBlock(a.deepStrictEqual, 4, '4'),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, true, 1),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, Symbol(), Symbol()),
                a.AssertionError)

  var s = Symbol()
  t.doesNotThrow(makeBlock(a.deepStrictEqual, s, s))


  // primitives and object
  t.throws(makeBlock(a.deepStrictEqual, null, {}), a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, undefined, {}), a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, 'a', ['a']), a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, 'a', {0: 'a'}), a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, 1, {}), a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, true, {}), a.AssertionError)
  t.throws(makeBlock(t.deepStrictEqual, Symbol(), {}),
                a.AssertionError)


  // primitive wrappers and object
  t.throws(makeBlock(a.deepStrictEqual, new String('a'), ['a']),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, new String('a'), {0: 'a'}),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, new Number(1), {}),
                a.AssertionError)
  t.throws(makeBlock(a.deepStrictEqual, new Boolean(true), {}),
                a.AssertionError)


  // Testing the throwing
  function thrower(errorConstructor) {
    throw new errorConstructor('test')
  }
  var aethrow = makeBlock(thrower, a.AssertionError)
  aethrow = makeBlock(thrower, a.AssertionError)

  // the basic calls work
  t.throws(makeBlock(thrower, a.AssertionError),
                a.AssertionError, 'message')
  t.throws(makeBlock(thrower, a.AssertionError), a.AssertionError)
  t.throws(makeBlock(thrower, a.AssertionError))

  // if not passing an error, catch all.
  t.throws(makeBlock(thrower, TypeError))

  // when passing a type, only catch errors of the appropriate type
  var threw = false
  try {
    a.throws(makeBlock(thrower, TypeError), a.AssertionError)
  } catch (e) {
    threw = true
    t.ok(e instanceof TypeError, 'type')
  }
  t.equal(true, threw,
               'a.throws with an explicit error is eating extra errors')
  threw = false

  // doesNotThrow should pass through all errors
  try {
    a.doesNotThrow(makeBlock(thrower, TypeError), a.AssertionError)
  } catch (e) {
    threw = true
    t.ok(e instanceof TypeError)
  }
  t.equal(true, threw,
               'a.doesNotThrow with an explicit error is eating extra errors')

  // key difference is that throwing our correct error makes an assertion error
  try {
    a.doesNotThrow(makeBlock(thrower, TypeError), TypeError)
  } catch (e) {
    threw = true
    t.ok(e instanceof a.AssertionError)
  }
  t.equal(true, threw,
               'a.doesNotThrow is not catching type matching errors')

  t.throws(function() {a.ifError(new Error('test error'));})
  t.doesNotThrow(function() {a.ifError(null);})
  t.doesNotThrow(function() {a.ifError();})

  // make sure that validating using constructor really works
  threw = false
  try {
    a.throws(
        function() {
          throw ({})
        },
        Array
    )
  } catch (e) {
    threw = true
  }
  t.ok(threw, 'wrong constructor validation')

  // use a RegExp to validate error message
  t.throws(makeBlock(thrower, TypeError), /test/)

  // use a fn to validate error object
  t.doesNotThrow(function() {
    a.throws(makeBlock(thrower, TypeError), function(err) {
      if ((err instanceof TypeError) && /test/.test(err)) {
        return true
      }
    })
  })

  // GH-207. Make sure deepEqual doesn't loop forever on circular refs

  var b = {}
  b.b = b

  var c = {}
  c.b = c

  var gotError = false
  try {
    t.deepEqual(b, c)
  } catch (e) {
    gotError = true
  }

  // GH-7178. Ensure reflexivity of deepEqual with `arguments` objects.
  var args = (function() { return arguments; })()
  a.throws(makeBlock(a.deepEqual, [], args))
  a.throws(makeBlock(a.deepEqual, args, []))
  t.ok(gotError)


  var circular = {y: 1}
  circular.x = circular

  function testAssertionMessage(actual, expected) {
    try {
      a.equal(actual, '')
    } catch (e) {
      t.equal(e.toString(),
          ['AssertionError:', expected, '==', '\'\''].join(' '))
      t.ok(e.generatedMessage, 'Message not marked as generated')
    }
  }

  testAssertionMessage(undefined, 'undefined')
  testAssertionMessage(null, 'null')
  testAssertionMessage(true, 'true')
  testAssertionMessage(false, 'false')
  testAssertionMessage(0, '0')
  testAssertionMessage(100, '100')
  testAssertionMessage(NaN, 'NaN')
  testAssertionMessage(Infinity, 'Infinity')
  testAssertionMessage(-Infinity, '-Infinity')
  testAssertionMessage('', '""')
  testAssertionMessage('foo', '\'foo\'')
  testAssertionMessage([], '[]')
  testAssertionMessage([1, 2, 3], '[ 1, 2, 3 ]')
  testAssertionMessage(/a/, '/a/')
  testAssertionMessage(/abc/gim, '/abc/gim')
  testAssertionMessage(function f() {}, '[Function: f]')
  testAssertionMessage(function() {}, '[Function]')
  testAssertionMessage({}, '{}')
  testAssertionMessage(circular, '{ y: 1, x: [Circular] }')
  testAssertionMessage({a: undefined, b: null}, '{ a: undefined, b: null }')
  testAssertionMessage({a: NaN, b: Infinity, c: -Infinity},
      '{ a: NaN, b: Infinity, c: -Infinity }')

  // #2893
  try {
    a.throws(function() {
      a.ifError(null)
    })
  } catch (e) {
    threw = true
    t.equal(e.message, 'Missing expected exception..')
  }
  t.ok(threw)

  // #5292
  try {
    a.equal(1, 2)
  } catch (e) {
    t.equal(e.toString().split('\n')[0], 'AssertionError: 1 == 2')
    t.ok(e.generatedMessage, 'Message not marked as generated')
  }

  try {
    a.equal(1, 2, 'oh no')
  } catch (e) {
    t.equal(e.toString().split('\n')[0], 'AssertionError: oh no')
    t.equal(e.generatedMessage, false,
                'Message incorrectly marked as generated')
  }

  // Verify that throws() and doesNotThrow() throw on non-function block
  function testBlockTypeError(method, block) {
    var threw = true

    try {
      method(block)
      threw = false
    } catch (e) {
      t.equal(e.toString(), 'TypeError: block must be a function')
    }

    t.ok(threw)
  }

  testBlockTypeError(a.throws, 'string')
  testBlockTypeError(a.doesNotThrow, 'string')
  testBlockTypeError(a.throws, 1)
  testBlockTypeError(a.doesNotThrow, 1)
  testBlockTypeError(a.throws, true)
  testBlockTypeError(a.doesNotThrow, true)
  testBlockTypeError(a.throws, false)
  testBlockTypeError(a.doesNotThrow, false)
  testBlockTypeError(a.throws, [])
  testBlockTypeError(a.doesNotThrow, [])
  testBlockTypeError(a.throws, {})
  testBlockTypeError(a.doesNotThrow, {})
  testBlockTypeError(a.throws, /foo/)
  testBlockTypeError(a.doesNotThrow, /foo/)
  testBlockTypeError(a.throws, null)
  testBlockTypeError(a.doesNotThrow, null)
  testBlockTypeError(a.throws, undefined)
  testBlockTypeError(a.doesNotThrow, undefined)

  t.end()
})

test('should work for maps', function(t) {
  // Map deep equal, deep strict equal
  const map1 = new Map()
  const map2 = new Map()
  map1.set('1', '2')
  map2.set('1', '2')
  t.doesNotThrow(function() {
    a.deepEqual(map1, map2)
    a.assertMap(map1, map2)
  })

  map1.set('2', '2')
  t.throws(function() {
    a.deepEqual(map1, map2)
  })

  t.throws(function() {
    a.assertMap(map1, map2)
  })

  map1.delete('2')
  map2.set('1', 2)

  t.doesNotThrow(function() {
    a.deepEqual(map1, map2)
    a.assertMap(map1, map2)
  })

  t.throws(function() {
    a.deepStrictEqual(map1, map2)
  })

  t.throws(function() {
    a.assertMapStrict(map1, map2)
  })

  map1.clear()
  map2.clear()
  map1.set(NaN, 'not a number')
  map2.set(NaN, 'not a number')

  t.doesNotThrow(function() {
    a.deepEqual(map1, map2)
    a.assertMap(map1, map2)
  })

  map1.clear()
  map2.clear()
  map1.set('1', { name: 'test' })
  map2.set('1', { name: 'test' })

  t.doesNotThrow(function() {
    a.deepStrictEqual(map1, map2)
    a.assertMapStrict(map1, map2)
  })

  map1.clear()
  map2.clear()
  // verify that insertion order doesn't matter
  map1.set('1', '1')
  map1.set('2', '2')
  map2.set('2', '2')
  map2.set('1', '1')

  t.doesNotThrow(function() {
    a.deepEqual(map1, map2)
    a.assertMap(map1, map2)
  })

  map1.clear()
  map2.clear()
  map1.set('1', '2')
  map2.set('2', '1')
  t.throws(function() {
    a.deepEqual(map1, map2)
  })

  t.end()
})

test('should work for sets', function(t) {
  // Set deep equal, deep strict equal
  var set1 = new Set()
  var set2 = new Set()
  set1.add(1)
  set2.add(1)

  t.doesNotThrow(function() {
    a.deepEqual(set1, set2)
    a.assertSet(set1, set2)
  })

  set1.add(2)

  t.throws(function() {
    a.deepEqual(set1, set2)
  })

  t.throws(function() {
    a.assertSet(set1, set2)
  })

  set1.delete(2)
  set2.delete(1)
  set2.add('1')
  // throws because we can't really check without being strict
  t.throws(function() {
    a.deepEqual(set1, set2)
  })

  t.throws(function() {
    a.assertSet(set1, set2)
  })

  t.throws(function() {
    a.assertSetStrict(set1, set2)
  })

  t.doesNotThrow(function() {
    a.deepEqual(new Set([NaN]), new Set([NaN]))
    a.assertSet(new Set([NaN]), new Set([NaN]))
  })
  // verify that insertion order doesn't matter
  set1 = new Set([1, 2])
  set2 = new Set([2, 1])

  t.doesNotThrow(function() {
    a.deepEqual(set1, set2)
    a.assertSetStrict(set1, set2)
  })

  t.end()
})
