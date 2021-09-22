import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { cwd } from 'process'
import { getUnaliasedFilePath } from '../src/unalias.js'

const backup = console.warn
const test = suite('alias')

test.before.each(() => {
  console.warn = () => {}
})
test.after.each(() => {
  console.warn = backup
})

function getFileList(root, aliasPrefix = '') {
  const files = [
    {
      specifier: `../src/lib/add`,
      opts: {
        parentURL: `file://${root}/spec/add.spec.js`,
        conditions: ['node', 'import'],
      },
      expected: `${root}/src/lib/add.js`,
    },
    {
      specifier: `${aliasPrefix}lib/ShowCount.svelte`,
      opts: {
        parentURL: `file://${root}/src/Count.svelte`,
        conditions: ['node', 'import'],
      },
      expected:
        aliasPrefix === ''
          ? 'lib/ShowCount.svelte'
          : `${root}/src/lib/ShowCount.svelte`,
    },
    {
      specifier: `${aliasPrefix}lib`,
      opts: {
        parentURL: `file://${root}/src/Count.svelte`,
        conditions: ['node', 'import'],
      },
      expected: `${root}/src/lib/index.js`,
    },
    {
      specifier: `${aliasPrefix}xyz`,
      opts: {
        parentURL: `file://${root}/src/Count.svelte`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: `file://${root}/node_modules/.pnpm/uvu@0.5.1/node_modules/uvu/bin.js`,
      opts: { parentURL: undefined, conditions: ['node', 'import'] },
    },
    {
      specifier: `file://${root}/spec/add.spec.js`,
      opts: {
        parentURL: `file://${root}/node_modules/.pnpm/uvu@0.5.1/node_modules/uvu/run/index.mjs`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: `file://${root}/spec/Count.spec.js`,
      opts: {
        parentURL: `file://${root}/node_modules/.pnpm/uvu@0.5.1/node_modules/uvu/run/index.mjs`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: './setup/env.js',
      opts: {
        parentURL: `file://${root}/spec/Count.spec.js`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: '../src/Count.svelte',
      opts: {
        parentURL: `file://${root}/spec/Count.spec.js`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: 'uvu/run',
      opts: {
        parentURL: `file://${root}/node_modules/.pnpm/uvu@0.5.1/node_modules/uvu/bin.js`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: 'uvu',
      opts: {
        parentURL: `file://${root}/node_modules/.pnpm/uvu@0.5.1/node_modules/uvu/run/index.mjs`,
        conditions: ['node', 'import'],
      },
    },
    {
      specifier: './internal/index.mjs',
      opts: {
        parentURL: `file://${root}/node_modules/.pnpm/svelte@3.42.6/node_modules/svelte/index.mjs`,
        conditions: ['node', 'import'],
      },
    },
  ]

  return files
}

test('resolve aliases for svelte', () => {
  const files = getFileList(`${cwd()}/examples/svelte`)
  files.map((file) => {
    let unaliasedFile = getUnaliasedFilePath(file.specifier, file.opts)
    assert.equal(unaliasedFile, file.expected || file.specifier)
  })
})

test('resolve aliases for svelte/kit', () => {
  const files = getFileList(`${cwd()}/examples/svelte-kit`, '$')
  const aliases = {
    $lib: `${cwd()}/examples/svelte-kit/src/lib`,
  }
  files.map((file) => {
    let unaliasedFile = getUnaliasedFilePath(file.specifier, file.opts, aliases)
    assert.equal(unaliasedFile, file.expected || file.specifier)
  })
})

test.run()
