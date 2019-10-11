<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import pug from "hyperpug";
import showdown from "showdown";
import { CreateElement } from 'vue';

export interface IRaw {
  text: string;
  lang: string; // "markdown" | "html" | "pug" | "pre"
}

const mdConverter = new showdown.Converter();
mdConverter.setFlavor("github");

const pugFilters = {
  markdown: (text: string) => {
    return mdConverter.makeHtml(text);
  }
};

@Component
export default class Raw extends Vue {
  @Prop() text!: string;
  @Prop({default: "pre"}) lang!: string;

  render(h: CreateElement){
    let html: string;

    switch(this.lang) {
      case "markdown": html = mdConverter.makeHtml(this.text); break;
      case "html": html = this.text; break;
      case "pug": html = pug.compile({filters: pugFilters})(this.text); break;
      default:
        const pre = document.createElement("pre");
        pre.innerText = this.text;
        html = pre.outerHTML;
    }

    return h("div", {domProps: {innerHTML: html}});

    /** If you need to compile Vue components */

    // const div = document.createElement("div");
    // div.innerHTML = html;
    // return h(Vue.compile(div.outerHTML));
  }
}
</script>