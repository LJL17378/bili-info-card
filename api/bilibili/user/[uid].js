import {
  BilibiliApiError,
  getBilibiliProfile,
  validateUid,
} from '../../../lib/bilibili.js'

export default async function handler(request, response) {
  const allowedOrigin = process.env.CORS_ORIGIN || '*'
  response.setHeader('Access-Control-Allow-Origin', allowedOrigin)
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type')
  response.setHeader('Vary', 'Origin')

  if (request.method === 'OPTIONS') {
    return response.status(204).end()
  }

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET, OPTIONS')
    return response.status(405).json({ error: '只支持 GET 请求' })
  }

  const uid = validateUid(request.query.uid)
  if (!uid) {
    return response.status(400).json({ error: 'UID 必须是 1 到 20 位数字' })
  }

  try {
    const profile = await getBilibiliProfile(uid)
    response.setHeader(
      'Cache-Control',
      'public, max-age=60, s-maxage=600, stale-while-revalidate=600',
    )
    return response.status(200).json({ profile })
  } catch (error) {
    const status = error instanceof BilibiliApiError ? error.status : 500
    return response.status(status).json({
      error: error instanceof Error ? error.message : '服务器内部错误',
    })
  }
}
