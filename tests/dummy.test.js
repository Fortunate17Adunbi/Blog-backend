const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelpers = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns 1', () => {
    const result = listHelpers.dummy([3])
    assert.strictEqual(result, 1)
  })
})