<script setup lang="ts">
const lineTalkState = useLineTalkState()
const title = useState('title', () => 'LINEトーク履歴ビューア')
const memberList = computed(() => lineTalkState.members.value) // 読み取り専用
// v-modelでの双方向バインディング
const owner = computed({
  get(): string {
    return lineTalkState.owner.value
  },
  set(val: string) {
    lineTalkState.owner = ref(val)
  }
})

// ファイル読み込みまわり
const fileinput = ref()
const btnClick = () => {
  if (fileinput && fileinput.value && fileinput.value.click()) fileinput.value.click()
}
const upload = () => {
  if (fileinput && fileinput.value) {
    const file = fileinput.value.files[0]
    if (!file) return
    // ここから処理
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        alert('テキストファイルではありません')
        return
      }
      // タイトルを更新
      const t_search = reader.result.match(/^\[LINE\]\s(.+)のトーク履歴$/m)
      if (t_search && t_search[1]) title.value = t_search[1]
      // テキスト読み込み・パース・State反映
      lineTalkState.target = reader.result
    }
    reader.onerror = () => alert('トーク履歴ファイルの読み込みに失敗しました')
    reader.readAsText(file)
  }
}

// ヘッダ高さ調整(効いてない気がする)
const controlElement = ref()
const controlHeight = useState('controlHeight', () => 100)
window.onresize = () => controlHeight.value = controlElement.value.clientHeight
onMounted(() => controlHeight.value = controlElement.value.clientHeight)
</script>

<template>
  <v-row ref="controlElement" class="ma-0 pa-3 text-h5 text-white control-main" justify="space-between" align="center">
    <v-col cols="auto">{{ title }}</v-col>
    <v-col cols="auto" class="py-0">
      <v-btn class="mb-2" size="small" prepend-icon="mdi-file" variant="outlined" @click="btnClick">ファイル読込</v-btn>
      <v-select :items="memberList" v-model="owner" variant="outlined" label="ユーザー名" density="compact" hide-details></v-select>
    </v-col>
    
    <!-- ダミーのインプットフォーム(非表示) -->
    <input style="display: none" ref="fileinput" type="file" @change="upload()" />
  </v-row>
  <v-row class="spacer" :style="'height: ' + controlHeight + 'px'"></v-row>
</template>

<style>
.control-main {
  position: fixed;
  width: 100%;
  z-index: 100;
  background: rgba(66, 66, 66, .95);
}
.spacer {
  position: relative;
  max-width: 1000px;
  width: 100%;
  z-index: 10;
  background: transparent;
}

@media (min-width: 960px) {
  .control-main {
    max-width: 900px;
  }
}

@media (min-width: 1280px) {
  .control-main {
    max-width: 1200px;
  }
}

@media (min-width: 1920px) {
  .control-main {
    max-width: 1800px;
  }
}

@media (min-width: 2560px) {
  .control-main {
    max-width: 2400px;
  }
}
</style>