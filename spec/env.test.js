import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { setup, reset, render, fire } from '../src/env.js'
import Count from '../examples/compiled/counter.js'

const test = suite('env')

test('Should set up globals', () => {
  setup()
  assert.equal(global.window, window)
  assert.equal(global.requestAnimationFrame, null)
})

test('Should reset document', () => {
  reset()
  assert.equal(window.document.title, '')
  assert.equal(window.document.head.innerHTML, '')
  assert.equal(window.document.body.innerHTML, '')
})

test('Should render a component', async () => {
  reset()
  const { container } = render(Count)
  assert.snapshot(
    container.innerHTML,
    `<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
  )
})

test('Should fire an event', async () => {
  reset()
  const { container } = render(Count)

  assert.snapshot(
    container.innerHTML,
    `<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
  )

  await fire(container.querySelector('#incr'), 'click')

  assert.snapshot(
    container.innerHTML,
    `<button id="decr">--</button> <span>6</span> <button id="incr">++</button>`
  )
})

test.run()
