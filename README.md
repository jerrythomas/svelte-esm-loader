# svelte-esm-loader

**Experimental!**

Node.js esmodules [loader](https://nodejs.org/api/esm.html#esm_loaders) for [Svelte](https://github.com/sveltejs/svelte), and [SvelteKit](https://github.com/sveltejs/kit).

This is primarily intended to be used along with [uvu](https://github.com/lukeed/uvu) for testing svelte components using esm imports.

## Usage

```shell
npm install --save-dev @jerrythomas/svelte-esm-loader@beta
```

Add the test script to your `package.json`

```json
"script": {
    "test": "NODE_OPTIONS='--experimental-loader @jerrythomas/svelte-esm-loader' uvu test"
}
```

## About

- Set `{ type: 'module' }` in your `package.json`.
- Are using ESmodule `import` statements in your `.js` test files.
- Don't mind experimental non-production code.

With this, you can:

- [x] Successfully import `.svelte` components
  - JS code will be compiled using `svelte/compile`.
  - If a custom config file exists, component will be pre-processed with
    `svelte/preprocess` and [svelte-preprocess][preprocess].
- [x] No-op import `.css` files without failure (helpful for testing).
  - Other asset file extensions from the preprocessor config (e.g. `.postcss`)
    will also be no-op imported without failure.
- [x] Successfully import from aliased paths ($lib, $app) in SvelteKit.
  - `import { goto } from $app/navigation`, will load successfully as a no-op.
  - `import Count from $lib/Count.svelte` will import from `src/lib/Count.svelte`
  - imports from custom aliases configured in svelte.config.js will work
- [x] Support directory import and import from files without extensions
  - `import { something } from $lib/core` will import from `src/lib/core/index.js` or `src/lib/core.js`
- [x] Utilities for rendering a component and firing events for testing

### Simple

Here we have a simple Svelte component:

```html
<script>
  // Component.svelte -- A simple example Svelte component to test.
  import './styles/layout.css'

  const star = 'Sun'
</script>

<div>
  <strong>{star}</strong>
</div>

<style>
  strong {
    color: orange;
  }
</style>
```

Node.js will ordinarily fail on the following `import`, as it doesn't know how to handle `.svelte` (and the included `.css`) files:

```js
// Component.test.js -- Test a Svelte component.
import Component from './Component.svelte'
```

The same code will work successfully if we start Node.js with our loader:

```shell
NODE_OPTIONS="--experimental-loader @jerrythomas/svelte-esm-loader" npm run test
```

### Complex

Here we have a more complex Svelte component, which requires preprocessing for it's advanced features:

```html
<script>
  // Component.svelte -- A complex example Svelte component to test.

  // ADD: .postcss import
  import './styles/page.postcss'

  const star = 'Sun'
</script>

<!-- ADD: <template> tag from svelte-preprocess -->
<template>
  <div class="planet">
    <strong>{star}</strong>
  </div>
</template>

<!-- ADD: postcss w/nesting -->
<style lang="postcss">
  .planet {
    strong {
      color: orange;
    }
  }
</style>
```

We'll create a new custom config file to hold our [svelte-preprocess][preprocess] settings:

```js
// svelte-preprocess.config.js -- A custom home for our preprocess settings.
export default {
  postcss: true,
}
```

And now we can have our advanced Svelte component compile correctly:

If you happen to use [SvelteKit][sveltekit], and don't want to repeat the processor settings, you can change your `svelte.config.js` to pull in the config from our custom file:

```js
// svelte.config.js -- SvelteKit config file.
import sveltePreprocess from 'svelte-preprocess'

const { default: sveltePreprocessConfig } = await import(
  resolve('./svelte-preprocess.config.js')
)

export default {
  // ...,
  preprocess: [
    // ...,
    sveltePreprocess(sveltePreprocessConfig),
  ],
}
```

## Notes

- Importing `.json` files can be accomplished with experimental node flag `--experimental-json-modules`.
- Leaving off the `.js` extension works.
- You can import module folders, assuming that `index.js` exists in the folder.
- Import aliases (`from '$utils/draw.js'`) works. This relies on `svelte.config.js`.

## References

- [brev/esm-loader-svelte](https://github.com/brev/esm-loader-svelte): the original implemention and starter for this package
- [alias](https://www.npmjs.com/package/create-esm-loader#2-create-directory-aliases)
- [chain](https://www.npmjs.com/package/esm-loader-chaining-polyfill)
- [jsdom](https://github.com/modosc/global-jsdom)
- [loaders](https://nodejs.org/api/esm.html#esm_loaders)
- [node](https://github.com/nodejs/node)
- [preprocess](https://github.com/sveltejs/svelte-preprocess)
- [svelte](https://github.com/sveltejs/svelte)
- [sveltekit](https://github.com/sveltejs/kit)
- [typemodule](https://nodejs.org/api/packages.html#packages_package_json_and_file_extensions)
- [uvu](https://github.com/lukeed/uvu)
