import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getBilibiliProfile, validateUid } from '../lib/bilibili.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const port = Number(process.env.PORT) || 5173
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function json(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    'Cache-Control': status === 200
      ? 'public, max-age=60, s-maxage=600, stale-while-revalidate=600'
      : 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(body))
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const apiMatch = url.pathname.match(/^\/api\/bilibili\/user\/([^/]+)$/)

  if (request.method === 'OPTIONS' && apiMatch) {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Accept, Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
    })
    response.end()
    return
  }

  if (apiMatch) {
    if (request.method !== 'GET') {
      json(response, 405, { error: '只支持 GET 请求' })
      return
    }

    const uid = validateUid(decodeURIComponent(apiMatch[1]))
    if (!uid) {
      json(response, 400, { error: 'UID 必须是 1 到 20 位数字' })
      return
    }

    try {
      json(response, 200, { profile: await getBilibiliProfile(uid) })
    } catch (error) {
      json(response, error.status || 500, { error: error.message || '服务器内部错误' })
    }
    return
  }

  let relativePath
  if (url.pathname === '/' || url.pathname === '/demo/' || url.pathname === '/index.html') {
    relativePath = 'demo/index.html'
  } else if (url.pathname === '/bilibili-user-card.js') {
    relativePath = 'src/bilibili-user-card.js'
  } else {
    relativePath = normalize(url.pathname).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '')
  }

  const filePath = join(root, relativePath)
  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Bili Info Card running at http://127.0.0.1:${port}`)
})
