// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja',
        prefix: 'og: http://ogp.me/ns#'
      },
      title: 'LINEトーク履歴ビューア',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'テキスト形式で保存されたLINEのトーク履歴を見やすく表示するためのWebアプリです。' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:title', content: 'LINEトーク履歴ビューア' },
        { property: 'og:description', content: 'テキスト形式で保存されたLINEのトーク履歴を見やすく表示するためのWebアプリです。' },
        { property: 'og:url', content: 'https://linetalkviewer.uko.jp' },
        { property: 'og:image', content: 'https://linetalkviewer.uko.jp/cover.png' },
        { property: 'og:type', content: 'website' },
        { hid: 'og:site_name', property: 'og:site_name', content: 'LINEトーク履歴ビューア' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
        { hid: 'twitter:site', name: 'twitter:site', content: '@ukokq' },
        { hid: 'keywords', name: 'keywords', content: 'LINE,ライン,トーク履歴,バックアップ,テキスト' },
      ],
    },
  },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    'mdi/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
