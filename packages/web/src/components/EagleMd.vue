<template lang="pug">
.eg-theme-agrume
  .eg-slideshow
    slide(v-if="s in slides" :key="s" enter='fadeIn' leave='bounceOutLeft')
      raw(:template="s")
</template>

<script>
import eagle from 'eagle.js'
import MakeHtml from '../assets/make-html'
import { Matter } from '../assets/util'

export default {
  mixins: [eagle.slideshow],
  props: {
    markdown: {
      default: '',
      required: true
    }
  },
  data () {
    return {
      header: {},
      slides: []
    }
  },
  created () {
    const { header, content } = new Matter().parse(this.markdown)
    this.$set(this, 'header', header)
    this.$set(this, 'slides', content.split(/\n===\n/g, (s) => {
      return new MakeHtml().render(s)
    }))
  }
}
</script>
