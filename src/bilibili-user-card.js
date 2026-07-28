const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      max-width: var(--bic-max-width, 480px);
      color: var(--bic-text, #18191c);
      font-family: var(
        --bic-font,
        Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif
      );
      -webkit-tap-highlight-color: transparent;
    }

    * {
      box-sizing: border-box;
    }

    [hidden] {
      display: none !important;
    }

    .shell {
      min-height: 256px;
      overflow: hidden;
      background: var(--bic-background, #fff);
      border: 1px solid var(--bic-border, rgb(0 0 0 / 8%));
      border-radius: var(--bic-radius, 20px);
      box-shadow: var(--bic-shadow, 0 16px 48px rgb(24 25 28 / 12%));
    }

    .card {
      position: relative;
      cursor: pointer;
      outline: none;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--bic-hover-shadow, 0 22px 60px rgb(24 25 28 / 18%));
    }

    .card:focus-visible {
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--bic-primary, #fb7299) 25%, transparent),
        var(--bic-shadow, 0 16px 48px rgb(24 25 28 / 12%));
    }

    .banner {
      position: relative;
      min-height: 184px;
      overflow: hidden;
      background:
        radial-gradient(circle at 75% 25%, #ffb7cb 0, transparent 32%),
        linear-gradient(135deg, #596579, #1f2838);
    }

    .banner-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1.01);
    }

    .banner-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(to top, rgb(11 15 24 / 82%) 0%, rgb(11 15 24 / 18%) 70%),
        linear-gradient(to right, rgb(11 15 24 / 16%), transparent 65%);
    }

    .profile {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      gap: 14px;
      min-height: 184px;
      padding: 18px 20px;
      color: #fff;
    }

    .avatar-wrap {
      position: relative;
      flex: 0 0 74px;
      width: 74px;
      height: 74px;
      margin: 0 3px 2px;
    }

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: #f1f2f3;
      border: 3px solid rgb(255 255 255 / 92%);
      border-radius: 50%;
      box-shadow: 0 6px 24px rgb(0 0 0 / 24%);
    }

    .pendant {
      position: absolute;
      inset: -14px;
      width: calc(100% + 28px);
      height: calc(100% + 28px);
      object-fit: contain;
      pointer-events: none;
    }

    .identity {
      min-width: 0;
      padding-bottom: 2px;
    }

    .name-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .name {
      min-width: 0;
      margin: 0;
      overflow: hidden;
      font-size: clamp(20px, 5vw, 24px);
      font-weight: 750;
      line-height: 1.25;
      letter-spacing: -0.02em;
      text-overflow: ellipsis;
      text-shadow: 0 2px 8px rgb(0 0 0 / 45%);
      white-space: nowrap;
    }

    .level {
      display: inline-flex;
      align-items: center;
      height: 22px;
      padding: 0 7px;
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      background: var(--bic-primary, #fb7299);
      border: 1px solid rgb(255 255 255 / 55%);
      border-radius: 6px;
      box-shadow: 0 2px 8px rgb(0 0 0 / 18%);
    }

    .signature {
      display: -webkit-box;
      max-width: 380px;
      margin: 5px 0 0;
      overflow: hidden;
      color: rgb(255 255 255 / 84%);
      font-size: 13px;
      line-height: 1.55;
      text-shadow: 0 1px 5px rgb(0 0 0 / 58%);
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      padding: 14px 10px 16px;
      background: var(--bic-background, #fff);
    }

    .stat {
      position: relative;
      min-width: 0;
      padding: 0 8px;
      text-align: center;
    }

    .stat + .stat::before {
      position: absolute;
      top: 5px;
      bottom: 5px;
      left: 0;
      width: 1px;
      background: var(--bic-divider, #e3e5e7);
      content: "";
    }

    .stat-value,
    .stat-label {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stat-value {
      font-size: 16px;
      font-variant-numeric: tabular-nums;
      font-weight: 750;
      line-height: 1.35;
    }

    .stat-label {
      margin-top: 3px;
      color: var(--bic-muted, #9499a0);
      font-size: 12px;
    }

    .state {
      display: grid;
      min-height: 256px;
      place-items: center;
      padding: 32px;
      text-align: center;
    }

    .state-content {
      width: min(100%, 300px);
    }

    .spinner {
      width: 34px;
      height: 34px;
      margin: 0 auto 15px;
      border: 3px solid #e3e5e7;
      border-top-color: var(--bic-primary, #fb7299);
      border-radius: 50%;
      animation: spin 700ms linear infinite;
    }

    .state-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }

    .state-message {
      margin: 8px 0 0;
      color: var(--bic-muted, #9499a0);
      font-size: 13px;
      line-height: 1.6;
    }

    .retry {
      margin-top: 16px;
      padding: 8px 16px;
      color: #fff;
      font: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      background: var(--bic-primary, #fb7299);
      border: 0;
      border-radius: 999px;
    }

    .retry:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--bic-primary, #fb7299) 25%, transparent);
      outline-offset: 2px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 430px) {
      .banner,
      .profile {
        min-height: 218px;
      }

      .profile {
        align-items: flex-start;
        flex-direction: column;
        justify-content: flex-end;
        gap: 10px;
        padding: 18px;
      }

      .avatar-wrap {
        flex-basis: 70px;
        width: 70px;
        height: 70px;
      }

      .stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 18px 0;
      }

      .stat:nth-child(3)::before {
        display: none;
      }
    }

    :host([layout="vertical"]) {
      max-width: var(--bic-vertical-max-width, 300px);
    }

    :host([layout="vertical"]) .banner,
    :host([layout="vertical"]) .profile {
      min-height: 228px;
    }

    :host([layout="vertical"]) .profile {
      align-items: flex-start;
      flex-direction: column;
      justify-content: flex-end;
      gap: 10px;
      padding: 18px;
    }

    :host([layout="vertical"]) .avatar-wrap {
      flex-basis: 70px;
      width: 70px;
      height: 70px;
    }

    :host([layout="vertical"]) .stats {
      grid-template-columns: 1fr;
      gap: 0;
      padding: 5px 16px 8px;
    }

    :host([layout="vertical"]) .stat {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 43px;
      padding: 8px 3px;
      text-align: left;
    }

    :host([layout="vertical"]) .stat + .stat::before {
      top: 0;
      right: 0;
      bottom: auto;
      left: 0;
      width: auto;
      height: 1px;
    }

    :host([layout="vertical"]) .stat:nth-child(3)::before {
      display: block;
    }

    :host([layout="vertical"]) .stat-value {
      order: 2;
    }

    :host([layout="vertical"]) .stat-label {
      margin-top: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transition: none;
      }

      .spinner {
        animation-duration: 1400ms;
      }
    }
  </style>

  <div class="shell card" part="card" role="link" tabindex="0" hidden>
    <div class="banner" part="banner">
      <img class="banner-image" part="banner-image" alt="" referrerpolicy="no-referrer" />
      <div class="banner-overlay"></div>
      <div class="profile">
        <div class="avatar-wrap" part="avatar-wrap">
          <img class="avatar" part="avatar" alt="" referrerpolicy="no-referrer" />
          <img class="pendant" part="pendant" alt="" referrerpolicy="no-referrer" hidden />
        </div>
        <div class="identity">
          <div class="name-row">
            <h2 class="name" part="name"></h2>
            <span class="level" part="level"></span>
          </div>
          <p class="signature" part="signature"></p>
        </div>
      </div>
    </div>
    <div class="stats" part="stats"></div>
  </div>

  <div class="shell state loading" part="loading">
    <div class="state-content">
      <div class="spinner" aria-hidden="true"></div>
      <p class="state-title">正在加载 B 站资料</p>
      <p class="state-message">稍等一下，很快就好</p>
    </div>
  </div>

  <div class="shell state error" part="error" hidden>
    <div class="state-content">
      <p class="state-title">资料暂时加载失败</p>
      <p class="state-message"></p>
      <button class="retry" type="button">重新加载</button>
    </div>
  </div>
`

const pendingRequests = new Map()

function requestJson(url) {
  if (!pendingRequests.has(url)) {
    const request = fetch(url, { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        const body = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(body?.error || `请求失败（${response.status}）`)
        }

        return body
      })
      .finally(() => pendingRequests.delete(url))

    pendingRequests.set(url, request)
  }

  return pendingRequests.get(url)
}

export class BilibiliUserCard extends HTMLElement {
  static observedAttributes = ['uid', 'endpoint', 'link-target']

  #loadId = 0

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(template.content.cloneNode(true))

    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      this.openProfile()
    })

    this.shadowRoot.querySelector('.card').addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.openProfile()
      }
    })

    this.shadowRoot.querySelector('.retry').addEventListener('click', () => {
      this.load()
    })
  }

  connectedCallback() {
    this.load()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && oldValue !== newValue) {
      this.load()
    }
  }

  async load() {
    const loadId = ++this.#loadId
    const uid = this.getAttribute('uid')?.trim() || ''

    if (!/^\d+$/.test(uid)) {
      this.showError('请提供纯数字 UID。')
      return
    }

    this.showLoading()

    try {
      const payload = await requestJson(this.createEndpoint(uid))
      if (loadId !== this.#loadId) return
      this.render(payload.profile ?? payload.data ?? payload)
    } catch (error) {
      if (loadId !== this.#loadId) return
      this.showError(error instanceof Error ? error.message : '未知错误')
    }
  }

  createEndpoint(uid) {
    const configured = this.getAttribute('endpoint')?.trim()
    const pattern = configured
      || 'https://bili-info-card.vercel.app/api/bilibili/user/{uid}'
    const value = pattern.includes('{uid}')
      ? pattern.replaceAll('{uid}', encodeURIComponent(uid))
      : `${pattern}${pattern.includes('?') ? '&' : '?'}uid=${encodeURIComponent(uid)}`

    return new URL(value, document.baseURI).href
  }

  render(profile) {
    const name = String(profile.name || '哔哩哔哩用户')
    const card = this.shadowRoot.querySelector('.card')
    const banner = this.shadowRoot.querySelector('.banner-image')
    const avatar = this.shadowRoot.querySelector('.avatar')
    const pendant = this.shadowRoot.querySelector('.pendant')

    banner.src = profile.banner || ''
    avatar.src = profile.avatar || ''
    avatar.alt = `${name}的头像`
    pendant.src = profile.pendant?.image || ''
    pendant.hidden = !profile.pendant?.image

    this.setText('.name', name)
    this.setText('.signature', profile.signature || '这个人还没有填写签名')
    this.setText('.level', `LV${Number(profile.level) || 0}`)

    const stats = [
      ['following', '关注'],
      ['followers', '粉丝'],
      ['likes', '获赞'],
      ['archiveCount', '投稿'],
    ]

    const statsRoot = this.shadowRoot.querySelector('.stats')
    statsRoot.replaceChildren(
      ...stats.map(([key, label]) => {
        const item = document.createElement('div')
        item.className = 'stat'
        item.part = 'stat'
        item.setAttribute('aria-label', `${label} ${Number(profile[key]) || 0}`)

        const value = document.createElement('span')
        value.className = 'stat-value'
        value.textContent = this.formatNumber(profile[key])

        const labelElement = document.createElement('span')
        labelElement.className = 'stat-label'
        labelElement.textContent = label
        item.append(value, labelElement)
        return item
      }),
    )

    this.profileUrl = profile.url || this.createProfileUrl(this.getAttribute('uid'))
    card.setAttribute('aria-label', `打开 ${name} 的哔哩哔哩个人空间`)
    card.hidden = false
    this.shadowRoot.querySelector('.loading').hidden = true
    this.shadowRoot.querySelector('.error').hidden = true

    this.dispatchEvent(new CustomEvent('bilibili-user-loaded', {
      bubbles: true,
      composed: true,
      detail: { profile },
    }))
  }

  showLoading() {
    this.shadowRoot.querySelector('.card').hidden = true
    this.shadowRoot.querySelector('.loading').hidden = false
    this.shadowRoot.querySelector('.error').hidden = true
  }

  showError(message) {
    this.shadowRoot.querySelector('.card').hidden = true
    this.shadowRoot.querySelector('.loading').hidden = true
    this.shadowRoot.querySelector('.error').hidden = false
    this.setText('.error .state-message', message)

    this.dispatchEvent(new CustomEvent('bilibili-user-error', {
      bubbles: true,
      composed: true,
      detail: { message },
    }))
  }

  setText(selector, value) {
    this.shadowRoot.querySelector(selector).textContent = String(value)
  }

  openProfile() {
    const target = this.getAttribute('link-target') || '_blank'
    window.open(
      this.profileUrl || this.createProfileUrl(this.getAttribute('uid')),
      target,
      target === '_blank' ? 'noopener,noreferrer' : undefined,
    )
  }

  createProfileUrl(uid) {
    return /^\d+$/.test(uid || '')
      ? `https://space.bilibili.com/${uid}`
      : 'https://space.bilibili.com/'
  }

  formatNumber(value) {
    const number = Number(value)
    if (!Number.isFinite(number)) return '—'
    if (Math.abs(number) < 10_000) return new Intl.NumberFormat('zh-CN').format(number)

    return new Intl.NumberFormat('zh-CN', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(number)
  }
}

if (!customElements.get('bilibili-user-card')) {
  customElements.define('bilibili-user-card', BilibiliUserCard)
}
