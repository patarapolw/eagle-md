<template lang="pug">

</template>

<script>
import eagle from 'eagle.js'

export default {
  mixins: [eagle.slideshow],
  props: {
    markdown: {
      type: String,
      required: true
    }
  }
}
</script>
