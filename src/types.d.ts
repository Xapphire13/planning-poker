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

declare module "react-with-styles/lib/WithStylesContext" {
  import { Context } from "react";

  declare const context: Context<{ stylesInterface: any, stylesTheme: any }>;
  export default context;
}

declare module "react-with-styles/lib/hooks/useStyles" {
  import { Styles } from "../../index";

  declare function useStyles<TStyles extends Styles>({ stylesFn }: { stylesFn: (...args: any[]) => TStyles }): {
    css: Function;
    styles: TStyles;
  }

  export default useStyles;
}

declare module "simpsons-names" {
  interface SimpsonsNames {
    all: string[];
    random(): string;
    random(number: number): string[];
  };

  const _: SimpsonsNames;

  export default _;
}