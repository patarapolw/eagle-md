<template lang="pug">
#App
  router-view
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
html, body {
  margin: 0;
}

#App {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.h-100 {
  height: 100%;
}

.w-100 {
  width: 100%;
}

.w-50 {
  width: 50%;
}
</style>
