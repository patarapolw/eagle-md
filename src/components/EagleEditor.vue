<template lang="pug">
.h-100.w-100
  codemirror.h-100(ref="cm" v-model="raw" :options="cmOptions" @input="onCmCodeChange"
    :class="showPreview ? 'w-50' : 'w-100'")
  eagle-markdown.h-100.w-50(v-if="showPreview" :markdown="markdown" :line="line" :back-by-slide="true" 
    :mouse-navigation="false" :keyboard-navigation="false" style="position: absolute; left: 50%; top: 0")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins } from "vue-property-decorator";
import EagleMarkdown from "./EagleMarkdown.vue";
import matter from "gray-matter";
import exampleMd from "raw-loader!../../example.md";

@Component({
  components: { EagleMarkdown }
})
export default class EagleEditor extends Vue {
  cmOptions = {
    mode: {
      name: "yaml-frontmatter",
      base: "markdown"
    }
  }

  raw = exampleMd;
  markdown = "";
  line: number = 0;
  offset: number = 0;
  showPreview = true;
  headers: any = {};

  get codemirror(): CodeMirror.Editor {
    return (this.$refs.cm as any).codemirror;
  }

  mounted() {
    this.codemirror.setSize("100%", "100%");
    this.codemirror.addKeyMap({
      "Cmd-P": () => {this.showPreview = !this.showPreview},
      "Ctrl-P": () => {this.showPreview = !this.showPreview}
    });
    this.codemirror.on("cursorActivity", (instance) => {
      this.line = instance.getCursor().line - this.offset;
    });
    this.codemirror.on("change", (instance) => {
      this.line = instance.getCursor().line - this.offset;
    });
    this.onCmCodeChange();
  }

  onCmCodeChange() {
    try {
      const m = matter(this.raw);
      Vue.set(this, "headers", m.data);
      this.markdown = m.content;
      this.offset = this.raw.replace(m.content, "").split("\n").length - 1;
    } catch(e) {
      this.markdown = this.raw;
      this.offset = 0;
    }
  }
}
</script>

<style lang="scss" scoped>
// .CodeMirror {
//   height: 100vh;
// }

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