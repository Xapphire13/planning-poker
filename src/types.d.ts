declare module "progressbar.js" {
  import { CSSProperties } from "react";
  interface CircleOptions {
    color?: string;
    strokeWidth?: number;

    trailWidth?: number;
    text?: {
      value: string;
    }
  }

  export class Circle {
    constructor(element: string | HTMLElement, options?: CircleOptions)

    get text(): HTMLParagraphElement | undefined;
    setText(newText: string): void;
    animate(progress: number): void;
  }
}