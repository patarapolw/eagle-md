<template lang="pug">
.eg-slideshow
  slide(v-for="it0, i0 in items" :key="'ss' + i0" :steps="it0.length"
      enter-prev="slideInLeft" leave-prev="slideOutRight" enter-next="slideInRight" leave-next="slideOutLeft")
    raw(v-for="it1, i1 in it0" :key="'ss' + i0 + 's' + i1" v-if="step === i1 + 1"
      :lang="it1.lang" :text="it1.text")
</template>

<script lang="ts">
/// <reference path="../declaration.d.ts"/>
import { Vue, Component, Prop, Mixins, Watch } from "vue-property-decorator";
import Raw , { IRaw } from "./Raw.vue";
import { Slideshow } from "eagle.js";

@Component({
  components: { Raw }
})
export default class EagleMarkdown extends Mixins(Slideshow) {
  @Prop() markdown!: string;
  @Prop() line!: number;

  private items: IRaw[][] = [
    [{text: "", lang: ""}]
  ];

  mounted() {
    window.addEventListener("keydown", this.keyboardListener);
    this.updateContent();
  }

  @Watch("markdown")
  updateContent() {
    this.items = this.markdown.split(/^(?:---|===)$/gm).map((el) => el.split(/^--$/gm).map((it) => {
      const m = /(?:^|\r?\n)```(\S+)\r?\n(.+)```(?:\r?\n|$)/ms.exec(it);

      if (m) {
        const [_, lang, text] = m;

        return {lang, text};
      }

      return {lang: "markdown", text: it};
    }));

    this.$nextTick(() => {
      this.findSlides();
      this.watchCursor();
    });
  }

  @Watch("line")
  watchCursor() {
    let slideNumber = 0;
    let stepNumber = 0;
    let i = 0;

    for (const row of this.markdown.split("\n")) {
      if (/^(?:---|===)$/.test(row)) {
        slideNumber++;
        stepNumber = 0;
      } else if (/^--$/.test(row)) {
        stepNumber++;
      }

      i++;
      if (i >= this.line) {
        break;
      }
    }

    if (this.currentSlideIndex <= slideNumber) {
      this.changeDirection("next");
    } else {
      this.changeDirection("prev");
    }

    this.$nextTick(() => {
      this.currentSlideIndex = slideNumber + 1;
      this.$nextTick(() => {
        this.step = stepNumber + 1;
      });
    })
  }

  destroyed() {
    window.removeEventListener("keydown", this.keyboardListener);
  }

  async keyboardListener(ev: KeyboardEvent) {
    if (ev.code === "ArrowUp") {
      if (this.step > 1) {
        await this.animateSlide("slideOutUp");
        this.previousStep();
        await this.animateSlide("slideInUp");
      }
    } else if (ev.code === "ArrowDown") {
      if (this.step < this.items[this.currentSlideIndex - 1].length) {
        await this.animateSlide("slideOutDown");
        this.nextStep();
        await this.animateSlide("slideInDown");
      }
    } else if (ev.code === "ArrowRight") {
      if (this.currentSlideIndex < this.items.length) {
        this.changeDirection("next");
        this.$nextTick(() => {
          this.nextSlide();
        });
      }
    } else if (ev.code === "ArrowLeft") {
      if (this.currentSlideIndex > 1) {
        this.changeDirection("prev");
        this.$nextTick(() => {
          this.previousSlide();
        });
      }
    }
  }

  async animateSlide(animationName: string) {
    const nodes = document.getElementsByClassName("eg-slide");

    const node = nodes[0];
    node.classList.remove("d-none");
    node.classList.add('animated', animationName, "fast");

    await new Promise((resolve) => {
      function handleAnimationEnd() {
        node.classList.remove('animated', animationName, "fast");
        node.removeEventListener('animationend', handleAnimationEnd);

        resolve();
      }

      node.addEventListener('animationend', handleAnimationEnd)
    })
  }
}
</script>

<style lang="scss">
.eg-slideshow {
  background-repeat: repeat;

  .eg-slide-content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    text-align: center;
    font-size: 8vh;
  }
}

small {
  font-size: 3vh;
}
</style>