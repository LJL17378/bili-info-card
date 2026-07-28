import { expect, test } from '@playwright/test'

const fixture = {
  profile: {
    uid: '7900967',
    name: 'dogz警犬儿',
    avatar: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23fb7299"/></svg>',
    banner: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320"><rect width="800" height="320" fill="%2337475f"/></svg>',
    signature: '“致膝盖上的擦伤、童年的时光和青春心事。”',
    level: 6,
    following: 986,
    followers: 31,
    likes: 98,
    archiveCount: 2,
    pendant: null,
    url: 'https://space.bilibili.com/7900967',
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/bilibili/user/7900967', (route) =>
    route.fulfill({ contentType: 'application/json', json: fixture }),
  )
})

test('renders the profile and all four statistics', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('bilibili-user-card')

  await expect(card.locator('.name')).toHaveText('dogz警犬儿')
  await expect(card.locator('.level')).toHaveText('LV6')
  await expect(card.locator('.signature')).toContainText('青春心事')
  await expect(card.locator('.stat-value')).toHaveText(['986', '31', '98', '2'])
  await expect(card.locator('.card')).toBeVisible()
})

test('rejects an invalid uid without making a request', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('bilibili-user-card')
  await card.evaluate((element) => {
    element.setAttribute('uid', 'javascript:alert(1)')
  })
  await expect(card.locator('.error')).toBeVisible()
  await expect(card.locator('.error .state-message')).toHaveText('请提供纯数字 UID。')
})

test('reloads when uid changes', async ({ page }) => {
  await page.route('**/api/bilibili/user/2', (route) =>
    route.fulfill({
      contentType: 'application/json',
      json: { profile: { ...fixture.profile, uid: '2', name: '新昵称' } },
    }),
  )
  await page.goto('/')

  const card = page.locator('bilibili-user-card')
  await expect(card.locator('.name')).toHaveText('dogz警犬儿')
  await card.evaluate((element) => element.setAttribute('uid', '2'))
  await expect(card.locator('.name')).toHaveText('新昵称')
})

test('stays usable at a narrow mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/')

  const card = page.locator('bilibili-user-card')
  await expect(card).toBeVisible()
  await expect(card.locator('.stats')).toHaveCSS('grid-template-columns', /.+ .+/)
  expect((await card.boundingBox()).width).toBeLessThanOrEqual(288)
})

test('switches between horizontal and vertical layouts', async ({ page }) => {
  await page.goto('/')
  const card = page.locator('bilibili-user-card')
  const stats = card.locator('.stats')

  await expect(card).not.toHaveAttribute('layout')
  await expect(stats).toHaveCSS('grid-template-columns', /.+ .+ .+ .+/)

  await card.evaluate((element) => {
    element.setAttribute('layout', 'vertical')
  })

  await expect(card).toHaveAttribute('layout', 'vertical')
  await expect(stats).toHaveCSS('grid-template-columns', /^(?!.* ).+$/)

  const box = await card.boundingBox()
  expect(box.width).toBeLessThanOrEqual(300)
  expect(box.height).toBeGreaterThan(380)
})
