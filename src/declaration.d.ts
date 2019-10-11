declare module "raw-loader!*" {
  const md: string;
  export default md;
}

declare module "vue-codemirror";
declare module "eagle.js" {
  import { Vue, Prop, Component } from "vue-property-decorator";

  export default Eagle;
  
  const Eagle: {
    install: (vue: any, options: any) => void;
    use: (it: any, options?: any) => void;
  };

  @Component
  export class Slideshow extends Vue {
    @Prop() firstSlide: number;
    @Prop() lastSlide: number | null;
    @Prop() startStep: number;
    @Prop() mouseNavigation: boolean;
    @Prop() keyboardNavigation: boolean;
    @Prop() embedded: boolean;
    @Prop() inserted: boolean;
    @Prop() onStartExit: boolean;
    @Prop() onEndExit: boolean;
    @Prop() backBySlide: boolean;
    @Prop() repeat: boolean;
    @Prop() zoom: boolean;

    currentSlideIndex: number;
    currentSlide: number | null;
    step: number;
    slideshowTimer: number;
    slideTimer: number;
    slides: any[];
    active: boolean;

    findSlides(): void;
    nextStep(): void;
    previousStep(): void;
    nextSlide(): void;
    previousSlide(): void;
    changeDirection(direction: "prev" | "next"): void;
  }
}