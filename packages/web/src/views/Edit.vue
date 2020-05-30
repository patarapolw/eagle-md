<template lang="pug">
.h-100.w-100
  CodeMirror.h-100(ref="cm" v-model="raw" :options="cmOptions" @input="onCmCodeChange"
    :class="showPreview ? 'w-50' : 'w-100'")
  EagleMd.h-100.w-50(v-if="showPreview" :markdown="markdown" :line="line" :back-by-slide="true"
    :mouse-navigation="false" :keyboard-navigation="false" style="position: absolute; left: 50%; top: 0")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { codemirror as CodeMirror } from 'vue-codemirror'
import EagleMd from '@/components/EagleMd.vue'
import { Matter } from '../assets/util'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
import 'codemirror/mode/pug/pug.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/scroll/scrollpastend.js'
import 'codemirror/theme/monokai.css'

@Component({
  components: {
    CodeMirror,
    EagleMd
  }
})
export default class Edit extends Vue {
  cmOptions = {
    theme: 'monokai',
    lineNumbers: true,
    autoCloseBrackets: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineWrapping: true,
    tabSize: 2,
    extraKeys: {
      'Cmd-/': 'toggleComment',
      'Ctrl-/': 'toggleComment',
      Tab: (cm: CodeMirror.Editor) => {
        const spaces = Array(cm.getOption('indentUnit')! + 1).join(' ')
        cm.getDoc().replaceSelection(spaces)
      }
    },
    foldGutter: true,
    scrollPastEnd: true,
    mode: {
      name: 'yaml-frontmatter',
      base: 'markdown'
    }
  }

  raw = ''
  markdown = ''
  line: number = 0;
  offset: number = 0;
  showPreview = true;
  headers: any = {};

  matter = new Matter()

  get codemirror (): CodeMirror.Editor {
    return (this.$refs.cm as any).codemirror
  }

  mounted () {
    this.codemirror.setSize('100%', '100%')
    this.codemirror.addKeyMap({
      'Cmd-P': () => { this.showPreview = !this.showPreview },
      'Ctrl-P': () => { this.showPreview = !this.showPreview }
    })
    this.codemirror.on('cursorActivity', (instance) => {
      this.line = instance.getCursor().line - this.offset
    })
    this.codemirror.on('change', (instance) => {
      this.line = instance.getCursor().line - this.offset
    })
    this.onCmCodeChange()
  }

  onCmCodeChange () {
    try {
      const { header, content } = this.matter.parse(this.raw)
      Vue.set(this, 'headers', header)
      this.markdown = content
      this.offset = this.raw.replace(content, '').split('\n').length - 1
    } catch (e) {
      this.markdown = this.raw
      this.offset = 0
    }
  }
}
</script>
