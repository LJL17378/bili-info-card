# Bili Info Card

一个原生、跨框架的哔哩哔哩个人资料 Web Component。只传 UID，即可展示空间背景、
头像与头像挂件、昵称、签名、等级、关注数、粉丝数、获赞数和投稿数。

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://127.0.0.1:5173>。

## 普通 HTML / 博客

直接使用已部署的组件与公共 API，最小用法：

```html
<script
  type="module"
  src="https://bili-info-card.vercel.app/bilibili-user-card.js"
></script>

<bilibili-user-card uid="7900967"></bilibili-user-card>
```

组件默认请求 `https://bili-info-card.vercel.app/api/bilibili/user/{uid}`，因此放在其他
博客或框架里也只需填写 UID。自行部署后端时，可通过 `endpoint` 覆盖地址；`{uid}` 会被
自动替换：

```html
<bilibili-user-card
  uid="7900967"
  endpoint="https://你自己的域名/api/bilibili/user/{uid}"
></bilibili-user-card>
```

## Vue / Nuxt

```vue
<script setup>
import 'bili-info-card'
</script>

<template>
  <bilibili-user-card uid="7900967" />
</template>
```

若 Vue 在开发环境提示自定义元素警告，在 Vite 配置的
`compilerOptions.isCustomElement` 中放行 `bilibili-user-card`。

## React / Next.js

在客户端入口引入组件脚本，然后正常写标签：

```jsx
import 'bili-info-card'

export function ProfileCard() {
  return <bilibili-user-card uid="7900967" />
}
```

Next.js App Router 中，请在带有 `"use client"` 的组件内动态引入，避免服务端执行
`document`。

## Astro / Hexo / Hugo

它们最终都输出 HTML，因此可直接使用“普通 HTML / 博客”的写法。Astro 可在页面中使用
`<script>import 'bili-info-card'</script>`。

## 可配置项

- `uid`：必填，纯数字 B 站 UID。
- `endpoint`：可选，API 地址模板；默认使用本项目已部署的 Vercel API。
- `link-target`：可选，点击后的窗口目标；默认 `_blank`。

主题可通过 CSS 变量修改：

```css
bilibili-user-card {
  --bic-primary: #fb7299;
  --bic-radius: 24px;
  --bic-max-width: 620px;
  --bic-background: #fff;
  --bic-text: #18191c;
  --bic-muted: #9499a0;
}
```

组件还开放了 `card`、`banner`、`avatar`、`pendant`、`name`、`level`、`signature`、
`stats` 和 `stat` 等 `::part()` 样式接口。

## API

Vercel Function 位于 `api/bilibili/user/[uid].js`。它只接受数字 UID，不是任意 URL
代理；返回允许跨域的标准 JSON，并用 CDN 与函数内存做十分钟短缓存。

```text
GET /api/bilibili/user/7900967
```

可用 `CORS_ORIGIN` 环境变量将 `Access-Control-Allow-Origin` 从默认的 `*` 限制到
指定博客域名。

## 构建与测试

```bash
npm run build
npm test
```
