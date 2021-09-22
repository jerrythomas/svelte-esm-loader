import path from 'path'
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
  },
  vite: {
    resolve: {
      alias: {
        $config: path.resolve('./src/config'),
      },
    },
  },
}

export default config
