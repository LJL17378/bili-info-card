import { cp, mkdir, rm } from 'node:fs/promises'
import { build } from 'esbuild'

await rm('dist', { force: true, recursive: true })
await mkdir('dist', { recursive: true })

await build({
  entryPoints: ['src/bilibili-user-card.js'],
  bundle: true,
  format: 'esm',
  legalComments: 'none',
  minify: true,
  outfile: 'dist/bilibili-user-card.js',
  sourcemap: true,
  target: ['es2022'],
})

await cp('demo/index.html', 'dist/index.html')
