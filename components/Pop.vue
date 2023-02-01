<script setup lang="ts">
const props = defineProps<{
  name: string,
  me: boolean,
  system: boolean,
  color: string,
  beak: boolean,
  time: string,
  comment: string,
  read: number
}>()
/*
このへんで「読み込み中」などやりたい
onBeforeUpdate(() => {
  console.log('before updated')
})
onUpdated(() => {
  console.log('after updated')
})
*/
</script>

<template>
  <v-row class="ma-3" :justify="props.me ? 'end' : props.system ? 'center' : 'start'">

    <!-- ユーザーの場合 -->
    <v-avatar :color="props.beak ? props.color : ''" size="large" v-if="!props.me && !props.system">
      <v-icon icon="mdi-account" v-if="props.beak" />
    </v-avatar>
    <v-col cols="8" class="mx-2" v-if="!props.system">
      <v-row v-if="!props.me && props.beak">
        <div class="mb-1 text-grey-darken-3 text-body-2">{{ props.name }}</div>
      </v-row>
      <v-row align="end" :justify="props.me ? 'end' : 'start'" class="flex-nowrap">
        <div v-if="props.me && props.time && props.read === 0" class="meta mx-1 text-grey-darken-3 text-right text-body-2">{{ props.time }}</div>
        <div v-if="props.me && props.time && props.read === 1" class="meta mx-1 text-grey-darken-3 text-right text-body-2">既読<br>{{ props.time }}</div>
        <div v-if="props.me && props.time && props.read >= 2" class="meta mx-1 text-grey-darken-3 text-right text-body-2">既読{{ props.read }}<br>{{ props.time }}
        </div>
        <div class="pop" :class="{
          friend: !props.me,
          'friend-beak': !props.me && props.beak,
          me: props.me,
          'me-beak': props.me && props.beak,
        }">
          <!-- 発言そのものはHTMLタグ有効 -->
          <p class="text-body-1" v-html="props.comment"></p>
        </div>
        <div class="mx-1 text-grey-darken-3 text-body-2" v-if="!props.me">{{ props.time }}</div>
      </v-row>
    </v-col>

    <!-- Systemの場合 -->
    <div class="system text-white text-body-2 text-center" v-if="props.system">
      {{ props.time }}
      <br v-if="props.time && props.comment">
      {{ props.comment }}
    </div>

  </v-row>
</template>

<style>
.system {
  display: inline-block;
  position: relative;
  padding: 10px 15px;
  max-width: 600px;
  border-radius: 20px;
  background: rgba(66, 66, 66, .5);
}

.pop {
  display: inline-block;
  position: relative;
  padding: 10px 15px;
  max-width: 600px;
  border-radius: 20px;
}

.pop p {
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.friend {
  background: #fefefe;
}

.me {
  background: #ade39c;
}

.friend-beak:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: -7px;
  left: -16px;
  border: 11px solid transparent;
  border-right: 23px solid #fefefe;
  transform: rotate(44deg);
}

.me-beak:after {
  content: "";
  display: inline-block;
  position: absolute;
  top: -7px;
  right: -16px;
  border: 11px solid transparent;
  border-right: 23px solid #ade39c;
  transform: rotate(136deg);
}

.meta {
  word-break: keep-all;
}
</style>