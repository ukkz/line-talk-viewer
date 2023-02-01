import { Ref } from 'nuxt/dist/app/compat/capi';

interface IPopdata {
  name: string, me: boolean, system: boolean, color: string, beak: boolean, time: string, comment: string, read: number
}

class lineTalkState {
  private _text: string = ''
  private _pops: Ref<Array<IPopdata>>
  private _colors: Ref<any> // キー名 = ユーザー名, 存在していれば _colors['taro'] = #ffffff のようにする
  private _members: Ref<Array<string>>
  private _owner: Ref<string>
  private static readonly sys_border = '---'
  private static readonly replaced_a_tag = '<a href="$1" target="_blank">$1</a>'
  private static readonly regex_date_pre_replace = new RegExp('^\n([0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}\\(.\\))$', 'gm')
  private static readonly regex_system_date = new RegExp('^' + lineTalkState.sys_border + '([0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}\\(.\\))' + lineTalkState.sys_border + '$')
  private static readonly regex_system_comment = new RegExp('^([1,2]{0,1}[0-9]{1}\:[0-9]{2})\t(.*)$')
  private static readonly regex_user = new RegExp('^([1,2]{0,1}[0-9]{1}\:[0-9]{2})\t(.*)\t(.*)$')
  private static readonly regex_url = new RegExp('(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+)', 'g')


  public constructor() {
    this._pops = useState<Array<IPopdata>>('pops', () => [])
    this._colors = useState<any>('colors', () => { })
    this._members = useState<Array<string>>('members', () => [])
    this._owner = useState<string>('owner', () => '')
  }

  // 対象テキストを読み込んでパースする
  set target(text: string) {
    // リセット
    this._text = ''
    this._pops.value = []
    this._colors.value = {}
    this._members.value = []
    this._owner.value = ''
    // BOM削除とCRLF統一
    text = text.replace(/^\ufeff/, '')
    text = text.replace(/(\r\n|\r)/gm, '\n')
    // 日時の事前replace(改行+日時となっているので改行を消して代替文字列ではさむ)
    this._text = text.replace(lineTalkState.regex_date_pre_replace, lineTalkState.sys_border + '$1' + lineTalkState.sys_border)
    // 行分割
    const rows = this._text.split('\n')
    // 行ごとに処理
    for (let i = 0; i < rows.length; i++) {
      // 前回まで処理した発言のインデックス
      const popsLastIndex = this._pops.value.length - 1
      // ユーザー？
      const user = rows[i].match(lineTalkState.regex_user)
      if (user) {
        // メンバーがいなければランダム色とともに追加
        if (!this._colors.value[user[2]]) {
          this._colors.value[user[2]] = this.randomColor
          this._members.value.push(user[2])
        }
        // 連続発言かどうか(1つ前の発言が同じ人かつ同時刻の場合)
        const continuous: boolean = (popsLastIndex > 0 && this._pops.value[popsLastIndex].name === user[2] && this._pops.value[popsLastIndex].time === user[1])
        // 連続発言の場合は前回発言から時刻を消去
        if (continuous) this._pops.value[popsLastIndex].time = ''
        // この回の発言を新規追加
        this._pops.value.push({
          name: user[2],
          me: (user[2] === Object.keys(this._colors.value)[0]), // デフォルトでは最初のメンバーが自分
          system: false,
          color: this._colors.value[user[2]],
          beak: !continuous,
          time: user[1],
          comment: user[3].replace(lineTalkState.regex_url, lineTalkState.replaced_a_tag), // 発言の中のURLにaタグをつけておく
          read: Object.keys(this._colors.value).length - 1 // この時点での自分を除いたユーザー数を記録
        })
        continue
      }
      // 日付変更？
      const date = rows[i].match(lineTalkState.regex_system_date)
      if (date) {
        this._pops.value.push({
          name: 'system',
          me: false,
          system: true,
          color: 'black',
          beak: false,
          time: '',
          comment: date[1],
          read: 0
        })
        continue
      }
      // システムメッセージ？
      const sys = rows[i].match(lineTalkState.regex_system_comment)
      if (sys) {
        this._pops.value.push({
          name: 'system',
          me: false,
          system: true,
          color: 'black',
          beak: false,
          time: sys[1],
          comment: sys[2],
          read: 0
        })
        continue
      }
      // それ以外のユーザー発言のうち2行目以降のメッセージ
      if (popsLastIndex >= 0 && this._pops.value[popsLastIndex].comment) {
        // 1つ前のpop.commentのあとに改行タグをはさんでくっつける + aタグ処理
        this._pops.value[popsLastIndex].comment += '<br>' + rows[i].replace(lineTalkState.regex_url, lineTalkState.replaced_a_tag)
      }
      // 自分は誰か
      this._owner.value = this._members.value[0]
    }
  }

  get pops() {
    return readonly(this._pops)
  }

  get members() {
    return readonly(this._members)
  }

  get owner() {
    return readonly(this._owner)
  }

  set owner(who: Ref<string>) {
    if (this._members.value.indexOf(who.value) >= 0) {
      for (let i = 0; i < this._pops.value.length; i++) {
        this._pops.value[i].me = this._pops.value[i].name === who.value
      }
      this._owner.value = who.value
    }
  }

  private get randomColor(): string {
    return "#" + ("000000" + (Math.random() * 0xFFFFFF | 0).toString(16)).slice(-6);
  }
}

export const useLineTalkState = () => {
  return new lineTalkState()
}