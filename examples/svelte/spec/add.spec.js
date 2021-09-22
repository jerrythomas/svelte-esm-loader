import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { add } from '../src/lib/add'

test('should work for functions', () => {
  assert.equal(add(1, 2), 3)
})

test.run()
