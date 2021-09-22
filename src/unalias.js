import { cwd } from 'process'
import { fileURLToPath } from 'url'
import { existsSync, lstatSync } from 'fs'
import { dirname, extname, join, resolve } from 'path'

const aliasRegex = new RegExp('(\\$\\w*)/?')
const modulesRegex = new RegExp('node_modules')

let svelteAliasConfig = {}

try {
  svelteAliasConfig =
    (await import(`${cwd()}/svelte.config.js`)).default.vite?.resolve?.alias ||
    {}
  svelteAliasConfig['$lib'] = resolve('./src/lib') //  default alias for sveltekit lib
} catch (error) {
  // console.error(error)
}

/**
 * Converts aliased paths to regular paths
 *
 * @param {str} specifier
 * @param {dict} opts
 * @param {dict} aliases
 * @returns
 */
export function getUnaliasedFilePath(
  specifier,
  opts,
  aliases = svelteAliasConfig
) {
  let location = opts.parentURL || specifier
  let file_path = specifier

  // No changes required in path for external dependencies
  if (location.match(modulesRegex)) {
    return file_path
  }

  // Convert aliases to actual paths
  if (file_path.match(aliasRegex)) {
    const alias = file_path.match(aliasRegex)[1]

    if (alias in aliases) {
      file_path = file_path.replace(alias, aliases[alias])
    } else if (alias !== '$app') {
      console.warn(
        `svelte.config.js does not contain configuration for alias "${alias}"`
      )
    }
  }

  return getUnaliasedJS(file_path, opts)
}

/**
 * Finds appropriate js file path for folders and imports without extensions.
 *
 * @param {str} file_path
 * @param {dict} opts
 * @returns
 */
export function getUnaliasedJS(file_path, opts) {
  const parentPath = dirname(fileURLToPath(opts.parentURL || `file://${cwd()}`))
  const absolutePath =
    file_path.slice(0, 1) === '/' ? file_path : join(parentPath, file_path)

  if (extname(file_path) === '') {
    let js_file_path = join(parentPath, file_path + '.js')

    if (existsSync(absolutePath) && lstatSync(absolutePath).isDirectory()) {
      js_file_path = join(absolutePath, 'index.js')
    }
    return existsSync(js_file_path) ? js_file_path : file_path
  }
  return file_path
}
