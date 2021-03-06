# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-beta.2] - 2021-09-23

### Changed

- Package name to @jerrythomas/svelte-esm-loader

### Removed

- Facade for svelte components have been moved into [svelte-facade](https://github.com/jerrythomas/svelte-facade)

## [1.0.0-beta.1] - 2021-09-22

### Added

- Forked initial release from [brev/esm-loader-svelte](https://github.com/brev/esm-loader-svelte)
- Included support for aliases in svelte/kit
- Included supported for directory import
- Included support for import from esm module without the '.js' extensions
- Added the env utility for testing svelte components (from [lukeed/uvu](https://github.com/lukeed/uvu/tree/master/examples/svelte))
- Added examples for testing svelte & svelte/kit using this library and uvu
- Added unit tests using uvu
