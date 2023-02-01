<script setup lang="ts">
const { pops } = useLineTalkState()
const lineTalkState = useLineTalkState()

// ようこそ文
onMounted(() => {
  const d = new Date()
  const dow = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  const yyyymmdd = String(d.getFullYear()) + '/' + String(d.getMonth() + 1) + '/' + String(d.getDate()) + '(' + dow + ')'
  const hhmm = String(d.getHours()) + (d.getMinutes() < 10 ? ':0' : ':') + String(d.getMinutes())
  const welcome = '\n' +
    yyyymmdd + '\n' +
    hhmm + '\tあなた\tどうやって使うの？\n' +
    hhmm + '\tBot\tようこそ🎉\n' +
    hhmm + '\tBot\tまずはじめに、以下のページを参考にしてLINEのトーク履歴をテキスト形式で保存してください。\n' +
    'https://help.line.me/line/?lang=ja&contentId=20007388\n' +
    hhmm + '\tBot\t次に、右上の「ファイル読込」から、保存したテキストファイルを選択してください。\n' +
    'トーク履歴を読み込んでチャットルームを再現します。（読み込みに時間がかかる場合があります）\n' +
    hhmm + '\tBot\t右上の「ユーザー名」を切り替えると、そのユーザーの端末での見た目を再現することができます。\n' +
    hhmm + '\tあなた\tトーク履歴が流出しちゃったりしない？\n' +
    hhmm + '\tBot\tWebブラウザ上のみで処理を行っており、サーバーへは送信していないのでご安心ください👍\n' +
    hhmm + '\tあなた\tそのほかの情報は？\n' +
    hhmm + '\t作者うこが参加しました。\n' +
    hhmm + '\t作者うこ\t作者のTwitterへ気軽に問い合わせてね！\n' +
    'https://twitter.com/ukokq\n' +
    hhmm + '\t作者うこ\tソースコードはこちらで公開しています✍️\n' +
    'https://github.com/ukkz/linetalkviewer'
  lineTalkState.target = welcome
})
</script>

<template>
  <v-container fluid class="pa-0">
    <Pop
      v-for="(pop, index) in pops" :key="index"
      :name="pop.name"
      :me=pop.me
      :system=pop.system
      :color="pop.color"
      :beak=pop.beak
      :time="pop.time"
      :comment="pop.comment"
      :read="pop.read"
    />
  </v-container>
</template>