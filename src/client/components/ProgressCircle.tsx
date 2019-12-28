import React, { useRef, useEffect, useState } from "react";
import ProgressBar from "progressbar.js";
import useStyles from "react-with-styles/lib/hooks/useStyles";
import { createStylesFn } from "../../shared/theme/createStylesFn";
import Theme from ":shared/theme/DefaultTheme";

export type ProgressCircleProps = {
  value: number;
  max: number;
};

const stylesFn = createStylesFn(() => ({
  container: {
    position: "relative",
    width: "100%",
    height: "100%"
  }
}));

export default function ProgressCircle({ value, max }: ProgressCircleProps) {
  const { css, styles } = useStyles({ stylesFn });
  const [circle, setCircle] = useState<ProgressBar.Circle>();
  const [progress, setProgress] = useState(value / max);
  const containerRef = useRef<HTMLDivElement>(null);

  const progressText = `${value} / ${max}`;

  useEffect(() => {
    if (containerRef.current) {
      const circle = new ProgressBar.Circle(containerRef.current, {
        color: Theme.color.primary,
        trailWidth: 0.5,
        text: {
          value: progressText
        }
      });
      if (circle.text) {
        circle.text.style.color = Theme.color.text.default;
      }
      setCircle(circle);
    }
  }, []);

  useEffect(() => {
    setProgress(value / max);
  }, [value, max]);

  useEffect(() => {
    if (circle) {
      circle.setText(progressText);
      circle.animate(progress);
    }
  }, [circle, progress, progressText]);

  return <div ref={containerRef} {...css(styles.container)} />;
}