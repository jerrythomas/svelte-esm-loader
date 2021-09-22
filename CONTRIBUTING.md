# CONTRIBUTING

Contributions are welcome.

## Get the repo

```bash
git clone https://github.com/jerrythomas/svelte-esm-utils
cd svelte-esm-utils
```

## Set up and test

Tests include the package code and examples as well.

```bash
pnpm i
cd examples/svelte
pnpm i && pnpm link ../..
cd ../svelte-kit
pnpm i && pnpm link ../..

pnpm test:all
```

This repo uses `git flow` branching. Releases and publishing are automated using github actions.
