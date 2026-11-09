// Build output paths are filesystem paths; service workers require URL paths.
export function toAssetUrl(relativePath){return relativePath.replaceAll('\\','/').replace(/^\.\//,'')}
export function isShellAsset(url){return !url.startsWith('data/')&&!url.endsWith('/sw.js')&&url!=='sw.js'&&!url.endsWith('.md')}
