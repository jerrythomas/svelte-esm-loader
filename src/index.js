import { compile, preprocess } from 'svelte/compiler'
import createLoader from 'create-esm-loader'
import { cwd } from 'process'
import { parse } from 'path'
import sveltePreprocess from 'svelte-preprocess'
import { URL, pathToFileURL } from 'url'
import { getUnaliasedFilePath } from './unalias.js'

let sveltePreprocessConfig
try {
	sveltePreprocessConfig = (
		await import(`${cwd()}/svelte-preprocess.config.js`)
	).default
} catch (error) {}

const svelteExt = '\\.svelte'
const assetExts = [
	'\\.css',
	...Object.keys(sveltePreprocessConfig || {})
		.filter(
			(ext) =>
				// https://github.com/sveltejs/svelte-preprocess/blob/main/src/autoProcess.ts#L50
				!['aliases', 'markupTagName', 'preserve', 'sourceMap'].includes(ext)
		)
		.map((ext) => `\\.${ext}`)
]
const svelteExtRegex = new RegExp(`${svelteExt}$`)
const svelteKitPathRegex = /\$app\//
const assetExtsRegex = new RegExp(`(${assetExts.join('|')})$`)
const allExtRegex = new RegExp(`(${[svelteExt, ...assetExts].join('|')})$`)

const svelteLoader = {
	resolve: (specifier, opts) => {
		const unaliasedFile = getUnaliasedFilePath(specifier, opts)
		// turn all our exts+paths into valid paths
		if (
			unaliasedFile.match(allExtRegex) ||
			unaliasedFile.match(svelteKitPathRegex)
		) {
			const { parentURL } = opts
			const url = new URL(unaliasedFile, parentURL).href
			return { url }
		} else if (unaliasedFile !== specifier) {
			return { url: pathToFileURL(unaliasedFile).href }
		}
	},

	format: (url, opts) => {
		// turn all our exts+paths into modules
		if (url.match(allExtRegex) || url.match(svelteKitPathRegex)) {
			return { format: 'module' }
		}
	},

	fetch: (url, opts) => {
		// sveltekit paths built-in aliases mocks
		if (url.match(svelteKitPathRegex)) {
			if (url.match(/\/navigation/)) {
				return {
					source: Buffer.from(
						`
            const goto = () => {}
            export { goto }
          `.trim(),
						'utf8'
					)
				}
			}
		}

		// turn assets exts into valid empty sources instead of failing
		if (url.match(assetExtsRegex)) {
			return { source: '' }
		}
	},

	transform: async (source, opts) => {
		// turn svelte templates into valid preprocessed and compiled js code
		if (opts.url.match(svelteExtRegex)) {
			let { name } = parse(opts.url)
			name = name.replace(/[^A-Za-z0-9]/g, '')

			if (sveltePreprocessConfig) {
				const processed = await preprocess(
					source.toString(),
					sveltePreprocess(sveltePreprocessConfig)
				)
				source = processed.code
			}

			const { js, warnings } = compile(source.toString(), {
				name: name[0].toUpperCase() + name.substring(1),
				filename: opts.url
			})

			warnings.forEach((warning) => {
				console.warn(`\nSvelte compile() warnings for ${warning.filename}:`)
				console.warn(warning.message)
				console.warn(warning.frame)
			})

			return { source: js.code }
		}
	}
}

export const { resolve, getFormat, getSource, transformSource, load } =
	await createLoader(svelteLoader)
