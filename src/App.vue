<template lang="pug">
#app
  eagle-editor
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EagleEditor from './components/EagleEditor.vue';

@Component({
  components: {
    EagleEditor,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
html, body, #app {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

#app {
  position: fixed;
}
</style>
