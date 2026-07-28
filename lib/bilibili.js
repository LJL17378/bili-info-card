const BILIBILI_CARD_API = 'https://api.bilibili.com/x/web-interface/card'
const CACHE_TTL = 10 * 60 * 1000
const cache = globalThis.__biliInfoCardCache ??= new Map()

export class BilibiliApiError extends Error {
  constructor(message, status = 502) {
    super(message)
    this.name = 'BilibiliApiError'
    this.status = status
  }
}

export function validateUid(value) {
  const uid = Array.isArray(value) ? value[0] : String(value || '').trim()
  return /^\d{1,20}$/.test(uid) ? uid : null
}

export async function getBilibiliProfile(uid, options = {}) {
  const now = Date.now()
  const cached = cache.get(uid)

  if (!options.fresh && cached && cached.expiresAt > now) {
    return { ...cached.value, cached: true }
  }

  const url = new URL(BILIBILI_CARD_API)
  url.searchParams.set('mid', uid)
  url.searchParams.set('photo', 'true')

  let response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Referer: `https://space.bilibili.com/${uid}/`,
        'User-Agent': 'Mozilla/5.0 (compatible; bili-info-card/1.0)',
      },
      signal: AbortSignal.timeout(10_000),
    })
  } catch (error) {
    throw new BilibiliApiError(
      error?.name === 'TimeoutError' ? 'B 站接口响应超时' : '无法连接到 B 站接口',
    )
  }

  if (!response.ok) {
    throw new BilibiliApiError(`B 站接口返回 HTTP ${response.status}`)
  }

  const payload = await response.json()

  if (payload.code !== 0 || !payload.data?.card) {
    const status = payload.code === -404 ? 404 : 502
    throw new BilibiliApiError(payload.message || 'B 站没有返回用户资料', status)
  }

  const { card, space } = payload.data
  const value = {
    uid,
    name: card.name,
    avatar: card.face,
    banner: space?.l_img || space?.s_img || '',
    signature: card.sign || '',
    level: Number(card.level_info?.current_level) || 0,
    following: Number(card.attention) || 0,
    followers: Number(payload.data.follower ?? card.fans) || 0,
    likes: Number(payload.data.like_num) || 0,
    archiveCount: Number(payload.data.archive_count) || 0,
    pendant: card.pendant?.image
      ? { name: card.pendant.name || '', image: card.pendant.image }
      : null,
    official: card.Official?.title
      ? { title: card.Official.title, type: card.Official.type }
      : null,
    url: `https://space.bilibili.com/${uid}`,
    fetchedAt: new Date().toISOString(),
    cached: false,
  }

  cache.set(uid, { expiresAt: now + CACHE_TTL, value })
  return value
}

export function clearExpiredCache() {
  const now = Date.now()
  for (const [uid, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(uid)
  }
}
